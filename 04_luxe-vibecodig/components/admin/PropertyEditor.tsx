'use client';

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/components/providers/I18nProvider';
import type { Database } from '@/types/database.types';

type PropertyCategory = Database['public']['Enums']['property_category'];
type PropertyStatus = Database['public']['Enums']['property_status'];
type PropertyType = Database['public']['Enums']['property_type'];
type PricePeriod = Database['public']['Enums']['price_period'];

const CATEGORIES: PropertyCategory[] = ['Apartment', 'House', 'Villa', 'Penthouse', 'Commercial'];
const STATUSES: PropertyStatus[] = ['for-sale', 'for-rent', 'sold', 'draft'];

function isPropertyCategory(value: string): value is PropertyCategory {
  return CATEGORIES.some((category) => category === value);
}

function isPropertyStatus(value: string): value is PropertyStatus {
  return STATUSES.some((status) => status === value);
}

export interface PropertyEditorData {
  title: string;
  location: string;
  price: string;
  pricePeriod: PricePeriod;
  type: PropertyType;
  status: PropertyStatus;
  category: PropertyCategory;
  beds: string;
  baths: string;
  areaSqM: string;
  yearBuilt: string;
  parkingSpots: string;
  description: string;
  amenities: string[];
  images: string[];
  isFeatured: boolean;
}

interface GalleryImage {
  id: string;
  url: string;
  file?: File;
}

interface PropertyEditorProps {
  initialData: PropertyEditorData;
  isEditing: boolean;
  isSaving: boolean;
  error: string;
  onCancel: () => void;
  onSave: (data: PropertyEditorData, files: File[], saveAsDraft: boolean) => void;
}

const AMENITIES = ['Swimming Pool', 'Garden', 'Air Conditioning', 'Smart Home'];
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function PropertyEditor({
  initialData,
  isEditing,
  isSaving,
  error,
  onCancel,
  onSave,
}: PropertyEditorProps) {
  const { t } = useI18n();
  const copy = t.admin.propertyForm;
  const [form, setForm] = useState(initialData);
  const [gallery, setGallery] = useState<GalleryImage[]>(() =>
    initialData.images.map((url, index) => ({ id: `existing-${index}-${url}`, url })),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrls = useRef(new Set<string>());

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const addFiles = (files: FileList | File[]) => {
    setFileError('');
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError(copy.invalidImageType);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setFileError(copy.imageTooLarge);
        continue;
      }
      validFiles.push(file);
    }

    const nextImages = validFiles.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.current.add(url);
      return { id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, url, file };
    });
    if (nextImages.length > 0) setGallery((current) => [...current, ...nextImages]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeImage = (image: GalleryImage) => {
    if (image.file) {
      URL.revokeObjectURL(image.url);
      previewUrls.current.delete(image.url);
    }
    setGallery((current) => current.filter((item) => item.id !== image.id));
  };

  const setMainImage = (image: GalleryImage) => {
    setGallery((current) => [image, ...current.filter((item) => item.id !== image.id)]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const saveAsDraft = submitter instanceof HTMLButtonElement && submitter.value === 'draft';
    const files = gallery.flatMap((image) => (image.file ? [image.file] : []));
    onSave({ ...form, images: gallery.map((image) => image.url) }, files, saveAsDraft);
  };

  const update = <K extends keyof PropertyEditorData>(key: K, value: PropertyEditorData[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const incrementField = (key: 'beds' | 'baths' | 'parkingSpots', amount: number) => {
    update(key, String(Math.max(0, (Number(form[key]) || 0) + amount)));
  };

  const counter = (key: 'beds' | 'baths' | 'parkingSpots', label: string, icon: string) => (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 font-sf-pro text-sm font-medium text-nordic">
        <span aria-hidden="true" className="material-icons text-sm text-gray-400">{icon}</span>
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
        <button
          aria-label={`${copy.decrease} ${label}`}
          className="flex h-8 w-8 items-center justify-center border-r border-gray-100 text-gray-600 transition-colors hover:bg-gray-50"
          disabled={isSaving}
          onClick={() => incrementField(key, -1)}
          type="button"
        >
          −
        </button>
        <span className="w-10 text-center font-sf-pro text-sm font-medium text-nordic">{form[key]}</span>
        <button
          aria-label={`${copy.increase} ${label}`}
          className="flex h-8 w-8 items-center justify-center border-l border-gray-100 text-gray-600 transition-colors hover:bg-gray-50"
          disabled={isSaving}
          onClick={() => incrementField(key, 1)}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );

  const fieldClass =
    'w-full rounded-md border-gray-200 bg-white px-4 py-2.5 font-sf-pro text-base text-nordic transition-all placeholder:text-gray-400 focus:border-mosque focus:ring-1 focus:ring-mosque disabled:opacity-60';

  return (
    <main className="property-editor-font fixed inset-0 z-30 overflow-y-auto bg-clear-day text-nordic selection:bg-hint-green selection:text-nordic">
      <nav className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2" href="/admin">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nordic text-white">
              <span aria-hidden="true" className="material-icons text-xl">villa</span>
            </span>
            <span className="font-sf-pro text-2xl font-bold tracking-tight text-nordic">Estates.</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-sf-pro text-sm font-medium text-gray-500 sm:inline">
              {t.admin.dashboard}
            </span>
            <button
              aria-label={copy.close}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-nordic"
              disabled={isSaving}
              onClick={onCancel}
              type="button"
            >
              <span aria-hidden="true" className="material-icons">close</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 flex flex-col justify-between gap-6 border-b border-gray-200 pb-7 md:flex-row md:items-end">
          <div className="space-y-4">
            <nav aria-label={copy.breadcrumb} className="flex">
              <ol className="flex items-center space-x-2 font-sf-pro text-sm font-medium text-gray-500">
                <li><button className="transition-colors hover:text-mosque" onClick={onCancel} type="button">{copy.properties}</button></li>
                <li aria-hidden="true"><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
                <li aria-current="page" className="text-nordic">{isEditing ? copy.edit : copy.addNew}</li>
              </ol>
            </nav>
            <div>
              <h1 className="mb-2 font-sf-pro text-3xl font-bold tracking-tight text-nordic md:text-4xl">
                {isEditing ? copy.editTitle : copy.addTitle}
              </h1>
              <p className="max-w-2xl font-sf-pro text-base text-gray-500">{copy.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-sf-pro text-sm font-medium text-nordic transition-colors hover:bg-gray-50 disabled:opacity-60"
              disabled={isSaving}
              form="property-editor"
              name="intent"
              type="submit"
              value="draft"
            >
              {copy.saveDraft}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-mosque px-5 py-2.5 font-sf-pro text-sm font-medium text-white shadow-md transition-all hover:bg-nordic hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
              disabled={isSaving}
              form="property-editor"
              type="submit"
            >
              <span aria-hidden="true" className="material-icons text-sm">save</span>
              {isSaving ? t.admin.saving : copy.saveProperty}
            </button>
          </div>
        </header>

        {(error || fileError) && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sf-pro text-sm text-red-800" role="alert">
            {error || fileError}
          </p>
        )}

        <form className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12" id="property-editor" onSubmit={handleSubmit}>
          <div className="space-y-8 xl:col-span-8">
            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-hint-green/30 bg-gradient-to-r from-hint-green/10 to-transparent px-6 py-5 sm:px-8">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hint-green text-nordic"><span aria-hidden="true" className="material-icons text-lg">info</span></span>
                <h2 className="font-sf-pro text-xl font-bold text-nordic">{copy.basicInformation}</h2>
              </div>
              <div className="space-y-6 p-6 sm:p-8">
                <label className="block font-sf-pro text-sm font-medium text-nordic" htmlFor="property-title">
                  {copy.propertyTitle} <span className="text-red-500">*</span>
                  <input className={`${fieldClass} mt-1.5`} disabled={isSaving} id="property-title" maxLength={160} onChange={(event) => update('title', event.target.value)} placeholder={copy.titlePlaceholder} required value={form.title} />
                </label>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <label className="font-sf-pro text-sm font-medium text-nordic" htmlFor="property-price">
                    {t.admin.price} <span className="text-red-500">*</span>
                    <span className="relative mt-1.5 block">
                      <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 font-sf-pro text-sm text-gray-400">$</span>
                      <input className={`${fieldClass} pl-7`} disabled={isSaving} id="property-price" min="1" onChange={(event) => update('price', event.target.value)} placeholder="0.00" required step="any" type="number" value={form.price} />
                    </span>
                  </label>
                  <label className="font-sf-pro text-sm font-medium text-nordic" htmlFor="property-status">
                    {copy.status}
                    <select className={`${fieldClass} mt-1.5 cursor-pointer`} disabled={isSaving} id="property-status" onChange={(event) => {
                      const status = event.target.value;
                      if (isPropertyStatus(status)) {
                        setForm((current) => ({
                          ...current,
                          status,
                          type: status === 'for-rent'
                            ? 'rent'
                            : status === 'for-sale'
                              ? 'sale'
                              : current.type,
                        }));
                      }
                    }} value={form.status}>
                      <option value="for-sale">{copy.forSale}</option>
                      <option value="for-rent">{copy.forRent}</option>
                      <option value="sold">{copy.sold}</option>
                      <option value="draft">{copy.draft}</option>
                    </select>
                  </label>
                  <label className="font-sf-pro text-sm font-medium text-nordic" htmlFor="property-category">
                    {copy.propertyType}
                    <select className={`${fieldClass} mt-1.5 cursor-pointer`} disabled={isSaving} id="property-category" onChange={(event) => {
                      if (isPropertyCategory(event.target.value)) update('category', event.target.value);
                    }} value={form.category}>
                      <option value="Apartment">{t.home.categories.Apartment}</option>
                      <option value="House">{t.home.categories.House}</option>
                      <option value="Villa">{t.home.categories.Villa}</option>
                      <option value="Penthouse">{t.home.categories.Penthouse}</option>
                      <option value="Commercial">{copy.commercial}</option>
                    </select>
                  </label>
                  {form.status === 'for-rent' && (
                    <label className="font-sf-pro text-sm font-medium text-nordic" htmlFor="property-price-period">
                      {t.admin.period}
                      <select className={`${fieldClass} mt-1.5 cursor-pointer`} disabled={isSaving} id="property-price-period" onChange={(event) => {
                        if (event.target.value === 'mo' || event.target.value === 'year') {
                          update('pricePeriod', event.target.value);
                        }
                      }} value={form.pricePeriod}>
                        <option value="mo">{t.admin.monthly}</option>
                        <option value="year">{t.admin.yearly}</option>
                      </select>
                    </label>
                  )}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-hint-green/30 bg-gradient-to-r from-hint-green/10 to-transparent px-6 py-5 sm:px-8">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hint-green text-nordic"><span aria-hidden="true" className="material-icons text-lg">description</span></span>
                <h2 className="font-sf-pro text-xl font-bold text-nordic">{t.admin.description}</h2>
              </div>
              <div className="p-6 sm:p-8">
                <textarea className={`${fieldClass} min-h-[200px] resize-y leading-relaxed`} disabled={isSaving} maxLength={2000} onChange={(event) => update('description', event.target.value)} placeholder={copy.descriptionPlaceholder} value={form.description} />
                <div className="mt-2 text-right font-sf-pro text-xs text-gray-400">{form.description.length} / 2000 {copy.characters}</div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-hint-green/30 bg-gradient-to-r from-hint-green/10 to-transparent px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hint-green text-nordic"><span aria-hidden="true" className="material-icons text-lg">image</span></span>
                  <h2 className="font-sf-pro text-xl font-bold text-nordic">{copy.gallery}</h2>
                </div>
                <span className="rounded bg-gray-100 px-2 py-1 font-sf-pro text-xs font-medium text-gray-500">JPG, PNG, WEBP</span>
              </div>
              <div className="p-6 sm:p-8">
                <div
                  className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors sm:p-10 ${isDragging ? 'border-mosque bg-hint-green/20' : 'border-gray-300 bg-gray-50/50 hover:border-mosque/40 hover:bg-hint-green/10'}`}
                  onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    disabled={isSaving}
                    multiple
                    onChange={(event) => {
                      if (event.target.files) addFiles(event.target.files);
                      event.target.value = '';
                    }}
                    ref={inputRef}
                    type="file"
                  />
                  <div className="pointer-events-none flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-mosque shadow-sm transition-transform duration-300 group-hover:scale-110"><span aria-hidden="true" className="material-icons text-2xl">cloud_upload</span></span>
                    <div className="space-y-1">
                      <p className="font-sf-pro text-base font-medium text-nordic">{copy.dropImages}</p>
                      <p className="font-sf-pro text-xs text-gray-400">{copy.imageSizeLimit}</p>
                    </div>
                    <span className="pointer-events-auto rounded-lg bg-mosque px-4 py-2 font-sf-pro text-sm font-medium text-white">{copy.chooseFiles}</span>
                  </div>
                </div>
                <div aria-live="polite" className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {gallery.map((image, index) => (
                    <div className="group relative aspect-square overflow-hidden rounded-lg shadow-sm" key={image.id}>
                      <Image
                        alt={`${form.title || copy.propertyImage} ${index + 1}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        src={image.url}
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-nordic/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {index !== 0 && (
                          <button aria-label={copy.makeMainImage} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-nordic transition-colors hover:bg-gray-50" disabled={isSaving} onClick={() => setMainImage(image)} type="button">
                            <span aria-hidden="true" className="material-icons text-sm">star</span>
                          </button>
                        )}
                        <button aria-label={copy.removeImage} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 transition-colors hover:bg-red-50" disabled={isSaving} onClick={() => removeImage(image)} type="button">
                          <span aria-hidden="true" className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                      {index === 0 && <span className="absolute left-2 top-2 rounded bg-mosque px-2 py-0.5 font-sf-pro text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">{copy.main}</span>}
                    </div>
                  ))}
                  <button className="group flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 transition-all hover:border-mosque hover:bg-hint-green/20 hover:text-mosque" disabled={isSaving} onClick={() => inputRef.current?.click()} type="button">
                    <span aria-hidden="true" className="material-icons transition-transform group-hover:scale-110">add</span>
                    <span className="mt-1 font-sf-pro text-xs font-medium">{copy.addMore}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8 xl:col-span-4">
            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-hint-green/30 bg-gradient-to-r from-hint-green/10 to-transparent px-6 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hint-green text-nordic"><span aria-hidden="true" className="material-icons text-lg">place</span></span>
                <h2 className="font-sf-pro text-lg font-bold text-nordic">{t.admin.location}</h2>
              </div>
              <div className="space-y-4 p-6">
                <label className="block font-sf-pro text-sm font-medium text-nordic" htmlFor="property-location">
                  {copy.address}
                  <input className={`${fieldClass} mt-1.5 text-sm`} disabled={isSaving} id="property-location" maxLength={240} onChange={(event) => update('location', event.target.value)} placeholder={copy.addressPlaceholder} required value={form.location} />
                </label>
                <div aria-label={copy.mapPreview} className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-[#e5efe8]">
                  <div aria-hidden="true" className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(32deg, transparent 46%, white 47%, white 50%, transparent 51%), linear-gradient(145deg, transparent 40%, #c4ddc4 41%, #c4ddc4 48%, transparent 49%), linear-gradient(90deg, transparent 48%, white 49%, white 52%, transparent 53%)', backgroundSize: '54px 48px, 78px 66px, 64px 58px' }} />
                  <span className="relative flex items-center gap-1 rounded bg-white/90 px-3 py-1.5 font-sf-pro text-xs font-bold text-nordic shadow-sm"><span aria-hidden="true" className="material-icons text-sm text-mosque">map</span>{copy.mapPreview}</span>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm xl:sticky xl:top-24">
              <div className="flex items-center gap-3 border-b border-hint-green/30 bg-gradient-to-r from-hint-green/10 to-transparent px-6 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hint-green text-nordic"><span aria-hidden="true" className="material-icons text-lg">straighten</span></span>
                <h2 className="font-sf-pro text-lg font-bold text-nordic">{copy.details}</h2>
              </div>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <label className="font-sf-pro text-xs font-medium text-gray-500" htmlFor="property-area">{t.admin.area}
                    <input className={`${fieldClass} mt-1 bg-gray-50 text-sm`} disabled={isSaving} id="property-area" min="1" onChange={(event) => update('areaSqM', event.target.value)} placeholder="0" required step="any" type="number" value={form.areaSqM} />
                  </label>
                  <label className="font-sf-pro text-xs font-medium text-gray-500" htmlFor="property-year">{copy.yearBuilt}
                    <input className={`${fieldClass} mt-1 bg-gray-50 text-sm`} disabled={isSaving} id="property-year" max={new Date().getFullYear()} min="0" onChange={(event) => update('yearBuilt', event.target.value)} placeholder="YYYY" type="number" value={form.yearBuilt} />
                  </label>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-4">
                  {counter('beds', copy.bedrooms, 'bed')}
                  {counter('baths', copy.bathrooms, 'shower')}
                  {counter('parkingSpots', copy.parking, 'directions_car')}
                </div>
                <hr className="border-gray-100" />
                <fieldset>
                  <legend className="mb-3 font-sf-pro text-xs font-bold uppercase tracking-wider text-gray-500">{copy.amenities}</legend>
                  <div className="space-y-2">
                    {AMENITIES.map((amenity) => (
                      <label className="group flex cursor-pointer items-center gap-2.5" key={amenity}>
                        <input checked={form.amenities.includes(amenity)} className="h-4 w-4 rounded border-gray-300 text-mosque focus:ring-mosque" disabled={isSaving} onChange={(event) => update('amenities', event.target.checked ? [...form.amenities, amenity] : form.amenities.filter((item) => item !== amenity))} type="checkbox" />
                        <span className="font-sf-pro text-sm text-gray-700 transition-colors group-hover:text-nordic">{copy.amenityNames[amenity]}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <hr className="border-gray-100" />
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input checked={form.isFeatured} className="h-4 w-4 rounded border-gray-300 text-mosque focus:ring-mosque" disabled={isSaving} onChange={(event) => update('isFeatured', event.target.checked)} type="checkbox" />
                  <span className="font-sf-pro text-sm font-medium text-nordic">{copy.featured}</span>
                </label>
              </div>
            </section>
          </div>
          <div className="flex gap-3 xl:hidden">
            <button className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-sf-pro font-medium text-nordic disabled:opacity-60" disabled={isSaving} onClick={onCancel} type="button">{t.admin.cancel}</button>
            <button className="flex-1 rounded-lg bg-mosque py-3 font-sf-pro font-medium text-white disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? t.admin.saving : copy.saveProperty}</button>
          </div>
        </form>
      </div>

      <footer className="mt-12 border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center font-sf-pro text-xs text-gray-400 sm:px-6 lg:px-8">
          {copy.footer}
        </div>
      </footer>
    </main>
  );
}
