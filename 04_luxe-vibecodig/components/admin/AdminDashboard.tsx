'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { Locale } from '@/lib/i18n';
import type { Database } from '@/types/database.types';

type PropertyRow = Database['public']['Tables']['properties']['Row'];
type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];
type PropertyCategory = Database['public']['Enums']['property_category'];
type PropertyType = Database['public']['Enums']['property_type'];
type PricePeriod = Database['public']['Enums']['price_period'];
type Section = 'properties' | 'users';

const PAGE_SIZE = 8;
const ROLE_OPTIONS: AppRole[] = ['admin', 'editor', 'viewer'];
const CATEGORIES: PropertyCategory[] = ['House', 'Apartment', 'Villa', 'Penthouse'];

function isAppRole(value: string): value is AppRole {
  return ROLE_OPTIONS.some((role) => role === value);
}

function isPropertyType(value: string): value is PropertyType {
  return value === 'sale' || value === 'rent';
}

function isPropertyCategory(value: string): value is PropertyCategory {
  return CATEGORIES.some((category) => category === value);
}

function isPricePeriod(value: string): value is PricePeriod {
  return value === 'mo' || value === 'year';
}

interface PropertyForm {
  title: string;
  location: string;
  price: string;
  pricePeriod: PricePeriod;
  type: PropertyType;
  category: PropertyCategory;
  beds: string;
  baths: string;
  areaSqM: string;
  imageUrl: string;
  description: string;
  isFeatured: boolean;
}

const EMPTY_FORM: PropertyForm = {
  title: '',
  location: '',
  price: '',
  pricePeriod: 'mo',
  type: 'sale',
  category: 'House',
  beds: '1',
  baths: '1',
  areaSqM: '',
  imageUrl: '',
  description: '',
  isFeatured: false,
};

function formatPrice(
  price: number,
  type: PropertyType,
  period: PricePeriod | null,
  locale: Locale,
) {
  const formatted = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  if (type !== 'rent') return formatted;
  const periodLabel =
    locale === 'es'
      ? period === 'year' ? 'año' : 'mes'
      : period === 'year' ? 'year' : 'month';
  return `${formatted}/${periodLabel}`;
}

function createSlug(title: string, id: string) {
  const normalized = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${normalized || 'propiedad'}-${id.slice(0, 8)}`;
}

function Pagination({
  page,
  pageCount,
  onChange,
  previousLabel,
  nextLabel,
  pageLabel,
  ofLabel,
  paginationLabel,
}: {
  page: number;
  pageCount: number;
  onChange: (nextPage: number) => void;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
  ofLabel: string;
  paginationLabel: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label={paginationLabel} className="flex items-center justify-between border-t border-[#e9efed] px-5 py-4">
      <span className="text-sm text-[#71827f]">
        {pageLabel} <strong className="text-[#19322F]">{page}</strong> {ofLabel}{' '}
        <strong className="text-[#19322F]">{pageCount}</strong>
      </span>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-[#dce8e5] px-4 py-2 text-sm font-medium transition hover:bg-[#f4f8f7] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          type="button"
        >
          {previousLabel}
        </button>
        <button
          className="rounded-lg border border-[#dce8e5] px-4 py-2 text-sm font-medium transition hover:bg-[#f4f8f7] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          type="button"
        >
          {nextLabel}
        </button>
      </div>
    </nav>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { locale, t } = useI18n();
  const copy = t.admin;
  const [section, setSection] = useState<Section>('properties');
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [propertyPage, setPropertyPage] = useState(1);
  const [users, setUsers] = useState<UserRoleRow[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [usersLoading, setUsersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyRow | null>(null);
  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [signOutPending, setSignOutPending] = useState(false);

  const fetchProperties = useCallback(async () => {
    const from = (propertyPage - 1) * PAGE_SIZE;
    return getSupabaseBrowserClient()
      .from('properties')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
  }, [propertyPage]);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, count, error: queryError } = await fetchProperties();

    if (queryError) {
      console.error('[AdminDashboard] Failed to load properties:', queryError.message);
      setError(copy.loadPropertiesError);
    } else {
      setProperties(data ?? []);
      setPropertyCount(count ?? 0);
    }
    setLoading(false);
  }, [copy.loadPropertiesError, fetchProperties]);

  const fetchUsers = useCallback(async () => {
    const from = (userPage - 1) * PAGE_SIZE;
    return getSupabaseBrowserClient()
      .from('user_roles')
      .select('*', { count: 'exact' })
      .order('email')
      .range(from, from + PAGE_SIZE - 1);
  }, [userPage]);

  useEffect(() => {
    let active = true;
    void fetchProperties().then(({ data, count, error: queryError }) => {
      if (!active) return;
      if (queryError) {
        console.error('[AdminDashboard] Failed to load properties:', queryError.message);
        setError(copy.loadPropertiesError);
      } else {
        setProperties(data ?? []);
        setPropertyCount(count ?? 0);
      }
      setLoading(false);
    }).catch((fetchError: unknown) => {
      if (!active) return;
      console.error('[AdminDashboard] Failed to load properties:', fetchError);
      setError(copy.loadPropertiesError);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [copy.loadPropertiesError, fetchProperties]);

  useEffect(() => {
    let active = true;
    void fetchUsers().then(({ data, count, error: queryError }) => {
      if (!active) return;
      if (queryError) {
        console.error('[AdminDashboard] Failed to load user roles:', queryError.message);
        setError(copy.loadUsersError);
      } else {
        setUsers(data ?? []);
        setUserCount(count ?? 0);
      }
      setUsersLoading(false);
    }).catch((fetchError: unknown) => {
      if (!active) return;
      console.error('[AdminDashboard] Failed to load user roles:', fetchError);
      setError(copy.loadUsersError);
      setUsersLoading(false);
    });
    return () => {
      active = false;
    };
  }, [copy.loadUsersError, fetchUsers]);

  const openCreateForm = () => {
    setError('');
    setEditingProperty(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (property: PropertyRow) => {
    setError('');
    setEditingProperty(property);
    setForm({
      title: property.title,
      location: property.location,
      price: String(property.price),
      pricePeriod: property.price_period ?? 'mo',
      type: property.type,
      category: property.category,
      beds: String(property.beds),
      baths: String(property.baths),
      areaSqM: String(property.area_sq_m),
      imageUrl: property.images[0] ?? property.image_url,
      description: property.description ?? '',
      isFeatured: property.is_featured ?? false,
    });
    setIsFormOpen(true);
  };

  const saveProperty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    const id = editingProperty?.id ?? crypto.randomUUID();
    const imageUrl = form.imageUrl.trim();
    const values: Database['public']['Tables']['properties']['Insert'] = {
      id,
      slug: editingProperty?.slug ?? createSlug(form.title, id),
      title: form.title.trim(),
      location: form.location.trim(),
      price: Number(form.price),
      price_period: form.type === 'rent' ? form.pricePeriod : null,
      type: form.type,
      category: form.category,
      beds: Number(form.beds),
      baths: Number(form.baths),
      area_sq_m: Number(form.areaSqM),
      image_url: imageUrl,
      image_alt: form.title.trim(),
      images: [imageUrl],
      description: form.description.trim() || null,
      is_featured: form.isFeatured,
    };

    const supabase = getSupabaseBrowserClient();
    const result = editingProperty
      ? await supabase.from('properties').update(values).eq('id', editingProperty.id)
      : await supabase.from('properties').insert(values);

    if (result.error) {
      console.error('[AdminDashboard] Failed to save property:', result.error.message);
      setError(copy.savePropertyError);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setIsFormOpen(false);
    setEditingProperty(null);
    if (!editingProperty) setPropertyPage(1);
    else await loadProperties();
  };

  const deleteProperty = async (property: PropertyRow) => {
    if (!window.confirm(copy.confirmDelete.replace('{title}', property.title))) {
      return;
    }

    setError('');
    const { error: deleteError } = await getSupabaseBrowserClient()
      .from('properties')
      .delete()
      .eq('id', property.id);

    if (deleteError) {
      console.error('[AdminDashboard] Failed to delete property:', deleteError.message);
      setError(copy.deletePropertyError);
      return;
    }

    if (properties.length === 1 && propertyPage > 1) setPropertyPage(propertyPage - 1);
    else await loadProperties();
  };

  const updateRole = async (target: UserRoleRow, role: AppRole) => {
    setError('');
    setChangingRole(target.user_id);
    const { error: updateError } = await getSupabaseBrowserClient()
      .from('user_roles')
      .update({ role })
      .eq('user_id', target.user_id);

    if (updateError) {
      console.error('[AdminDashboard] Failed to update user role:', updateError.message);
      setError(copy.updateRoleError);
    } else {
      setUsers((current) =>
        current.map((item) => (item.user_id === target.user_id ? { ...item, role } : item)),
      );
    }
    setChangingRole(null);
  };

  const handleSignOut = async () => {
    setSignOutPending(true);
    setError('');
    try {
      const signOutError = await signOut();
      if (signOutError) throw signOutError;
      router.replace('/');
    } catch (signOutError) {
      console.error('[AdminDashboard] Failed to sign out:', signOutError);
      setError(copy.signOutError);
    } finally {
      setSignOutPending(false);
    }
  };

  const propertyPages = Math.max(1, Math.ceil(propertyCount / PAGE_SIZE));
  const userPages = Math.max(1, Math.ceil(userCount / PAGE_SIZE));
  const roleLabels: Record<AppRole, string> = {
    admin: copy.administrator,
    editor: copy.editor,
    viewer: copy.viewer,
  };

  return (
    <main className="min-h-screen bg-[#EEF6F6] text-[#19322F]">
      <header className="sticky top-0 z-20 border-b border-[#dce8e5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link
            aria-label={t.common.brand}
            className="flex items-center gap-3 text-xl font-semibold tracking-tight"
            href="/"
          >
            <span className="material-symbols-outlined rounded-lg bg-[#006655] p-2 text-white">domain</span>
            {t.common.brand}
            <span className="hidden rounded-full bg-[#e5f1ee] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#006655] sm:inline">
              {/* {copy.label} */}/
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm text-[#5C706D] sm:block">
              {user?.email}
            </span>
            <button
              className="rounded-lg border border-[#dce8e5] px-3 py-2 text-sm font-medium transition hover:bg-[#f4f8f7]"
              disabled={signOutPending}
              onClick={() => void handleSignOut()}
              type="button"
            >
              {signOutPending ? t.navbar.signingOut : copy.signOut}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#006655]">{copy.dashboard}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {section === 'properties' ? copy.properties : copy.usersAndRoles}
            </h1>
            <p className="mt-2 text-[#5C706D]">
              {section === 'properties'
                ? copy.propertiesDescription
                : copy.usersDescription}
            </p>
          </div>
          {section === 'properties' && (
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006655] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#005544]"
              onClick={openCreateForm}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined">add</span>
              {copy.newProperty}
            </button>
          )}
        </div>

        <div aria-label={copy.dashboard} className="mt-8 flex gap-2 border-b border-[#d6e2df]" role="tablist">
          {([
            ['properties', copy.properties, 'home_work'],
            ['users', copy.usersAndRoles, 'manage_accounts'],
          ] as const).map(([key, label, icon]) => (
            <button
              aria-selected={section === key}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                section === key
                  ? 'border-[#006655] text-[#006655]'
                  : 'border-transparent text-[#71827f] hover:text-[#19322F]'
              }`}
              key={key}
              onClick={() => {
                setError('');
                setSection(key);
              }}
              role="tab"
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[19px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        {section === 'properties' ? (
          <section aria-label={copy.properties} className="mt-6 overflow-hidden rounded-2xl border border-[#e0eae7] bg-white shadow-[0_4px_18px_-12px_rgba(25,50,47,0.2)]" role="tabpanel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9efed] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">{copy.listings}</h2>
              <span className="text-sm text-[#71827f]">{copy.totalProperties.replace('{count}', String(propertyCount))}</span>
            </div>
            {loading ? (
              <p aria-live="polite" className="px-6 py-16 text-center text-sm text-[#71827f]">{copy.loadingProperties}</p>
            ) : properties.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="font-medium">{copy.noProperties}</p>
                <p className="mt-2 text-sm text-[#71827f]">{copy.createFirstProperty}</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#edf2f0]">
                  {properties.map((property) => (
                    <article className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6" key={property.id}>
                      <div className="flex min-w-0 items-center gap-4">
                        <img
                          alt=""
                          className="h-20 w-24 shrink-0 rounded-xl bg-[#e9efed] object-cover"
                          src={property.images[0] ?? property.image_url}
                        />
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">{property.title}</h3>
                          <p className="mt-1 truncate text-sm text-[#71827f]">{property.location}</p>
                          <p className="mt-2 text-sm font-semibold text-[#006655]">
                            {formatPrice(property.price, property.type, property.price_period, locale)}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#71827f]">
                            <span>{property.beds} {copy.bedroomsShort}</span>
                            <span aria-hidden="true">·</span>
                            <span>{property.baths} {copy.bathroomsShort}</span>
                            <span aria-hidden="true">·</span>
                            <span>{property.area_sq_m} m²</span>
                            {property.is_featured && (
                              <span className="rounded-full bg-[#e7f3e2] px-2 py-0.5 font-medium text-[#47703d]">
                                {copy.featured}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <a
                          className="rounded-lg border border-[#dce8e5] px-3 py-2 text-sm font-medium transition hover:bg-[#f4f8f7]"
                          href={`/properties/${property.slug}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {copy.view}
                        </a>
                        <button
                          aria-label={`${copy.edit} ${property.title}`}
                          className="rounded-lg border border-[#dce8e5] px-3 py-2 text-sm font-medium transition hover:bg-[#f4f8f7]"
                          onClick={() => openEditForm(property)}
                          type="button"
                        >
                          {copy.edit}
                        </button>
                        <button
                          aria-label={`${copy.delete} ${property.title}`}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                          onClick={() => void deleteProperty(property)}
                          type="button"
                        >
                          {copy.delete}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <Pagination
                  page={propertyPage}
                  pageCount={propertyPages}
                  previousLabel={copy.previous}
                  nextLabel={copy.next}
                  pageLabel={copy.page}
                  ofLabel={copy.of}
                  paginationLabel={copy.pagination}
                  onChange={(nextPage) => {
                    setLoading(true);
                    setPropertyPage(nextPage);
                  }}
                />
              </>
            )}
          </section>
        ) : (
          <section aria-label={copy.usersAndRoles} className="mt-6 overflow-hidden rounded-2xl border border-[#e0eae7] bg-white shadow-[0_4px_18px_-12px_rgba(25,50,47,0.2)]" role="tabpanel">
            <div className="flex items-center justify-between gap-3 border-b border-[#e9efed] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">{copy.registeredAccounts}</h2>
              <span className="text-sm text-[#71827f]">{userCount} {copy.users}</span>
            </div>
            {usersLoading ? (
              <p aria-live="polite" className="px-6 py-16 text-center text-sm text-[#71827f]">{copy.loadingUsers}</p>
            ) : users.length === 0 ? (
              <p aria-live="polite" className="px-6 py-16 text-center text-sm text-[#71827f]">
                {copy.noUsers}
              </p>
            ) : (
              <>
                <div className="divide-y divide-[#edf2f0]">
                  {users.map((item) => {
                    const isCurrentUser = item.user_id === user?.id;
                    return (
                      <article className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6" key={item.user_id}>
                        <div className="flex min-w-0 items-center gap-3">
                          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7f1ee] text-[#006655]">
                            <span className="material-symbols-outlined">person</span>
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">{item.full_name || item.email}</h3>
                            <p className="truncate text-sm text-[#71827f]">{item.email}</p>
                            {isCurrentUser && <span className="text-xs font-medium text-[#006655]">{copy.yourAccount}</span>}
                          </div>
                        </div>
                        <label className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-[#71827f]">{copy.role}</span>
                          <select
                            aria-label={`${copy.role}: ${item.email}`}
                            className="min-w-40 rounded-lg border border-[#dce8e5] bg-white px-3 py-2 font-medium outline-none focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15 disabled:opacity-50"
                            disabled={isCurrentUser || changingRole === item.user_id}
                            onChange={(event) => {
                              if (isAppRole(event.target.value)) {
                                void updateRole(item, event.target.value);
                              }
                            }}
                            value={item.role}
                          >
                            {ROLE_OPTIONS.map((option) => (
                              <option key={option} value={option}>{roleLabels[option]}</option>
                            ))}
                          </select>
                        </label>
                      </article>
                    );
                  })}
                </div>
                <Pagination
                  page={userPage}
                  pageCount={userPages}
                  previousLabel={copy.previous}
                  nextLabel={copy.next}
                  pageLabel={copy.page}
                  ofLabel={copy.of}
                  paginationLabel={copy.pagination}
                  onChange={setUserPage}
                />
              </>
            )}
          </section>
        )}
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-[#10221f]/55 p-4 backdrop-blur-sm sm:items-center sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) setIsFormOpen(false);
          }}
        >
          <section aria-labelledby="property-form-title" aria-modal="true" className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8" role="dialog">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006655]">
                  {copy.propertyManagement}
                </p>
                <h2 className="mt-2 text-2xl font-semibold" id="property-form-title">
                  {editingProperty ? copy.editProperty : copy.newProperty}
                </h2>
              </div>
              <button
                aria-label={copy.closeForm}
                className="rounded-lg px-2 py-1 text-2xl leading-none text-[#71827f] hover:bg-[#f4f8f7]"
                disabled={isSaving}
                onClick={() => setIsFormOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void saveProperty(event)}>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                {copy.propertyName}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
                  maxLength={160}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                  value={form.title}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                {copy.location}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
                  maxLength={240}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  required
                  value={form.location}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                {copy.operationType}
                <select
                  className="rounded-lg border border-[#dce8e5] bg-white px-3 py-2.5 outline-none focus:border-[#006655]"
                  onChange={(event) => {
                    if (isPropertyType(event.target.value)) {
                      setForm({ ...form, type: event.target.value });
                    }
                  }}
                  value={form.type}
                >
                  <option value="sale">{copy.sale}</option>
                  <option value="rent">{copy.rent}</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                {copy.category}
                <select
                  className="rounded-lg border border-[#dce8e5] bg-white px-3 py-2.5 outline-none focus:border-[#006655]"
                  onChange={(event) => {
                    if (isPropertyCategory(event.target.value)) {
                      setForm({ ...form, category: event.target.value });
                    }
                  }}
                  value={form.category}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{t.home.categories[category]}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                {copy.price}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655]"
                  min="1"
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  required
                  step="any"
                  type="number"
                  value={form.price}
                />
              </label>
              {form.type === 'rent' && (
                <label className="grid gap-1.5 text-sm font-medium">
                  {copy.period}
                  <select
                    className="rounded-lg border border-[#dce8e5] bg-white px-3 py-2.5 outline-none focus:border-[#006655]"
                    onChange={(event) => {
                      if (isPricePeriod(event.target.value)) {
                        setForm({ ...form, pricePeriod: event.target.value });
                      }
                    }}
                    value={form.pricePeriod}
                  >
                    <option value="mo">{copy.monthly}</option>
                    <option value="year">{copy.yearly}</option>
                  </select>
                </label>
              )}
              <label className="grid gap-1.5 text-sm font-medium">
                {copy.beds}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655]"
                  min="0"
                  onChange={(event) => setForm({ ...form, beds: event.target.value })}
                  required
                  step="any"
                  type="number"
                  value={form.beds}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                {copy.baths}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655]"
                  min="0"
                  onChange={(event) => setForm({ ...form, baths: event.target.value })}
                  required
                  step="any"
                  type="number"
                  value={form.baths}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                {copy.area}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655]"
                  min="1"
                  onChange={(event) => setForm({ ...form, areaSqM: event.target.value })}
                  required
                  step="any"
                  type="number"
                  value={form.areaSqM}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                {copy.mainImageUrl}
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655]"
                  onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                  placeholder="https://…"
                  required
                  type="url"
                  value={form.imageUrl}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                {copy.description}
                <textarea
                  className="min-h-24 resize-y rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  rows={3}
                  value={form.description}
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
                <input
                  checked={form.isFeatured}
                  className="h-4 w-4 accent-[#006655]"
                  onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
                  type="checkbox"
                />
                {copy.featuredCheckbox}
              </label>
              <div className="flex justify-end gap-3 border-t border-[#e9efed] pt-5 sm:col-span-2">
                <button
                  className="rounded-lg border border-[#dce8e5] px-4 py-2.5 text-sm font-semibold hover:bg-[#f4f8f7] disabled:opacity-50"
                  disabled={isSaving}
                  onClick={() => setIsFormOpen(false)}
                  type="button"
                >
                  {copy.cancel}
                </button>
                <button
                  className="rounded-lg bg-[#006655] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#005544] disabled:cursor-wait disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? copy.saving : editingProperty ? copy.saveChanges : copy.createProperty}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
