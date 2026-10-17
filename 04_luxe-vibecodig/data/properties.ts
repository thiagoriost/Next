import { Property, PropertyCategory } from '@/types/property';

export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  'All',
  'House',
  'Apartment',
  'Villa',
  'Penthouse',
];

export const FEATURED_PROPERTIES: Property[] = [
  {
    id: 'feat-1',
    title: 'The Glass Pavilion',
    location: 'Beverly Hills, California',
    price: 5250000,
    type: 'sale',
    category: 'Villa',
    beds: 5,
    baths: 4.5,
    areaSqM: 4200,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM',
    imageAlt: 'Luxury modern villa exterior with pool',
    badge: 'Exclusive',
    badgeType: 'exclusive',
    isFeatured: true,
  },
  {
    id: 'feat-2',
    title: 'Azure Heights Penthouse',
    location: 'Downtown, Vancouver',
    price: 3800000,
    type: 'sale',
    category: 'Penthouse',
    beds: 3,
    baths: 3,
    areaSqM: 2100,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s',
    imageAlt: 'Modern interior living room with view',
    badge: 'New Arrival',
    badgeType: 'new',
    isFeatured: true,
  },
];

export const INITIAL_MARKET_PROPERTIES: Property[] = [
  {
    id: 'market-1',
    title: 'Modern Family Home',
    location: '123 Pine St, Seattle',
    price: 850000,
    type: 'sale',
    category: 'House',
    beds: 3,
    baths: 2,
    areaSqM: 120,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E',
    imageAlt: 'Modern white house facade',
    badge: 'FOR SALE',
    badgeType: 'sale',
  },
  {
    id: 'market-2',
    title: 'Urban Loft',
    location: '456 Elm Ave, Portland',
    price: 3200,
    pricePeriod: 'mo',
    type: 'rent',
    category: 'Apartment',
    beds: 1,
    baths: 1,
    areaSqM: 85,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4',
    imageAlt: 'Stylish apartment living room',
    badge: 'FOR RENT',
    badgeType: 'rent',
  },
  {
    id: 'market-3',
    title: 'Highland Retreat',
    location: '789 Mountain Rd, Bend',
    price: 620000,
    type: 'sale',
    category: 'House',
    beds: 2,
    baths: 2,
    areaSqM: 98,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro',
    imageAlt: 'Cabin in the woods exterior',
    badge: 'FOR SALE',
    badgeType: 'sale',
  },
  {
    id: 'market-4',
    title: 'Sea View Penthouse',
    location: '321 Ocean Dr, Miami',
    price: 4500,
    pricePeriod: 'mo',
    type: 'rent',
    category: 'Penthouse',
    beds: 3,
    baths: 3,
    areaSqM: 180,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U',
    imageAlt: 'Bright bedroom with large window',
    badge: 'FOR RENT',
    badgeType: 'rent',
  },
  {
    id: 'market-5',
    title: 'Central Studio',
    location: '555 Main St, Chicago',
    price: 550000,
    type: 'sale',
    category: 'Apartment',
    beds: 1,
    baths: 1,
    areaSqM: 50,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE',
    imageAlt: 'Cozy apartment interior',
    badge: 'FOR SALE',
    badgeType: 'sale',
  },
  {
    id: 'market-6',
    title: 'Garden Villa',
    location: '999 Oak Ln, Austin',
    price: 2800,
    pricePeriod: 'mo',
    type: 'rent',
    category: 'Villa',
    beds: 2,
    baths: 2,
    areaSqM: 110,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8',
    imageAlt: 'Modern minimalist home exterior',
    badge: 'FOR RENT',
    badgeType: 'rent',
  },
];

export const ADDITIONAL_MARKET_PROPERTIES: Property[] = [
  {
    id: 'market-7',
    title: 'Serene Lakeside Haven',
    location: '402 Emerald Bay, Lake Tahoe',
    price: 1450000,
    type: 'sale',
    category: 'House',
    beds: 4,
    baths: 3,
    areaSqM: 240,
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Serene lakeside luxury home',
    badge: 'FOR SALE',
    badgeType: 'sale',
  },
  {
    id: 'market-8',
    title: 'Skyline Horizon Residence',
    location: '88 Hudson Yards, New York',
    price: 6200,
    pricePeriod: 'mo',
    type: 'rent',
    category: 'Penthouse',
    beds: 2,
    baths: 2,
    areaSqM: 135,
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Luxury high rise apartment interior',
    badge: 'FOR RENT',
    badgeType: 'rent',
  },
  {
    id: 'market-9',
    title: 'Minimalist Forest Sanctuary',
    location: '15 Aspen Ridge, Aspen',
    price: 2950000,
    type: 'sale',
    category: 'Villa',
    beds: 3,
    baths: 3.5,
    areaSqM: 310,
    imageUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern minimalist architectural villa in nature',
    badge: 'FOR SALE',
    badgeType: 'sale',
  },
];

export function formatPrice(price: number, pricePeriod?: 'mo' | 'year'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  if (pricePeriod === 'mo') {
    return `${formatted}`;
  }
  return formatted;
}
