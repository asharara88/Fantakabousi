// Real Supplements Database from CSV
// Source: https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/supplementsdemo/Supplement%20Demo%20DB/supplements_final_db_ready.csv

export interface SupplementData {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  detailed_description: string;
  key_benefits: string;
  ingredients: string;
  serving_size: string;
  servings_per_container: number;
  directions_for_use: string;
  warnings: string;
  price: number;
  compare_at_price: number;
  currency: string;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  image_url: string;
  nutrition_facts: any;
  certifications: string;
  target_audience: string;
  health_conditions: string;
  allergen_info: string;
  manufacturer: string;
  country_of_origin: string;
  expiry_date: string;
  barcode: string;
  sku: string;
  weight_grams: string;
  tags: string;
  seo_title: string;
  seo_description: string;
}

// Fetch and parse CSV data
export const fetchSupplementsFromCSV = async (): Promise<SupplementData[]> => {
  try {
    const csvUrl = 'https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/supplementsdemo/Supplement%20Demo%20DB/supplements_final_db_ready.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzdXBwbGVtZW50c2RlbW8vU3VwcGxlbWVudCBEZW1vIERCL3N1cHBsZW1lbnRzX2ZpbmFsX2RiX3JlYWR5LmNzdiIsImlhdCI6MTc1Mzk1ODIyMiwiZXhwIjoxNzg1NDk0MjIyfQ.KpfkEXesOCCUC3Sf9xqQ7P4h0iNL6ekN9Xbg9JQQ3BI';
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching supplements CSV:', error);
    return getFallbackSupplements();
  }
};

// Parse CSV text into supplement objects
const parseCSV = (csvText: string): SupplementData[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = parseCSVLine(line);
      const supplement: any = {};
      
      headers.forEach((header, i) => {
        let value = values[i]?.trim().replace(/"/g, '') || '';
        
        // Type conversions
        switch (header) {
          case 'price':
          case 'compare_at_price':
            supplement[header] = parseFloat(value) || 0;
            break;
          case 'servings_per_container':
          case 'stock_quantity':
            supplement[header] = parseInt(value) || 0;
            break;
          case 'is_available':
          case 'is_featured':
          case 'is_bestseller':
            supplement[header] = value.toLowerCase() === 'true';
            break;
          case 'nutrition_facts':
            try {
              supplement[header] = value ? JSON.parse(value) : {};
            } catch {
              supplement[header] = {};
            }
            break;
          default:
            supplement[header] = value;
        }
      });
      
      // Generate ID if not present
      if (!supplement.id) {
        supplement.id = `supplement_${index + 1}`;
      }
      
      return supplement as SupplementData;
    });
};

// Parse CSV line handling quoted values
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

// Fallback supplements if CSV fails to load
const getFallbackSupplements = (): SupplementData[] => [
  {
    id: 'fallback_1',
    name: 'Premium Omega-3',
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
    price: 89,
    compare_at_price: 120,
    currency: 'AED',
    stock_quantity: 150,
    is_available: true,
    is_featured: true,
    is_bestseller: false,
    image_url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
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
    seo_title: 'Premium Omega-3 Supplement',
    seo_description: 'High-quality omega-3 for optimal health'
  }
];

// Cache for supplements data
let supplementsCache: SupplementData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get supplements with caching
export const getSupplements = async (): Promise<SupplementData[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (supplementsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return supplementsCache;
  }
  
  // Fetch fresh data
  supplementsCache = await fetchSupplementsFromCSV();
  cacheTimestamp = now;
  
  return supplementsCache;
};

// Filter supplements by category
export const getSupplementsByCategory = async (category: string): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  if (category === 'all') return supplements;
  
  return supplements.filter(s => 
    s.category.toLowerCase().includes(category.toLowerCase()) ||
    s.subcategory.toLowerCase().includes(category.toLowerCase())
  );
};

// Search supplements
export const searchSupplements = async (query: string): Promise<SupplementData[]> => {
  const supplements = await getSupplements();
  const searchTerm = query.toLowerCase();
  
  return supplements.filter(s =>
    s.name.toLowerCase().includes(searchTerm) ||
    s.description.toLowerCase().includes(searchTerm) ||
    s.key_benefits.toLowerCase().includes(searchTerm) ||
    s.tags.toLowerCase().includes(searchTerm)
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