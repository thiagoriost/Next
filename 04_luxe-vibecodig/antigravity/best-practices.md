# 🏠 Buenas Prácticas — Next.js para Bienes Raíces

> Guía de referencia para construir aplicaciones de venta/renta de propiedades con Next.js de forma escalable, performante y con excelente experiencia de usuario.

---

## 📁 Arquitectura y Estructura de Proyecto

- **Usa App Router** (`/app`) con layouts anidados para compartir UI entre secciones (listados, detalle, dashboard de agente).
- **Organiza por feature**, no por tipo de archivo:
  ```
  app/
    (marketing)/        ← páginas públicas (home, about, contacto)
    (listings)/         ← búsqueda, filtros, detalle de propiedad
    (dashboard)/        ← área privada del agente/admin
    api/                ← route handlers
  components/
    ui/                 ← componentes genéricos reutilizables
    listings/           ← PropertyCard, PropertyMap, PropertyGallery
    search/             ← SearchBar, FilterPanel, SortDropdown
  ```
- **Separa Server Components de Client Components** — usa `"use client"` solo cuando sea estrictamente necesario (interactividad, hooks de estado).
- **Centraliza los tipos TypeScript** en `/types` — `Property`, `Agent`, `SearchFilters`, `Location`, etc.
- **Usa path aliases** en `tsconfig.json` (`@/components`, `@/lib`, `@/types`) para evitar rutas relativas largas.
- **No hardcodees strings** — centraliza textos en archivos de i18n o constantes.

---

## 🔍 SEO y Metadatos

- **Genera metadatos dinámicos por propiedad** usando la función `generateMetadata` de Next.js:
  ```ts
  export async function generateMetadata({ params }): Promise<Metadata> {
    const property = await getProperty(params.slug);
    return {
      title: `${property.title} — ${property.location} | TuInmobiliaria`,
      description: property.description.slice(0, 160),
      openGraph: {
        images: [property.images[0]],
      },
    };
  }
  ```
- **Implementa JSON-LD (Schema.org)** con el tipo `RealEstateListing` para mejorar los rich snippets en Google.
- **Genera sitemap dinámico** (`/app/sitemap.ts`) incluyendo todas las propiedades activas.
- **Genera robots.txt** bloqueando rutas privadas como `/dashboard` y `/admin`.
- **Usa URLs amigables** con slugs descriptivos: `/propiedades/casa-3-recamaras-polanco-cdmx` en vez de `/property/12345`.
- **Configura canónicas** para evitar contenido duplicado en páginas de filtros paginados.
- **Implementa hreflang** si manejas múltiples idiomas o regiones.

---

## ⚡ Rendimiento y Optimización

- **Usa `next/image`** para todas las imágenes de propiedades — activar `priority` en la imagen hero/principal del detalle.
- **Implementa lazy loading** con Intersection Observer para galerías largas de imágenes.
- **Usa Static Generation (SSG) con ISR** para páginas de listados:
  ```ts
  export const revalidate = 3600; // revalidar cada hora
  ```
- **Implementa Streaming** con `<Suspense>` para que el mapa y los filtros carguen de forma progresiva.
- **Cachea resultados de búsqueda** frecuentes usando el cache de Next.js (`unstable_cache`) o Redis.
- **Minimiza Client Components** — las tarjetas de propiedades deben ser Server Components excepto favoritos/comparar.
- **Usa `loading.tsx`** para skeleton screens en listas y páginas de detalle.
- **Habilita compresión y CDN** para imágenes (Cloudinary, Vercel Image Optimization, Imgix).
- **Elimina dependencias innecesarias** — evalúa si realmente necesitas una librería de mapa completa o una versión ligera.

---

## 🗺️ Mapas e Integración Geoespacial

- **Carga el mapa dinámicamente** con `next/dynamic` y `ssr: false` para evitar errores de hidratación:
  ```ts
  const PropertyMap = dynamic(() => import("@/components/PropertyMap"), { ssr: false });
  ```
- **Usa coordenadas precisas** (latitud/longitud) en la base de datos, no solo dirección textual.
- **Implementa clustering de marcadores** para zonas con muchas propiedades (evita renders costosos).
- **Permite búsqueda por zona dibujada en el mapa** (polígonos) como lo hace Zillow.
- **Muestra puntos de interés cercanos** (escuelas, hospitales, metro) como dato de valor añadido.
- **Proveedor recomendado**: Mapbox GL JS, Leaflet + OpenStreetMap (gratuito), o Google Maps Platform.

---

## 🔎 Búsqueda y Filtros

- **Sincroniza filtros con la URL** usando `useSearchParams` y `router.push` — permite compartir búsquedas y volver atrás:
  ```
  /propiedades?tipo=casa&precio_max=5000000&recamaras=3&zona=polanco
  ```
- **Debounce en campos de texto** (búsqueda por nombre/colonia) para evitar requests excesivos.
- **Implementa búsqueda facetada** — muestra el conteo de resultados por cada filtro antes de aplicarlo.
- **Usa Algolia, Typesense o Meilisearch** para búsquedas complejas y con typo-tolerance si el volumen lo justifica.
- **Ordena por relevancia**, no solo por fecha — considera precio, calidad de fotografías, vistas.
- **Guarda búsquedas recientes** en localStorage para mejorar la UX de usuarios recurrentes.
- **Implementa paginación basada en cursor** (o infinite scroll) en lugar de paginación offset para grandes datasets.

---

## 🏡 Fichas de Propiedad (Detalle)

- **Galería de imágenes optimizada**: thumbnail strip + imagen principal + modo lightbox/fullscreen.
- **Tour virtual 360°**: integra Matterport o Google Street View embebido cuando esté disponible.
- **Calculadora de hipoteca integrada**: campo de enganche, plazo y tasa para calcular mensualidad en tiempo real.
- **Tabla de características clara**: recámaras, baños, m², estacionamientos, antigüedad, tipo de tenencia.
- **Sección "Zona y entorno"**: mapa interactivo con POIs y score de walkability/transporte.
- **Propiedades similares**: carrusel de recomendaciones basado en precio, zona y tipo.
- **Historial de precio**: gráfica simple si el precio cambió (genera confianza).
- **Botón de contacto flotante** en mobile que permanece visible durante el scroll.
- **Compartir en redes** con Open Graph bien configurado para que la preview sea atractiva.

---

## 🔐 Autenticación y Roles

- **Usa NextAuth.js (Auth.js v5)** para manejar sesiones — soporta providers sociales (Google, Facebook) ideales para el perfil del comprador.
- **Define roles claros**:
  - `buyer` — puede guardar favoritos, agendar visitas, contactar agente.
  - `agent` — puede publicar y gestionar propiedades.
  - `admin` — acceso completo al panel de control.
- **Protege rutas del dashboard** con middleware de Next.js, no solo en el cliente.
- **Nunca expongas** llaves de API de mapas o servicios externos al cliente — usa Route Handlers como proxy.
- **Implementa rate limiting** en endpoints de contacto/formularios para evitar spam.

---

## 🎨 UI/UX y Diseño

- **Mobile-first es obligatorio** — más del 60% del tráfico inmobiliario es móvil.
- **El tiempo a la primera imagen de propiedad debe ser menor a 2.5 segundos** (Core Web Vitals: LCP).
- **Usa skeleton screens** en lugar de spinners para listas de propiedades.
- **Implementa "favoritos"** con optimistic UI — el corazón debe responder al instante.
- **Modo oscuro/claro**: respetar la preferencia del sistema con `prefers-color-scheme`.
- **Diseño de tarjeta de propiedad**: imagen dominante, precio destacado, datos clave (recámaras, baños, m²) a primera vista.
- **CTA claro en cada página**: "Agendar visita", "Contactar agente", "Ver en mapa".
- **Breadcrumbs en páginas de detalle** para navegación clara y SEO.
- **Formulario de contacto corto**: nombre, teléfono y mensaje — cada campo extra reduce conversión.

---

## ♿ Accesibilidad (a11y)

- **Todas las imágenes de propiedades deben tener `alt` descriptivo**: `"Sala de estar, departamento en Polanco, 3 recámaras"`.
- **El mapa interactivo debe tener alternativa textual** (listado de propiedades cercanas).
- **Controles del carrusel de imágenes** deben ser navegables por teclado.
- **Focus visible** en todos los elementos interactivos (no elimines el outline por defecto sin reemplazarlo).
- **Usa `aria-live`** para anunciar cambios dinámicos al aplicar filtros.
- **Ratio de contraste mínimo** 4.5:1 para texto normal (WCAG AA).
- **Semántica HTML correcta**: usa `<main>`, `<nav>`, `<article>` para cada ficha, `<header>`, `<footer>`.

---

## 🌍 Internacionalización (i18n)

- **Usa el i18n de Next.js** (`next-intl` o `i18next`) si operas en múltiples países o idiomas.
- **Localiza precios**: formato de moneda según región (`$1,500,000 MXN` vs `USD 75,000`).
- **Localiza unidades**: m² vs ft², nomenclatura de recámaras (bedroom vs recámara vs habitación).
- **Separa contenido traducible** del código — usa archivos JSON por locale (`es.json`, `en.json`).

---

## 💾 Datos y Base de Datos

- **Usa Supabase o PostgreSQL** con PostGIS para consultas geoespaciales (`ST_DWithin`, `ST_Contains`).
- **Indexa correctamente**: precio, tipo de propiedad, ubicación (GiST para geometrías), estado (activa/vendida).
- **Diseño de tabla `properties`** mínimo:
  ```sql
  id, slug, title, description, price, currency,
  property_type, operation_type (venta/renta),
  bedrooms, bathrooms, area_m2, parking_spots,
  address, city, state, country, lat, lng,
  agent_id, status (active/sold/paused),
  created_at, updated_at
  ```
- **Guarda imágenes en Supabase Storage o S3** — no en la base de datos.
- **Implementa soft delete** para propiedades (`deleted_at`) — mantén el historial.
- **Usa Row Level Security (RLS)** en Supabase para que agentes solo vean/editen sus propiedades.

---

## 🧪 Testing y Calidad

- **Tests E2E con Playwright** para flujos críticos: búsqueda → detalle → formulario de contacto.
- **Tests de componentes** con Vitest + Testing Library para PropertyCard, SearchBar, PriceCalculator.
- **Valida formularios** tanto en el cliente (zod + react-hook-form) como en el servidor (route handlers).
- **Lighthouse CI** en pipeline para prevenir regresiones de rendimiento y accesibilidad.
- **ESLint + Prettier** configurados y obligatorios en el CI — no mezcles estilos de código.
- **Revisa Core Web Vitals** regularmente en Search Console: LCP, CLS, INP.

---

## 🚀 Deployment y DevOps

- **Despliega en Vercel** para aprovechar Edge Network, ISR y Analytics integrados.
- **Variables de entorno en `.env.local`** — nunca commitees llaves API al repositorio.
- **Usa ramas de preview** para revisar cambios antes de mergear a main.
- **Configura alertas** de errores con Sentry o similar.
- **Monitorea el uptime** y tiempos de respuesta de la API.
- **CDN para assets estáticos** (imágenes, fuentes, iconos).

---

## 💡 Ideas y Funcionalidades Premium

- **IA para descripción de propiedades**: genera automáticamente texto SEO-optimizado a partir de las características.
- **Comparador de propiedades**: lado a lado con hasta 3 propiedades seleccionadas.
- **Alertas de nueva propiedad**: el usuario configura criterios y recibe email/push cuando hay match.
- **Chat en vivo con agente** integrado (Intercom, Tidio o solución propia con Supabase Realtime).
- **Agenda de visitas**: calendario integrado donde el comprador elige horario sin llamar al agente.
- **Score de inversión**: tasa de retorno estimada para propiedades en renta basado en precio de zona.
- **Integración con portales externos**: publicación simultánea en Inmuebles24, Lamudi, Propiedades.com vía API.
- **Panel de analíticas para el agente**: vistas, contactos, conversión por propiedad.
- **Realidad aumentada (AR)**: coloca muebles virtuales en la propiedad desde el celular.
- **Historial de mercado**: gráfica de precio por m² en la zona en los últimos 12 meses.

---

## 📋 Checklist Rápido antes de Lanzar

- [ ] Todas las páginas tienen `<title>` y `<meta description>` únicos
- [ ] JSON-LD implementado en fichas de propiedad
- [ ] Sitemap generado y enviado a Google Search Console
- [ ] Imágenes servidas con `next/image` y tamaños optimizados
- [ ] Formularios con validación client + server side
- [ ] Rutas protegidas con middleware de autenticación
- [ ] Variables de entorno fuera del repositorio
- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Pruebas E2E en flujos críticos
- [ ] Lighthouse score > 90 en Performance y Accessibility
- [ ] robots.txt y canonical tags configurados
- [ ] Rate limiting en endpoints de contacto

---

*Última actualización: Octubre 2026*
