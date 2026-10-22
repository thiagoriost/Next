'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import PropertyGallery from './PropertyGallery';
import PropertyMap from './PropertyMap';
import { Property } from '@/types/property';
import { formatPrice } from '@/data/properties';
import { useI18n } from '@/components/providers/I18nProvider';

interface PropertyDetailScreenProps {
  property: Property;
}

export default function PropertyDetailScreen({ property }: PropertyDetailScreenProps) {

  const { locale, t } = useI18n(); // t = diccionarioDeTraducciones
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isMortgageModalOpen, setIsMortgageModalOpen] = useState(false);
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  useEffect(() => {
    
    console.log({property})
    return () => {
      
    }
  }, [property])
  

  // Mortgage calculation state
  const downPaymentPercent = 20;
  const loanTermYears = 30;
  const interestRate = 0.065; // 6.5%
  const principal = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 12;
  const numPayments = loanTermYears * 12;
  const estimatedMonthlyPayment =
    property.type === 'rent'
      ? property.price
      : Math.round(
          (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
            (Math.pow(1 + monthlyRate, numPayments) - 1)
        );

  const defaultAmenities = [
    'Smart Home System',
    'Swimming Pool',
    'Central Heating & Cooling',
    'Electric Vehicle Charging',
    'Private Gym',
    'Wine Cellar',
  ];

  const selectedAmenities =
    locale === 'es' ? property.amenitiesEs : property.amenities;
  const amenitiesList =
    selectedAmenities && selectedAmenities.length > 0
      ? selectedAmenities
      : property.amenities && property.amenities.length > 0
        ? property.amenities
        : defaultAmenities;

  const agentName = property.agentName || 'Sarah Jenkins';
  const agentImage =
    property.agentImageUrl ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80';

  const defaultDescription = t.propertyDetail.defaultDescription.replace(
    '{location}',
    property.location
  );
  const selectedDescription =
    locale === 'es' ? property.descriptionEs : property.description;
  const descriptionText =
    selectedDescription ||
    (locale === 'es' ? property.description : undefined) ||
    defaultDescription;

  return (
    <div className="min-h-screen bg-[#EEF6F6] text-[#19322F] selection:bg-[#006655]/20 font-sans">
      {/* Sticky Navbar with home navigation on logo */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs for SEO & UX */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center text-xs text-[#5C706D] gap-2 flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-[#006655] transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-icons text-sm">home</span>
            {t.propertyDetail.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${property.category}`}
            className="hover:text-[#006655] transition-colors font-medium"
          >
            {t.home.categories[property.category]}
          </Link>
          <span>/</span>
          <span className="text-[#19322F] font-semibold truncate max-w-sm">
            {property.title}
          </span>
        </nav>

        {/* 12-column Grid Layout exactly matching design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Gallery Column */}
          <div className="lg:col-span-8 space-y-4">
            <PropertyGallery
              images={property.images || []}
              title={property.title}
              badge={property.badge}
            />
          </div>

          {/* Sticky Sidebar Column */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              {/* Price & Agent Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#006655]/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-light text-[#19322F] mb-2">
                    {formatPrice(property.price)}
                    {property.pricePeriod && (
                      <span className="text-xl font-normal text-[#5C706D]">
                        /{property.pricePeriod}
                      </span>
                    )}
                  </h1>
                  <p className="text-[#19322F]/60 font-medium flex items-center gap-1 text-sm">
                    <span className="material-icons text-[#006655] text-sm">
                      location_on
                    </span>
                    {property.location}
                  </p>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                {/* Agent Card */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 relative">
                    <img
                      alt={agentName}
                      className="w-full h-full object-cover"
                      src={agentImage}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#19322F]">{agentName}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#006655] font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>{t.propertyDetail.topRatedAgent}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVisitModalOpen(true)}
                      aria-label={t.propertyDetail.chatWithAgent}
                      className="p-2 rounded-full bg-[#006655]/10 text-[#006655] hover:bg-[#006655] hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <a
                      href="tel:+18005550199"
                      aria-label={t.propertyDetail.callAgent}
                      className="p-2 rounded-full bg-[#006655]/10 text-[#006655] hover:bg-[#006655] hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="material-icons text-sm">call</span>
                    </a>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsVisitModalOpen(true)}
                    className="w-full bg-[#006655] hover:bg-[#005544] text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-[#006655]/20 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">
                      calendar_today
                    </span>
                    {t.propertyDetail.scheduleVisit}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVisitModalOpen(true)}
                    className="w-full bg-transparent border border-[#19322F]/10 hover:border-[#006655] text-[#19322F]/80 hover:text-[#006655] py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-icons text-xl">mail_outline</span>
                    {t.propertyDetail.contactAgent}
                  </button>
                </div>
              </div>

              {/* Interactive Leaflet Map Card */}
              <PropertyMap
                lat={property.lat}
                lng={property.lng}
                title={property.title}
                location={property.location}
              />
            </div>
          </div>

          {/* Lower Column: Features, Description, Amenities, Mortgage */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            {/* Property Features */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#006655]/5">
              <h2 className="text-lg font-semibold mb-6 text-[#19322F]">
                {t.propertyDetail.featuresTitle}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-[#006655]/5 rounded-lg border border-[#006655]/10 text-center">
                  <span className="material-icons text-[#006655] text-2xl mb-2">
                    square_foot
                  </span>
                  <span className="text-xl font-bold text-[#19322F]">
                    {property.areaSqM}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#19322F]/50">
                    {t.propertyDetail.squareMeters}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#006655]/5 rounded-lg border border-[#006655]/10 text-center">
                  <span className="material-icons text-[#006655] text-2xl mb-2">
                    bed
                  </span>
                  <span className="text-xl font-bold text-[#19322F]">
                    {property.beds}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#19322F]/50">
                    {t.propertyDetail.bedrooms}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#006655]/5 rounded-lg border border-[#006655]/10 text-center">
                  <span className="material-icons text-[#006655] text-2xl mb-2">
                    shower
                  </span>
                  <span className="text-xl font-bold text-[#19322F]">
                    {property.baths}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#19322F]/50">
                    {t.propertyDetail.bathrooms}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#006655]/5 rounded-lg border border-[#006655]/10 text-center">
                  <span className="material-icons text-[#006655] text-2xl mb-2">
                    directions_car
                  </span>
                  <span className="text-xl font-bold text-[#19322F]">
                    {property.parkingSpots ?? 2}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#19322F]/50">
                    {t.propertyDetail.garage}
                  </span>
                </div>
              </div>
            </div>

            {/* About this home */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#006655]/5">
              <h2 className="text-lg font-semibold mb-4 text-[#19322F]">
                {t.propertyDetail.aboutHome}
              </h2>
              <div
                className={`prose prose-slate max-w-none text-[#19322F]/70 leading-relaxed transition-all ${
                  !isExpanded ? 'line-clamp-3' : ''
                }`}
              >
                {descriptionText.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4">
                    {para}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-[#006655] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
              >
                {isExpanded
                  ? t.propertyDetail.showLess
                  : t.propertyDetail.readMore}
                <span className="material-icons text-sm">
                  {isExpanded ? 'expand_less' : 'arrow_forward'}
                </span>
              </button>
            </div>

            {/* Amenities */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#006655]/5">
              <h2 className="text-lg font-semibold mb-6 text-[#19322F]">
                {t.propertyDetail.amenitiesTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {amenitiesList.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-[#19322F]/70"
                  >
                    <span className="material-icons text-[#006655]/80 text-sm">
                      check_circle
                    </span>
                    <span>
                      {t.propertyDetail.amenityNames[amenity] || amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Payment / Mortgage Card */}
            <div className="bg-[#006655]/5 p-6 rounded-xl border border-[#006655]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-[#006655] shadow-sm flex items-center justify-center">
                  <span className="material-icons text-xl">calculate</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#19322F]">
                    {t.propertyDetail.estimatedPayment}
                  </h3>
                  <p className="text-sm text-[#19322F]/60">
                    {t.propertyDetail.startingFrom}{' '}
                    <strong className="text-[#006655]">
                      ${estimatedMonthlyPayment.toLocaleString()}/
                      {t.common.perMonth}
                    </strong>{' '}
                    {t.propertyDetail.withDownPayment.replace(
                      '{percent}',
                      String(downPaymentPercent)
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMortgageModalOpen(true)}
                className="whitespace-nowrap px-4 py-2 bg-white border border-[#19322F]/10 rounded-lg text-sm font-semibold hover:border-[#006655] transition-colors text-[#19322F] cursor-pointer shadow-xs"
              >
                {t.propertyDetail.calculateMortgage}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-[#19322F]/50">
            {t.footer.rightsReserved}
          </div>
          <div className="flex gap-6">
            <a
              className="text-[#19322F]/40 hover:text-[#006655] transition-colors"
              href="#"
              aria-label="Facebook"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              className="text-[#19322F]/40 hover:text-[#006655] transition-colors"
              href="#"
              aria-label="Twitter"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Schedule Visit Modal */}
      {isVisitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsVisitModalOpen(false);
                setVisitSubmitted(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <span className="material-icons">close</span>
            </button>

            {visitSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-[#006655]/10 text-[#006655] rounded-full flex items-center justify-center mx-auto">
                  <span className="material-icons text-2xl">check</span>
                </div>
                <h3 className="text-xl font-semibold text-[#19322F]">
                  {t.propertyDetail.visitRequestReceived}
                </h3>
                <p className="text-sm text-[#19322F]/60">
                  {t.propertyDetail.visitRequestConfirmation
                    .replace('{agent}', agentName)
                    .replace('{property}', property.title)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsVisitModalOpen(false);
                    setVisitSubmitted(false);
                  }}
                  className="mt-4 w-full bg-[#006655] text-white py-2.5 rounded-lg font-medium"
                >
                  {t.propertyDetail.done}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-[#19322F] mb-1">
                  {t.propertyDetail.schedulePrivateTour}
                </h3>
                <p className="text-xs text-[#19322F]/60 mb-4">
                  {t.propertyDetail.tourPropertyWithAgent
                    .replace('{property}', property.title)
                    .replace('{agent}', agentName)}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setVisitSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#19322F] mb-1">
                      {t.propertyDetail.fullName}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#006655]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#19322F] mb-1">
                      {t.propertyDetail.email}
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#006655]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#19322F] mb-1">
                      {t.propertyDetail.phoneNumber}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#006655]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#19322F] mb-1">
                      {t.propertyDetail.preferredDate}
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#006655]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#006655] hover:bg-[#005544] text-white py-3 rounded-lg font-medium transition-all shadow-md mt-2"
                  >
                    {t.propertyDetail.confirmTourRequest}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mortgage Calculator Modal */}
      {isMortgageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsMortgageModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <span className="material-icons">close</span>
            </button>

            <h3 className="text-xl font-semibold text-[#19322F] mb-1">
              {t.propertyDetail.mortgageCalculator}
            </h3>
            <p className="text-xs text-[#19322F]/60 mb-6">
              {t.propertyDetail.estimateMonthlyCosts.replace(
                '{property}',
                property.title
              )}
            </p>

            <div className="space-y-4">
              <div className="bg-[#006655]/5 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-[#19322F]/60">
                    {t.propertyDetail.propertyPrice}
                  </span>
                  <div className="text-xl font-bold text-[#19322F]">
                    {formatPrice(property.price)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#19322F]/60">
                    {t.propertyDetail.monthlyEstimate}
                  </span>
                  <div className="text-xl font-bold text-[#006655]">
                    ${estimatedMonthlyPayment.toLocaleString()}/
                    {t.common.perMonth}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-sm text-[#19322F]">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[#19322F]/70">
                    {t.propertyDetail.principalAndInterest}
                  </span>
                  <span className="font-semibold">${Math.round(estimatedMonthlyPayment * 0.78).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[#19322F]/70">
                    {t.propertyDetail.propertyTaxes}
                  </span>
                  <span className="font-semibold">${Math.round(estimatedMonthlyPayment * 0.14).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[#19322F]/70">
                    {t.propertyDetail.homeownersInsurance}
                  </span>
                  <span className="font-semibold">${Math.round(estimatedMonthlyPayment * 0.08).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsMortgageModalOpen(false);
                    setIsVisitModalOpen(true);
                  }}
                  className="w-full bg-[#006655] hover:bg-[#005544] text-white py-3 rounded-lg font-medium transition-all shadow-md"
                >
                  {t.propertyDetail.getPreApproved}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
