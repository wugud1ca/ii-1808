export interface PhoneConfig {
  mainDisplay: string;
  mainHref: string;
  turkeyDisplay?: string;
  turkeyHref?: string;
}

export interface ClientCabinetConfig {
  loginUrl: string;
  registrationUrl: string;
}

export interface LegalConfig {
  company: string;
  innKpp: string;
  ogrn: string;
  chinaCompany: string;
}

export interface DocumentsConfig {
  privacyUrl: string;
  offerUrl: string;
  referralOfferUrl: string;
}

export interface SocialConfig {
  telegram: string;
  whatsapp: string;
  max: string;
  vk: string;
  rutube: string;
}

export interface ApiEndpointsConfig {
  leadEndpoint: string;
  calculatorEndpoint: string;
  trackingEndpoint: string;
}

export interface AnalyticsConfig {
  yandexMetrikaId: string;
  ga4Id: string;
}

export interface OfficeLocation {
  city: string;
  address: string;
  isMain?: boolean;
}

export interface SiteConfig {
  brandName: string;
  logoAlt: string;
  phone: PhoneConfig;
  email: string;
  emailHref: string;
  officeAddress: string;
  russianOffices?: OfficeLocation[];
  chinaWarehouse: string;
  clientCabinet: ClientCabinetConfig;
  legal: LegalConfig;
  documents: DocumentsConfig;
  social: SocialConfig;
  api: ApiEndpointsConfig;
  analytics: AnalyticsConfig;
}

export type Direction = 'china' | 'world';

export interface CustomerScenario {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requestType: string;
  targetSlug?: string;
  badge?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  ctaText?: string;
  category?: 'core' | 'delivery' | 'marketplace' | 'special';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'cabinet' | 'finance' | 'delivery' | 'inspection' | 'legal';
}

export interface DeliveryMethod {
  id: string;
  title: string;
  speed: string;
  suitableFor: string;
  description: string;
  iconName: string;
  badge?: string;
}

export type ProductTypeCategory = 'small_household' | 'large_household' | 'clothing' | 'electronics' | 'equipment' | 'auto_parts' | 'other';

export interface ProductCategory {
  slug: string;
  name: string;
  h1: string;
  intro: string;
  complianceNote: string;
  recommendedDelivery: string;
  restrictions?: string[];
}

export interface LeadFormData {
  name: string;
  phone: string;
  requestType: string;
  productLinkOrName?: string;
  weightKg?: string;
  volumeM3?: string;
  costEstimate?: string;
  destinationCity?: string;
  needsDocuments?: boolean;
  comment?: string;
  agreedToPolicy: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface TrackingResult {
  number: string;
  found: boolean;
  isDemo: boolean;
  status?: string;
  origin?: string;
  destination?: string;
  weight?: string;
  volume?: string;
  currentLocation?: string;
  updatedAt?: string;
  timeline?: {
    stage: string;
    date: string;
    done: boolean;
    location: string;
  }[];
}

export interface CabinetOrderMock {
  id: string;
  title: string;
  supplier: string;
  status: 'buyout' | 'warehouse_inspection' | 'consolidation' | 'in_transit' | 'customs' | 'ready_for_pickup';
  statusLabel: string;
  itemsCount: number;
  weightKg: number;
  volumeM3: number;
  photoCount: number;
  totalCostRmb: number;
  estimatedDelivery: string;
  trackingNumber: string;
  photos: string[];
}
