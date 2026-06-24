export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  memberSince: string;
  responseRate: string;
  verifiedSales: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  priceRaw: number;
  category: string;
  image: string;
  images: string[];
  location: string;
  postedAt: string;
  tags: string[];
  escrowProtected: boolean;
  seller: Seller;
  description: string;
  specs: { label: string; value: string }[];
  badge?: string;
  badgeColor?: string;
}

export interface Order {
  id: string;
  orderId: string;
  secureTxId: string;
  product: Product;
  status: 'payment_received' | 'funds_held' | 'seller_ships' | 'buyer_receives' | 'funds_released';
  orderedAt: string;
  deliveryLocation: string;
  progressPercent: number;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  colSpan: string;
  bgColor?: string;
  icon?: string;
}

const baseImages = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDirzDVqzKEaXQGNCPVax5QGy4AFoBUwWeDtgBps9Vjgi6bi_pPJCsOQ-YXfCZNyhbUhDL1XGWrY8J-sU8Kp6lVhomjsWjF1mT-pT7Mmmy4704NDUhJ2WkG6t3XSWTlxY3W9yIvFBYGFcqfHpoC2kx4hQdz45OrKcb4cfugxV0qUy2D_fvMxmv9hW0nVQH6dGbAZEiOzd15hZ5Jv5TKxIpSa4tm3-OKsQXY2CmeICNxuzZxxYvkcFikyDvvC4rf88tkczCra2jIYuA_',
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMdyV7O60I_AL3t1HDhq1ew7Cbq9DrV9wqYTHOFtBeoOAUKIWvrUOLOzJU0HZpMHzvq9hisuEF3Qpf7LkuFj15gXomZMEi9bANAnbClDQ1vqtoN5F6FrcGHnLxR0B_hudjAGpE_ObTviXYsulgdTlts-IrM4fxuSdhB1v8v6FF9DLfRkqLCsLhhWPeiCdtX6w0AglqLb8fsMgm396YPmLl2Agu0DwwCIDv_gxpVAiH7DT2GWPLXzVK5SHQbETbRqCB3CCxy4du7F4v',
  boar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbLOsNPkgdetfPXp6QkiE8jvTHo-OPW3xjdwKKgEVP-_aAgX7n4CXEHQd65SzBr-Fd_V4v6OX1m7OYqeLshBd2KXEkcb2FXKlRhRPT6UqzqAjhJ2Yg2DzPJdDuFHI_pGV3XmMs01_L_NhpU8zicIaA0s73jUuQumzooOjTBUzsTt1xjHzbWjtqnfLTbitbfzh-Q1NtNnHykmFuDukVviR3VDUClyA-QC4tL9sHFRTgqGycFZPOBxiqhoI_jD_G5IKo9IiBUQzROCRE',
  porkBelly: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv6-wrnYFX08cpQuYIw7WKn1k7B-ca44n6hoSaOiZsb5rnqM8JDJDqVtZA1V5NmkC0RJUoOEMdriJoyG16sz-YlR9SdPjFZCelh42RtZKIuKsNk03DYReYQHO_N5RrsbC3Czf9O_KrQ0XAMfS9xyjNpFKKPHIzK3rH4NDNteBYGCXfJwjRX1TRdfuijITS8JszodfAYoHloziWtOeeBnZb1m41E0U0TYTrtijd33DodhL-_zNLmBupUvSAJ8XS4lTdtOIOgf9FAcX2',
  durocPiglets: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE9LKdfSxIdD_hNvDF9VaWeY2V78nETarJPqskrqtn1VnuAkrQdNejgc78aYrZyHvRzX4bYhSRq_CweFmn4ydXpride1veE0raUNl__RE6ULbYwQlBoC2JCq2VulUQJMFnGfG3NLRN90ahn-6BLLOZYl_Snqr4dOGv_GRp9FJwLLS_kkaAJP_Plh-n2X-QQ9ePP9Tlm-0h0n7LUVk8DbWYkro-wX9fPCwmI_Kqblc9dB-2biYLv-Dr_b_Xngdl0mDXm6jmV3yfjde7',
  landrace: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0XtElA0MPYrUsMBQtQ8glMg9qnEqQ1fGpo9ttzb-oFgax4fs3RJtFILYavzJMEPFgXanjhTXJXkeZxG_lb9z7JC1LH0KxhtIECGu2ZrdsvEMtVWSeI03awGEs9D5fyvIzqbJ70dBtg-kw3sNoI8l6-xNYlzkgCpRQBLYQOWdCx27dg1GFLLWiE5koqWV1NxlvO3ZNK7CkaAGjWge-z1skdIadSFKQCU3yZtUopRGtqONi4CGcbl1UVYM91XlQBfqWnb5m7IbT1y6-',
  landraceProfile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvv9W83Vc25-BsDAdWRqN_pkzN1sqw9hzUvQhNJT-VcEh8TM00AJHzGjUSecZPF4tKdz7-1KYxN8RYw992ER4uAUi_Q33OO9_ptE4YLsv1djkgd-h2I3hweVP7i7FxldXqTAZ-sKQdyHjCko0AmDHL7JtdEDgqXpPbPSdZb6y-WVjXmADLvRyFAPpKQvCedVFkIgKrT4kNVliEUZ0gNw5Xa_CzLPpdyAzH9pFmtIANhnubBYydwyL0s20V39UbD72HAsLW7nrap5G',
  landraceFarm: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoaRMBUHDa6sdEmPvm4pxjHyq_bgL8JP8Fw7U0bQZLUTYaXq_mDTCpT89hMq00B_OzLv5y05dAyqgam0WMMlGc9pa4CJyRwKfNZ9jfSln6NZcf0ce02iiiopIHd8MAttOyVFiVbOy7IRwtsS1Gt7eMNKS6Njb0Erk_8KEr8My78iFHo3D9-rti1D7iwWAsypMLtp0UVv7OpPQNR7jReqVsCT_HVDE8Y9NNvei2DNYOw5K2e5IPUDUnvW2Q2W5du6avMKiGFJGiaHwp',
  durocBreed: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVCDscL5T-TGkAYO5z2tG1PNf5_9oE4wccPiviQ9aU-sLccZWKacTS__mj1Ze_qazPY6uB30EOdXlDPGs0ry69wH9wUmzFiOURsGrVPzEApMPB5h6eenStI2FC6VdG83qh1f-emUeD5Px3oLbjpx785hzDxZHV9TKhrE65UZ-b5_4HubnxFiEfI50OLEcvEZt-PupkmqIguD-mYtsWw2kDsTi4BHlvf0lNYu55z-eMlvKus10tL-aLLQMx46zG45dXlpsmACk2UBiP',
  largeWhiteSow: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7UcqIjZ_U58EzZzmu0ihSHrWi7gMrw9ptUpN14XEbBp6qQLT8rL-xe9MB7N041v2HCYOfW4j2tFfhxUrkNwR7tliGOwQIs8D_Frm25m3Ou4dngwQUQ6jfbZZjm12M-Y_IXDgaYD971h6ELrf6FW7pvkv0sg0lkMyMnbV_LCNNULWgU2TtNZb9t07bFGMJsUm1ttAjhvqOYd0Vi4q8Ijdnwt9W_wF7neVwBGCfyj9rK7OJBhOKww8Q9_33sJeBByeog2Jw6-7EtV3H',
  camborough: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc6L4onvhZXCPYKol75YQrTWVRvLzJifPtZ1wzBxyuHIOITA3n369kgOPh2-RbJsbRMIXaBPzCzLZlyZmXW75FHcrmKVvgtjv-_lxFXj5R9iqlYKUjDfAuras1eD3Fpd7bYLftuRqnx43YdQ2w_x2I8uDEO4YUOYFUur4UIt-26pkyceoBhUl1bjI8oVCp2SJsH8AUTt2qvgdJAh5wi4Y-O8N5w2cle5FHzbIGsaGrSa2iwIQZmlfAq8lsGZfEJ2LsY-AuANkSZhwU',
  categoryLivePigs: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ437yw08JePO45AwGN2EsGTr5qXXrXwRtKc3IANTOU4vYcGmeYUt1F8trSdGi_xrKl8h2NEWLNolvvLDDv9x6WEYobpl9AAJ91JQGfxKFHv59K8HxRKlIiHMzFFjKRrCV3b7CifhDQwR_WmU4iP-LRX-pUAH5gWsfvOAHjKI-nWIgOpaItMFCvGtmEhBYFjiB3mCfuJbQ6qmTFO67r1gzFTYnLqtTXAorD8aJ-skbSvff5MFIn22Jt74CfuOEp_0VschWxPHCa2XC',
  categoryPrimeCuts: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0WwNdHem0lVlLPPjpL0gcIfAZvaCAASG2XNSVC895e2c1j5EbrKt4KwVOgF7tKqgY5bvA28_jDTMLOFgpXk8i9L24nCnnlxFHlI5TvC49v6578VPUklNbo3dFHth1CLGyERnvVbUD4ZTFFx5QFgp4dM3qTPLTxEFRxRE0SqdU2-7Qxx6hOgHOv1sl_W5GqP_Nopkh-mVZbypJcrXBQxHZ5b8vAgr1_VDrj-hOpnx6leB4TewSslJfPHDVNP6M9GyBv8HgWysYg2b4',
  farmerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOq0CWLll9koU5IhjUHNNrWBs5Zl9wju3BcI8VPERfztGYPYTRXwV01TG7uUkxTCv_sJYy3JyOBtRSS8arkyVRYlZrFqNTZ7FI01Sd0So3HMESNW4ouCwMKK2LhROhZmvi3zmFq4hmDR8_4ok76fG10EigwAM-i9A_0pdXC3C784h7NzWSYQ_IeGlLwylf_OYXZclqouRO7m2AO71WeY2l3juuoiAO9cFklR-VVi_ueBXrTHMHqsKC2jv1CmAZN40SwyurDOUVj5LH',
  escrowOrder: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe-HLs9htAWYUP0PvKpiPhW-AcRL8iG6UbaBMLkjX21b3rWdNfLT1Vx91Z-cHoWwU4SWRow4UIY0bYP_kyuIpZd28RgwzsaBI2leRietYPeT_qxuS6qULVkDQFN8fId7YsHDLhWKsA8yDXQFmNAHZIm3RWkghF1amkuNpgJuMF0TKSXP61OlYf-VRQ0WjAkqMfNF9CRWSc6RpU-y5h1r8u-m9Ql8RN0ShpUR9HThNHz7N6b49UzSukG5fyKbD4Hz1SXnIjKZRFUSTl',
};

const mukasaFarms: Seller = {
  id: 'seller-1',
  name: 'Mukasa Farms',
  avatar: baseImages.farmerAvatar,
  rating: 4.5,
  reviewCount: 124,
  memberSince: 'Jan 2022',
  responseRate: '98% (Usually within 1hr)',
  verifiedSales: '450+ Pigs',
  verified: true,
};

export const categories: Category[] = [
  {
    id: 'live-pigs',
    name: 'Live Pigs',
    subtitle: 'Breeder & Commercial',
    image: baseImages.categoryLivePigs,
    colSpan: 'col-span-2 md:col-span-1',
  },
  {
    id: 'prime-cuts',
    name: 'Prime Cuts',
    subtitle: 'Wholesale & Retail Orders',
    image: baseImages.categoryPrimeCuts,
    colSpan: 'col-span-2',
  },
  {
    id: 'feed',
    name: 'Feed',
    subtitle: 'Optimized Nutrition',
    image: '',
    colSpan: 'col-span-2 md:col-span-1',
    bgColor: 'bg-surface-container-high',
    icon: 'nutrition',
  },
  {
    id: 'veterinary',
    name: 'Veterinary',
    subtitle: 'Expert Consultation',
    image: '',
    colSpan: 'col-span-2 md:col-span-1',
    bgColor: 'bg-primary',
    icon: 'medical_services',
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    title: 'Large White Boar - 80kg',
    price: 'UGX 1.2M',
    priceRaw: 1200000,
    category: 'Live Pigs',
    image: baseImages.boar,
    images: [baseImages.boar, baseImages.boar, baseImages.boar],
    location: 'Masaka Farm',
    postedAt: '2 days ago',
    tags: ['Escrow Protected'],
    escrowProtected: true,
    seller: mukasaFarms,
    description: 'A massive, healthy Large White Boar standing in a clean, professional agricultural setting.',
    specs: [
      { label: 'Breed', value: 'Pure Large White' },
      { label: 'Weight', value: '80 kg' },
      { label: 'Age', value: '18 Months' },
      { label: 'Vaccinations', value: 'FMD, Swine Fever' },
    ],
  },
  {
    id: 'prod-2',
    title: 'Premium Pork Belly - 5kg',
    price: 'UGX 85,000',
    priceRaw: 85000,
    category: 'Prime Cuts',
    image: baseImages.porkBelly,
    images: [baseImages.porkBelly, baseImages.porkBelly, baseImages.porkBelly],
    location: 'Mukono Quality Meats',
    postedAt: '1 day ago',
    tags: ['Escrow Protected', 'Organic Fed'],
    escrowProtected: true,
    seller: { ...mukasaFarms, name: 'Mukono Quality Meats' },
    description: 'Premium, thick-cut pork belly with exquisite fat marbling. Perfect for high-end culinary applications.',
    specs: [
      { label: 'Cut', value: 'Pork Belly' },
      { label: 'Weight', value: '5 kg' },
      { label: 'Feed', value: 'Organic Fed' },
      { label: 'Packaging', value: 'Vacuum Sealed' },
    ],
  },
  {
    id: 'prod-3',
    title: 'Duroc Piglets - Set of 5',
    price: 'UGX 600k',
    priceRaw: 600000,
    category: 'Live Pigs',
    image: baseImages.durocPiglets,
    images: [baseImages.durocPiglets, baseImages.durocPiglets, baseImages.durocPiglets],
    location: 'Mpigi District',
    postedAt: '5 days ago',
    tags: ['Escrow Protected', 'Vaccinated'],
    escrowProtected: true,
    seller: mukasaFarms,
    description: 'A group of healthy, reddish-brown Duroc piglets from a modern, well-ventilated nursery.',
    specs: [
      { label: 'Breed', value: 'Duroc' },
      { label: 'Quantity', value: '5 Piglets' },
      { label: 'Age', value: '8 Weeks' },
      { label: 'Vaccinations', value: 'Fully Vaccinated' },
    ],
  },
  {
    id: 'prod-4',
    title: 'Purebred Duroc Gilt',
    price: 'UGX 1.2M',
    priceRaw: 1200000,
    category: 'Live Pigs',
    image: baseImages.durocBreed,
    images: [baseImages.durocBreed, baseImages.durocBreed, baseImages.durocBreed],
    location: 'Masaka Regional Farm',
    postedAt: '1 week ago',
    tags: ['Premium Breed', 'Vaccinated'],
    escrowProtected: false,
    badge: 'Premium Breed',
    badgeColor: 'bg-primary',
    seller: mukasaFarms,
    description: 'Pedigree Duroc boar with deep mahogany coat, appearing strong and well-bred.',
    specs: [
      { label: 'Breed', value: 'Pure Duroc' },
      { label: 'Age', value: '6 Months' },
      { label: 'Weight', value: '65 kg' },
      { label: 'Status', value: 'Vaccinated' },
    ],
  },
  {
    id: 'prod-5',
    title: 'Large White Sow',
    price: 'UGX 950k',
    priceRaw: 950000,
    category: 'Live Pigs',
    image: baseImages.largeWhiteSow,
    images: [baseImages.largeWhiteSow, baseImages.largeWhiteSow, baseImages.largeWhiteSow],
    location: 'Mbarara Estates',
    postedAt: '3 days ago',
    tags: ['Proven Breeder', 'Vet Inspected'],
    escrowProtected: false,
    badge: 'Certified Healthy',
    badgeColor: 'bg-secondary',
    seller: { ...mukasaFarms, name: 'Mbarara Estates' },
    description: 'Large White sow with several healthy piglets. Excellent mothering ability and calm temperament.',
    specs: [
      { label: 'Breed', value: 'Large White' },
      { label: 'Age', value: '24 Months' },
      { label: 'Status', value: 'Proven Breeder' },
      { label: 'Health', value: 'Vet Inspected' },
    ],
  },
  {
    id: 'prod-6',
    title: 'Camborough Line 24',
    price: 'UGX 1.1M',
    priceRaw: 1100000,
    category: 'Live Pigs',
    image: baseImages.camborough,
    images: [baseImages.camborough, baseImages.camborough, baseImages.camborough],
    location: 'Luweero Tech Farm',
    postedAt: '4 days ago',
    tags: ['High FCR', 'Verified'],
    escrowProtected: false,
    badge: 'Commercial Choice',
    badgeColor: 'bg-tertiary-container',
    seller: { ...mukasaFarms, name: 'Luweero Tech Farm' },
    description: 'Camborough breed pig in a professional, modern outdoor paddock. Athletic and well-proportioned.',
    specs: [
      { label: 'Breed', value: 'Camborough Line 24' },
      { label: 'FCR', value: 'High' },
      { label: 'Status', value: 'Verified' },
      { label: 'Weight', value: '75 kg' },
    ],
  },
];

export const featuredProducts = products.slice(3, 6);

export const landraceSow: Product = {
  id: 'prod-7',
  title: 'Premium Landrace Sow',
  price: 'UGX 1,450,000',
  priceRaw: 1450000,
  category: 'Live Pigs',
  image: baseImages.landrace,
  images: [baseImages.landrace, baseImages.landraceProfile, baseImages.landraceFarm],
  location: 'Luweero, Central',
  postedAt: '2 days ago',
  tags: ['Escrow Protected'],
  escrowProtected: true,
  seller: mukasaFarms,
  description: 'Superior breeding stock with exceptional genetic lineage. This Landrace sow is currently in peak health, exhibiting high mothering ability and a calm temperament. Ideal for commercial farm expansion or genetic improvement programs.',
  specs: [
    { label: 'Breed', value: 'Pure Landrace' },
    { label: 'Weight', value: '95 kg' },
    { label: 'Age', value: '14 Months' },
    { label: 'Vaccinations', value: 'FMD, Swine Fever' },
    { label: 'Last Farrowing', value: 'N/A (Ready for service)' },
    { label: 'Location', value: 'Luweero, Central' },
  ],
};

export const sampleOrder: Order = {
  id: 'order-1',
  orderId: '12345',
  secureTxId: 'P1G-882-XJ9-ESC',
  product: landraceSow,
  status: 'funds_held',
  orderedAt: 'Oct 24, 2023',
  deliveryLocation: 'Mubende Farm District',
  progressPercent: 25,
};

export const categoriesList = [
  { id: 'all', label: 'All Categories' },
  { id: 'price', label: 'Price', icon: 'payments' },
  { id: 'location', label: 'Location', icon: 'location_on' },
  { id: 'breed', label: 'Breed', icon: 'pets' },
  { id: 'verified', label: 'Verified Only', icon: 'verified' },
];
