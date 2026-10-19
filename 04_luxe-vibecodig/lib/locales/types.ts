export type Locale = 'en' | 'es';

export interface Translations {
  localeName: string;
  flag: string;
  common: {
    brand: string;
    loading: string;
    viewAll: string;
    search: string;
    filters: string;
    clearFilters: string;
    forRent: string;
    forSale: string;
    featuredBadge: string;
    beds: string;
    baths: string;
    perMonth: string;
  };
  navbar: {
    buy: string;
    rent: string;
    sell: string;
    savedHomes: string;
    searchAria: string;
    notificationsAria: string;
    userProfileAria: string;
    language: string;
    toggleMenuAria: string;
  };
  home: {
    pageTitle: string;
    pageTitleHighlight: string;
    pageSubtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    filtersButton: string;
    categories: {
      All: string;
      House: string;
      Apartment: string;
      Condo: string;
      Villa: string;
      Penthouse: string;
      Townhouse: string;
    };
    featuredTitle: string;
    featuredSubtitle: string;
    viewAll: string;
    marketTitle: string;
    marketSubtitle: string;
    marketTabs: {
      All: string;
      Buy: string;
      Rent: string;
    };
    noResults: string;
    noResultsDesc: string;
    showing: string;
    pageOf: string;
    propertiesTotal: string;
    previousPage: string;
    nextPage: string;
  };
  filters: {
    title: string;
    location: string;
    locationPlaceholder: string;
    price: string;
    priceRange: string;
    anyPrice: string;
    minPrice: string;
    maxPrice: string;
    propertyType: string;
    anyType: string;
    bedrooms: string;
    bathrooms: string;
    any: string;
    amenities: string;
    clearAll: string;
    showSingle: string;
    showMultiple: string;
    amenityNames: Record<string, string>;
    propertyTypeOptions: Record<string, string>;
  };
  footer: {
    tagline: string;
    description: string;
    availableLanguages: string;
    rightsReserved: string;
    navigation: string;
    quickLinks: {
      buy: string;
      rent: string;
      sell: string;
      savedHomes: string;
    };
  };
}
