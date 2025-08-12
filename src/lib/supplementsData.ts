import { supabase } from './supabase';

// Supabase storage configuration
const STORAGE_BUCKET = 'supplements';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Helper function to get image URL from Supabase storage
const getSupplementImageUrl = (imagePath: string): string => {
  if (!imagePath || !SUPABASE_URL) {
    return 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'; // Fallback
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Construct Supabase storage URL
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${imagePath}`;
};

// Helper function to get supplement image from storage with fallback
export const getSupplementImage = async (supplementName: string, imageUrl?: string): Promise<string> => {
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  try {
    // Try to get image from Supabase storage
    const imageName = supplementName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      + '.jpg';
    
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(imageName);
    
    if (data?.publicUrl) {
      // Test if image exists by trying to fetch it
      try {
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          return data.publicUrl;
        }
      } catch {
        // Image doesn't exist, use fallback
      }
    }
  } catch (error) {
    console.warn('Error getting supplement image from storage:', error);
  }
  
  // Fallback to Pexels image
  return 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg';
};

export interface SupplementData {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  detailed_description?: string;
  key_benefits?: string;
  ingredients?: string;
  serving_size?: string;
  servings_per_container?: number;
  directions_for_use?: string;
  warnings?: string;
  price: string;
  compare_at_price?: string;
  currency?: string;
  stock_quantity?: number;
  is_available?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  image_url?: string;
  nutrition_facts?: any;
  certifications?: string;
  target_audience?: string;
  health_conditions?: string;
  allergen_info?: string;
  manufacturer?: string;
  country_of_origin?: string;
  expiry_date?: string;
  barcode?: string;
  sku?: string;
  weight_grams?: string;
  tags?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface SupplementStack {
  id: string;
  category: string;
  name: string;
  total_price: number;
  components: any;
}

// Cache for supplements data
let supplementsCache: SupplementData[] | null = null;
let stacksCache: SupplementStack[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch supplements from Supabase
export const fetchSupplementsFromDatabase = async (): Promise<SupplementData[]> => {
  try {
    console.log('Fetching supplements from Supabase database...');
    
    // Try the demo table first (as specified)
    let { data: supplements, error } = await supabase
      .from('Supplement Stacks Demo')
      .select('*')
      .eq('is_available', true)
      .order('name');

    if (error || !supplements || supplements.length === 0) {
      console.log('Demo table failed, trying main supplement table...');
      
      // Fallback to main supplement table
      const { data: mainSupplements, error: mainError } = await supabase
        .from('supplement')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (mainError) {
        console.error('Main supplement table error:', mainError);
        throw mainError;
      }
      
      supplements = mainSupplements;
    }

    if (!supplements || supplements.length === 0) {
      console.warn('No supplements found in database, using fallback data');
      return getFallbackSupplements();
    }

    console.log(`Found ${supplements.length} supplements in database`);
    
    // Process and clean the data
    const processedSupplements = supplements.map((supplement: any) => ({
      id: supplement.id || `supplement_${Date.now()}_${Math.random()}`,
      name: supplement.name || 'Unknown Supplement',
      brand: supplement.brand || 'Biowell',
      category: supplement.category || 'Health',
      subcategory: supplement.subcategory || '',
      description: supplement.description || 'Premium health supplement',
      detailed_description: supplement.detailed_description || '',
      key_benefits: supplement.key_benefits || '',
      ingredients: supplement.ingredients || '',
      serving_size: supplement.serving_size || '1 capsule',
      servings_per_container: supplement.servings_per_container || 30,
      directions_for_use: supplement.directions_for_use || 'Take as directed',
      warnings: supplement.warnings || 'Consult physician if pregnant or nursing',
      price: supplement.price?.toString() || '99',
      compare_at_price: supplement.compare_at_price || '',
      currency: supplement.currency || 'AED',
      stock_quantity: supplement.stock_quantity || 100,
      is_available: supplement.is_available !== false,
      is_featured: supplement.is_featured || false,
      is_bestseller: supplement.is_bestseller || false,
      image_url: getSupplementImageUrl(
        supplement.image_url || 
        (supplement.name ? supplement.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.jpg' : 'default-supplement.jpg')
      ),
      nutrition_facts: supplement.nutrition_facts || {},
      certifications: supplement.certifications || 'Third-party tested',
      target_audience: supplement.target_audience || 'Adults',
      health_conditions: supplement.health_conditions || '',
      allergen_info: supplement.allergen_info || '',
      manufacturer: supplement.manufacturer || 'Biowell Labs',
      country_of_origin: supplement.country_of_origin || 'UAE',
      expiry_date: supplement.expiry_date || '',
      barcode: supplement.barcode || '',
      sku: supplement.sku || '',
      weight_grams: supplement.weight_grams || '',
      tags: supplement.tags || '',
      seo_title: supplement.seo_title || '',
      seo_description: supplement.seo_description || ''
    }));

    console.log(`Successfully processed ${processedSupplements.length} supplements from database`);
    return processedSupplements;
  } catch (error) {
    console.error('Error fetching supplements from database:', error);
    return getFallbackSupplements();
  }
};

// Fetch supplement stacks from Supabase
export const fetchSupplementStacks = async (): Promise<SupplementStack[]> => {
  try {
    console.log('Fetching supplement stacks from Supabase database...');
    
    const { data: stacks, error } = await supabase
      .from('supplement_stacks')
      .select('*')
      .order('category');

    if (error) {
      console.error('Error fetching supplement stacks:', error);
      return getFallbackStacks();
    }

    if (!stacks || stacks.length === 0) {
      console.warn('No supplement stacks found, using fallback data');
      return getFallbackStacks();
    }

    console.log(`Found ${stacks.length} supplement stacks in database`);
    
    // Process stacks to ensure proper data types
    const processedStacks = stacks.map((stack: any) => ({
      id: stack.id,
      category: stack.category || 'Health',
      name: stack.name || 'Supplement Stack',
      total_price: parseFloat(stack.total_price?.toString() || '0'),
      components: stack.components || {}
    }));
    
    return processedStacks;
  } catch (error) {
    console.error('Error fetching supplement stacks:', error);
    return getFallbackStacks();
  }
};

// Fallback supplements if database fails
const getFallbackSupplements = (): SupplementData[] => [
  {
    id: 'fallback_1',
    name: 'Omega-3 Fish Oil',
    brand: 'Biowell',
    category: 'Essential Fatty Acids',
    subcategory: 'Fish Oil',
    description: 'High-potency omega-3 for heart and brain health',
    detailed_description: 'Premium quality omega-3 fatty acids sourced from wild-caught fish',
    key_benefits: 'Heart health, Brain function, Anti-inflammatory',
    ingredients: 'Fish Oil, EPA, DHA, Vitamin E',
    serving_size: '2 capsules',
    servings_per_container: 30,
    directions_for_use: 'Take 2 capsules daily with food',
    warnings: 'Consult physician if pregnant or nursing',
    price: '89',
    compare_at_price: '120',
    currency: 'AED',
    stock_quantity: 150,
    is_available: true,
    is_featured: true,
    is_bestseller: false,
    image_url: getSupplementImageUrl('omega-3-fish-oil.jpg'),
    nutrition_facts: {},
    certifications: 'Third-party tested',
    target_audience: 'Adults',
    health_conditions: 'Heart health, Cognitive function',
    allergen_info: 'Contains fish',
    manufacturer: 'Biowell Labs',
    country_of_origin: 'UAE',
    expiry_date: '2026-12-31',
    barcode: '123456789012',
    sku: 'BW-OMEGA3-001',
    weight_grams: '120',
    tags: 'omega-3, heart health, brain health',
    seo_title: 'Omega-3 Fish Oil Supplement',
    seo_description: 'High-quality omega-3 for optimal health'
  },
  {
    id: 'fallback_2',
    name: 'Vitamin D3 + K2',
    brand: 'Biowell',
    category: 'Vitamins',
    subcategory: 'Fat-Soluble Vitamins',
    description: 'Synergistic vitamin D3 and K2 for bone and immune health',
    detailed_description: 'Optimal ratio of D3 and K2 for maximum absorption and utilization',
    key_benefits: 'Bone health, Immune support, Calcium regulation',
    ingredients: 'Vitamin D3, Vitamin K2 (MK-7), MCT Oil',
    serving_size: '1 capsule',
    servings_per_container: 60,
    directions_for_use: 'Take 1 capsule daily with fat-containing meal',
    warnings: 'Consult physician if taking blood thinners',
    price: '79',
    compare_at_price: '99',
    currency: 'AED',
    stock_quantity: 200,
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    image_url: getSupplementImageUrl('vitamin-d3-k2.jpg'),
    nutrition_facts: {},
    certifications: 'Third-party tested, Non-GMO',
    target_audience: 'Adults',
    health_conditions: 'Vitamin D deficiency, Bone health',
    allergen_info: 'None',
    manufacturer: 'Biowell Labs',
    country_of_origin: 'UAE',
    expiry_date: '2026-12-31',
    barcode: '123456789013',
    sku: 'BW-D3K2-001',
    weight_grams: '90',
    tags: 'vitamin d, vitamin k2, bone health, immune',
    seo_title: 'Vitamin D3 + K2 Supplement',
    seo_description: 'Synergistic D3 and K2 for optimal health'
  }
];

// Fallback stacks if database fails
const getFallbackStacks = (): SupplementStack[] => [
  {
    id: 'stack_1',
    category: 'Energy & Performance',
    name: 'Energy & Focus Stack',
    total_price: 267,
    components: {
      supplements: ['B-Complex', 'CoQ10', 'Rhodiola'],
      description: 'Natural energy and mental clarity support'
    }
  },
  {
    id: 'stack_2',
    category: 'Sleep & Recovery',
    name: 'Recovery & Sleep Stack',
    total_price: 198,
    components: {
      supplements: ['Magnesium', 'Melatonin', 'Ashwagandha'],
      description: 'Optimize recovery and sleep quality'
    }
  },
  {
    id: 'stack_3',
    category: 'Metabolic Health',
    name: 'Glucose Control Stack',
    total_price: 201,
    components: {
      supplements: ['Berberine', 'Chromium', 'Alpha Lipoic Acid'],
      description: 'Support healthy blood sugar levels'
    }
  }
];

// Get supplements with caching
export const getSupplements = async (): Promise<SupplementData[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (supplementsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return supplementsCache;
  }
  
  // Fetch fresh data
  supplementsCache = await fetchSupplementsFromDatabase();
  cacheTimestamp = now;
  
  return supplementsCache;
};

// Get supplement stacks with caching
export const getSupplementStacks = async (): Promise<SupplementStack[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (stacksCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return stacksCache;
  }
  
  // Fetch fresh data
  stacksCache = await fetchSupplementStacks();
  cacheTimestamp = now;
  
  return stacksCache;
};

// Filter supplements by category
export const getSupplementsByCategory = async (category: string): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  if (category === 'all') return supplements;
  
  return supplements.filter(s => 
    s.category?.toLowerCase().includes(category.toLowerCase()) ||
    s.subcategory?.toLowerCase().includes(category.toLowerCase())
  );
};

// Search supplements
export const searchSupplements = async (query: string): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  const searchTerm = query.toLowerCase();
  
  return supplements.filter(s =>
    s.name?.toLowerCase().includes(searchTerm) ||
    s.description?.toLowerCase().includes(searchTerm) ||
    s.key_benefits?.toLowerCase().includes(searchTerm) ||
    s.tags?.toLowerCase().includes(searchTerm)
  );
};

// Get featured supplements
export const getFeaturedSupplements = async (): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  return supplements.filter(s => s.is_featured);
};

// Get bestseller supplements
export const getBestsellerSupplements = async (): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  return supplements.filter(s => s.is_bestseller);
};

// Format price with AED currency
export const formatSupplementPrice = (price: string | number): string => {
  // Handle null, undefined, empty string, or zero values
  if (price === null || price === undefined || price === '' || price === 0) {
    return 'AED 0';
  }
  
  let numericPrice: number;
  
  if (typeof price === 'string') {
    // Remove any currency symbols, spaces, and non-numeric characters except decimal point
    const cleanPrice = price.replace(/[^\d.-]/g, '').trim();
    if (cleanPrice === '' || cleanPrice === '.') {
      return 'AED 0';
    }
    numericPrice = parseFloat(cleanPrice);
  } else {
    numericPrice = price;
  }
  
  // Additional validation
  if (isNaN(numericPrice) || numericPrice < 0) {
    return 'AED 0';
  }
  
  // Format with proper AED currency
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

// Get supplement by ID
export const getSupplementById = async (id: string): Promise<SupplementData | null> => {
  const supplements = await getSupplements();
  return supplements.find(s => s.id === id) || null;
};

// Clear cache (useful for refreshing data)
export const clearSupplementCache = () => {
  supplementsCache = null;
  stacksCache = null;
  cacheTimestamp = 0;
};