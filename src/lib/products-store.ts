// Simple in-memory product store for the POC
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  sku?: string;
  barcode?: string;
  unit: 'unidades' | 'litros' | 'cajas';
  createdAt: Date;
  updatedAt: Date;
}

// Initial sample data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Aceite de Motor 5W-30',
    description: 'Aceite sintético de alta calidad',
    category: 'lubricantes',
    price: 45.99,
    cost: 32.00,
    stock: 5,
    minStock: 10,
    sku: 'ACE-5W30-001',
    barcode: '7501234567890',
    unit: 'litros',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Filtro de Aire',
    description: 'Filtro de aire universal',
    category: 'filtros',
    price: 25.50,
    cost: 15.00,
    stock: 8,
    minStock: 15,
    sku: 'FIL-AIR-002',
    barcode: '7501234567891',
    unit: 'unidades',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Pastillas de Freno',
    description: 'Juego de pastillas de freno delanteras',
    category: 'frenos',
    price: 89.99,
    cost: 55.00,
    stock: 3,
    minStock: 5,
    sku: 'FRE-PAD-003',
    barcode: '7501234567892',
    unit: 'cajas',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Bujías NGK',
    description: 'Bujías de iridio para motor',
    category: 'electrico',
    price: 15.00,
    cost: 8.50,
    stock: 50,
    minStock: 20,
    sku: 'ELE-BUJ-004',
    barcode: '7501234567893',
    unit: 'unidades',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let products: Product[] = [...initialProducts];

export const getProducts = (): Product[] => {
  return [...products];
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | undefined => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date(),
  };
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getProducts();
  
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.sku?.toLowerCase().includes(lowerQuery) ||
    p.barcode?.toLowerCase().includes(lowerQuery)
  );
};

export const getCategories = () => [
  { value: 'lubricantes', label: 'Lubricantes' },
  { value: 'filtros', label: 'Filtros' },
  { value: 'frenos', label: 'Frenos' },
  { value: 'suspension', label: 'Suspensión' },
  { value: 'electrico', label: 'Eléctrico' },
  { value: 'otros', label: 'Otros' },
];

export const getUnits = () => [
  { value: 'unidades', label: 'Unidades' },
  { value: 'litros', label: 'Litros' },
  { value: 'cajas', label: 'Cajas' },
];
