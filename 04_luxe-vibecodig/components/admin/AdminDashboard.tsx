'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { Database } from '@/types/database.types';

type PropertyRow = Database['public']['Tables']['properties']['Row'];
type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];
type PropertyCategory = Database['public']['Enums']['property_category'];
type PropertyType = Database['public']['Enums']['property_type'];
type PricePeriod = Database['public']['Enums']['price_period'];
type Section = 'properties' | 'users';

const PAGE_SIZE = 8;
const ROLE_OPTIONS: { value: AppRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visor' },
];
const CATEGORIES: PropertyCategory[] = ['House', 'Apartment', 'Villa', 'Penthouse'];

function isAppRole(value: string): value is AppRole {
  return ROLE_OPTIONS.some((option) => option.value === value);
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

function formatPrice(price: number, type: PropertyType, period: PricePeriod | null) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  return type === 'rent' ? `${formatted}/${period === 'year' ? 'año' : 'mes'}` : formatted;
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
}: {
  page: number;
  pageCount: number;
  onChange: (nextPage: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-between border-t border-[#e9efed] px-5 py-4">
      <span className="text-sm text-[#71827f]">
        Página <strong className="text-[#19322F]">{page}</strong> de{' '}
        <strong className="text-[#19322F]">{pageCount}</strong>
      </span>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-[#dce8e5] px-4 py-2 text-sm font-medium transition hover:bg-[#f4f8f7] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          type="button"
        >
          Anterior
        </button>
        <button
          className="rounded-lg border border-[#dce8e5] px-4 py-2 text-sm font-medium transition hover:bg-[#f4f8f7] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
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
      setError('No se pudieron cargar las propiedades. Inténtalo de nuevo.');
    } else {
      setProperties(data ?? []);
      setPropertyCount(count ?? 0);
    }
    setLoading(false);
  }, [fetchProperties]);

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
        setError('No se pudieron cargar las propiedades. Inténtalo de nuevo.');
      } else {
        setProperties(data ?? []);
        setPropertyCount(count ?? 0);
      }
      setLoading(false);
    }).catch((fetchError: unknown) => {
      if (!active) return;
      console.error('[AdminDashboard] Failed to load properties:', fetchError);
      setError('No se pudieron cargar las propiedades. Inténtalo de nuevo.');
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [fetchProperties]);

  useEffect(() => {
    let active = true;
    void fetchUsers().then(({ data, count, error: queryError }) => {
      if (!active) return;
      if (queryError) {
        console.error('[AdminDashboard] Failed to load user roles:', queryError.message);
        setError('No se pudieron cargar los usuarios. Inténtalo de nuevo.');
      } else {
        setUsers(data ?? []);
        setUserCount(count ?? 0);
      }
      setUsersLoading(false);
    }).catch((fetchError: unknown) => {
      if (!active) return;
      console.error('[AdminDashboard] Failed to load user roles:', fetchError);
      setError('No se pudieron cargar los usuarios. Inténtalo de nuevo.');
      setUsersLoading(false);
    });
    return () => {
      active = false;
    };
  }, [fetchUsers]);

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
      setError('No se pudo guardar la propiedad. Comprueba los datos e inténtalo de nuevo.');
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
    if (!window.confirm(`¿Eliminar «${property.title}»? Esta acción no se puede deshacer.`)) {
      return;
    }

    setError('');
    const { error: deleteError } = await getSupabaseBrowserClient()
      .from('properties')
      .delete()
      .eq('id', property.id);

    if (deleteError) {
      console.error('[AdminDashboard] Failed to delete property:', deleteError.message);
      setError('No se pudo eliminar la propiedad. Inténtalo de nuevo.');
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
      setError('No se pudo actualizar el rol. Inténtalo de nuevo.');
    } else {
      setUsers((current) =>
        current.map((item) => (item.user_id === target.user_id ? { ...item, role } : item)),
      );
    }
    setChangingRole(null);
  };

  const handleSignOut = async () => {
    const signOutError = await signOut();
    if (signOutError) {
      console.error('[AdminDashboard] Failed to sign out:', signOutError.message);
      setError('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    }
  };

  const propertyPages = Math.max(1, Math.ceil(propertyCount / PAGE_SIZE));
  const userPages = Math.max(1, Math.ceil(userCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-[#EEF6F6] text-[#19322F]">
      <header className="sticky top-0 z-20 border-b border-[#dce8e5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <a className="flex items-center gap-3 text-xl font-semibold tracking-tight" href="/admin">
            <span className="material-symbols-outlined rounded-lg bg-[#006655] p-2 text-white">domain</span>
            LuxeEstate
            <span className="hidden rounded-full bg-[#e5f1ee] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#006655] sm:inline">
              Admin
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm text-[#5C706D] sm:block">
              {user?.email}
            </span>
            <button
              className="rounded-lg border border-[#dce8e5] px-3 py-2 text-sm font-medium transition hover:bg-[#f4f8f7]"
              onClick={() => void handleSignOut()}
              type="button"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#006655]">Administración</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {section === 'properties' ? 'Propiedades' : 'Usuarios y roles'}
            </h1>
            <p className="mt-2 text-[#5C706D]">
              {section === 'properties'
                ? 'Administra las publicaciones y el contenido del catálogo.'
                : 'Controla los permisos de las cuentas registradas.'}
            </p>
          </div>
          {section === 'properties' && (
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006655] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#005544]"
              onClick={openCreateForm}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined">add</span>
              Nueva propiedad
            </button>
          )}
        </div>

        <div aria-label="Secciones del panel" className="mt-8 flex gap-2 border-b border-[#d6e2df]" role="tablist">
          {([
            ['properties', 'Propiedades', 'home_work'],
            ['users', 'Usuarios y roles', 'manage_accounts'],
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
          <section aria-label="Listado de propiedades" className="mt-6 overflow-hidden rounded-2xl border border-[#e0eae7] bg-white shadow-[0_4px_18px_-12px_rgba(25,50,47,0.2)]" role="tabpanel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9efed] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Publicaciones</h2>
              <span className="text-sm text-[#71827f]">{propertyCount} en total</span>
            </div>
            {loading ? (
              <p aria-live="polite" className="px-6 py-16 text-center text-sm text-[#71827f]">Cargando propiedades…</p>
            ) : properties.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="font-medium">Aún no hay propiedades publicadas.</p>
                <p className="mt-2 text-sm text-[#71827f]">Crea una publicación para empezar.</p>
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
                            {formatPrice(property.price, property.type, property.price_period)}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#71827f]">
                            <span>{property.beds} hab.</span>
                            <span aria-hidden="true">·</span>
                            <span>{property.baths} baños</span>
                            <span aria-hidden="true">·</span>
                            <span>{property.area_sq_m} m²</span>
                            {property.is_featured && (
                              <span className="rounded-full bg-[#e7f3e2] px-2 py-0.5 font-medium text-[#47703d]">
                                Destacada
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
                          Ver
                        </a>
                        <button
                          aria-label={`Editar ${property.title}`}
                          className="rounded-lg border border-[#dce8e5] px-3 py-2 text-sm font-medium transition hover:bg-[#f4f8f7]"
                          onClick={() => openEditForm(property)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          aria-label={`Eliminar ${property.title}`}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                          onClick={() => void deleteProperty(property)}
                          type="button"
                        >
                          Eliminar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <Pagination
                  page={propertyPage}
                  pageCount={propertyPages}
                  onChange={(nextPage) => {
                    setLoading(true);
                    setPropertyPage(nextPage);
                  }}
                />
              </>
            )}
          </section>
        ) : (
          <section aria-label="Usuarios y roles" className="mt-6 overflow-hidden rounded-2xl border border-[#e0eae7] bg-white shadow-[0_4px_18px_-12px_rgba(25,50,47,0.2)]" role="tabpanel">
            <div className="flex items-center justify-between gap-3 border-b border-[#e9efed] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Cuentas registradas</h2>
              <span className="text-sm text-[#71827f]">{userCount} usuarios</span>
            </div>
            {usersLoading ? (
              <p aria-live="polite" className="px-6 py-16 text-center text-sm text-[#71827f]">Cargando usuarios…</p>
            ) : users.length === 0 ? (
              <p aria-live="polite" className="px-6 py-16 text-center text-sm text-[#71827f]">
                No hay otros usuarios registrados.
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
                            {isCurrentUser && <span className="text-xs font-medium text-[#006655]">Tu cuenta</span>}
                          </div>
                        </div>
                        <label className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-[#71827f]">Rol</span>
                          <select
                            aria-label={`Rol de ${item.email}`}
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
                              <option key={option.value} value={option.value}>{option.label}</option>
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
                  Gestión de propiedades
                </p>
                <h2 className="mt-2 text-2xl font-semibold" id="property-form-title">
                  {editingProperty ? 'Editar propiedad' : 'Nueva propiedad'}
                </h2>
              </div>
              <button
                aria-label="Cerrar formulario"
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
                Nombre de la propiedad
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
                  maxLength={160}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                  value={form.title}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                Ubicación
                <input
                  className="rounded-lg border border-[#dce8e5] px-3 py-2.5 outline-none focus:border-[#006655] focus:ring-2 focus:ring-[#006655]/15"
                  maxLength={240}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  required
                  value={form.location}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Tipo de operación
                <select
                  className="rounded-lg border border-[#dce8e5] bg-white px-3 py-2.5 outline-none focus:border-[#006655]"
                  onChange={(event) => {
                    if (isPropertyType(event.target.value)) {
                      setForm({ ...form, type: event.target.value });
                    }
                  }}
                  value={form.type}
                >
                  <option value="sale">Venta</option>
                  <option value="rent">Alquiler</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Categoría
                <select
                  className="rounded-lg border border-[#dce8e5] bg-white px-3 py-2.5 outline-none focus:border-[#006655]"
                  onChange={(event) => {
                    if (isPropertyCategory(event.target.value)) {
                      setForm({ ...form, category: event.target.value });
                    }
                  }}
                  value={form.category}
                >
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Precio (USD)
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
                  Periodo
                  <select
                    className="rounded-lg border border-[#dce8e5] bg-white px-3 py-2.5 outline-none focus:border-[#006655]"
                    onChange={(event) => {
                      if (isPricePeriod(event.target.value)) {
                        setForm({ ...form, pricePeriod: event.target.value });
                      }
                    }}
                    value={form.pricePeriod}
                  >
                    <option value="mo">Mensual</option>
                    <option value="year">Anual</option>
                  </select>
                </label>
              )}
              <label className="grid gap-1.5 text-sm font-medium">
                Habitaciones
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
                Baños
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
                Superficie (m²)
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
                URL de la imagen principal
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
                Descripción
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
                Mostrar en propiedades destacadas
              </label>
              <div className="flex justify-end gap-3 border-t border-[#e9efed] pt-5 sm:col-span-2">
                <button
                  className="rounded-lg border border-[#dce8e5] px-4 py-2.5 text-sm font-semibold hover:bg-[#f4f8f7] disabled:opacity-50"
                  disabled={isSaving}
                  onClick={() => setIsFormOpen(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="rounded-lg bg-[#006655] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#005544] disabled:cursor-wait disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? 'Guardando…' : editingProperty ? 'Guardar cambios' : 'Crear propiedad'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
