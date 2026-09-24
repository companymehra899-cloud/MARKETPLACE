function formatKm(value) {
  const num = Number(value);
  if (!num || !Number.isFinite(num)) return '—';
  return `${num.toLocaleString('en-IN')} km`;
}

function formatDays(value) {
  const num = Number(value);
  if (!num || !Number.isFinite(num)) return '—';
  return `${num} Days`;
}

const STAT_FORMATTERS = {
  km: formatKm,
  year: (value) => (value ? String(value) : '—'),
  durationDays: formatDays,
};

export const MARKET_TYPES = {
  vehicle: {
    type: 'vehicle',
    label: 'Vehicles',
    singular: 'Vehicle',
    route: '/vehicles',
    badge: 'VEHICLE',
    accent: 'vehicle',
    title: 'Vehicles for Sale in India',
    subtitle:
      'Buy and sell used cars, bikes and scooters in India. Compare brand, year, kilometres driven, fuel type and price in INR.',
    categories: ['Cars', 'Bikes', 'Scooters'],
    filters: [
      { kind: 'category' },
      {
        kind: 'select',
        key: 'brand',
        label: 'Brand',
        options: [
          'Maruti Suzuki',
          'Hyundai',
          'Tata',
          'Honda',
          'Toyota',
          'Kia',
          'Mahindra',
          'Renault',
          'Royal Enfield',
          'Bajaj',
          'TVS',
          'Hero',
          'Ola',
          'Ather',
        ],
      },
      { kind: 'select', key: 'fuel', label: 'Fuel Type', options: ['Petrol', 'Diesel', 'CNG', 'Electric'] },
      { kind: 'select', key: 'transmission', label: 'Transmission', options: ['Manual', 'Automatic'] },
      {
        kind: 'minmax',
        key: 'year',
        label: 'Registration Year',
        minKey: 'minYear',
        maxKey: 'maxYear',
        placeholderMin: 'Min Year',
        placeholderMax: 'Max Year',
      },
      { kind: 'max', key: 'km', label: 'KM Driven', maxKey: 'maxKm', placeholder: 'Max KM' },
      { kind: 'price' },
    ],
    stats: [
      { key: 'brand', label: 'Brand' },
      { key: 'year', label: 'Year' },
      { key: 'km', label: 'KM Driven', format: 'km' },
      { key: 'fuel', label: 'Fuel' },
    ],
    fields: [
      { key: 'brand', label: 'Brand', placeholder: 'Maruti Suzuki', required: true },
      { key: 'year', label: 'Year', placeholder: '2019', type: 'number' },
      { key: 'km', label: 'KM Driven', placeholder: '38000', type: 'number' },
      { key: 'fuel', label: 'Fuel type', options: ['Petrol', 'Diesel', 'CNG', 'Electric'] },
      { key: 'transmission', label: 'Transmission', options: ['Manual', 'Automatic'] },
      { key: 'owners', label: 'Ownership', placeholder: 'First Owner' },
      { key: 'location', label: 'Location', placeholder: 'Pune, Maharashtra', required: true },
    ],
  },
  mobile: {
    type: 'mobile',
    label: 'Mobiles',
    singular: 'Mobile',
    route: '/mobiles',
    badge: 'MOBILE',
    accent: 'mobile',
    title: 'Second Hand Mobiles for Sale in India',
    subtitle:
      'Buy and sell used mobiles and smartphones in India. Filter by brand, storage, condition, warranty and price in INR.',
    categories: ['Mobile Phones'],
    filters: [
      { kind: 'category' },
      {
        kind: 'select',
        key: 'brand',
        label: 'Brand',
        options: ['Apple', 'Samsung', 'Xiaomi', 'Realme', 'OnePlus', 'Oppo', 'Vivo', 'Google', 'Nothing'],
      },
      { kind: 'select', key: 'storage', label: 'Storage', options: ['32 GB', '64 GB', '128 GB', '256 GB', '512 GB'] },
      { kind: 'select', key: 'condition', label: 'Condition', options: ['Like New', 'Good', 'Fair'] },
      { kind: 'price' },
    ],
    stats: [
      { key: 'brand', label: 'Brand' },
      { key: 'storage', label: 'Storage' },
      { key: 'ram', label: 'RAM' },
      { key: 'condition', label: 'Condition' },
    ],
    fields: [
      { key: 'brand', label: 'Brand', placeholder: 'Samsung', required: true },
      { key: 'storage', label: 'Storage', options: ['32 GB', '64 GB', '128 GB', '256 GB', '512 GB'] },
      { key: 'ram', label: 'RAM', placeholder: '8 GB' },
      {
        key: 'condition',
        label: 'Condition',
        options: ['Like New', 'Good', 'Fair'],
      },
      { key: 'warranty', label: 'Warranty', placeholder: '2 Months Left' },
      { key: 'location', label: 'Location', placeholder: 'Delhi', required: true },
    ],
  },
  service: {
    type: 'service',
    label: 'Services',
    singular: 'Service',
    route: '/services',
    badge: 'SERVICE',
    accent: 'service',
    title: 'Local Services in India',
    subtitle:
      'Find and offer local services in India. Browse home services, repairs, education, IT and more with location and price in INR.',
    categories: [
      'Home Services',
      'Repair & Maintenance',
      'Education',
      'IT & Web',
      'Events',
      'Beauty & Wellness',
      'Other',
    ],
    filters: [
      { kind: 'category' },
      { kind: 'select', key: 'serviceMode', label: 'Service Mode', options: ['At Home', 'Online', 'At Center'] },
      { kind: 'text', key: 'location', label: 'City / Location', placeholder: 'Enter city...' },
      { kind: 'price', label: 'Starting Price' },
    ],
    stats: [
      { key: 'category', label: 'Service Type' },
      { key: 'location', label: 'Location' },
      { key: 'serviceMode', label: 'Mode' },
      { key: 'experience', label: 'Experience' },
    ],
    fields: [
      { key: 'location', label: 'City / Location', placeholder: 'Pune, Maharashtra', required: true },
      { key: 'serviceMode', label: 'Service mode', options: ['At Home', 'Online', 'At Center'] },
      { key: 'experience', label: 'Experience', placeholder: '5 Years' },
    ],
  },
  tour: {
    type: 'tour',
    label: 'Tour & Travels',
    singular: 'Tour',
    route: '/tours',
    badge: 'TOUR',
    accent: 'tour',
    title: 'Tour and Travel Packages in India',
    subtitle:
      'Explore domestic and international tour packages, adventure trips and travel services with destination, duration and price in INR.',
    categories: [
      'Domestic Tour',
      'International Tour',
      'Adventure',
      'Pilgrimage',
      'Hotel & Resort',
      'Vehicle Rental',
    ],
    filters: [
      { kind: 'category' },
      {
        kind: 'select',
        key: 'destination',
        label: 'Destination',
        options: [
          'Goa',
          'Kerala',
          'Bali, Indonesia',
          'Manali & Kasol',
          'Rajasthan',
          'Andaman',
          'Dubai',
          'Thailand',
          'Europe',
        ],
      },
      { kind: 'max', key: 'durationDays', label: 'Max Duration', maxKey: 'maxDays', placeholder: 'Max days' },
      { kind: 'price' },
    ],
    stats: [
      { key: 'destination', label: 'Destination' },
      { key: 'durationDays', label: 'Duration', format: 'durationDays' },
      { key: 'groupSize', label: 'Group Size' },
      { key: 'category', label: 'Tour Type' },
    ],
    fields: [
      { key: 'destination', label: 'Destination', placeholder: 'Goa', required: true },
      { key: 'durationDays', label: 'Duration (days)', placeholder: '4', type: 'number' },
      { key: 'groupSize', label: 'Group size', placeholder: '2-10 People' },
    ],
  },
};

export const MARKET_TYPE_LIST = Object.values(MARKET_TYPES);

export function isMarketType(type) {
  return Boolean(MARKET_TYPES[type]);
}

export function marketCardStats(listing) {
  const cfg = MARKET_TYPES[listing.type];
  if (!cfg) return [];
  return (cfg.stats || []).map((stat) => {
    const formatter = stat.format && STAT_FORMATTERS[stat.format];
    const raw = listing[stat.key];
    return {
      label: stat.label,
      value: formatter ? formatter(raw) : raw ? String(raw) : '—',
    };
  });
}
