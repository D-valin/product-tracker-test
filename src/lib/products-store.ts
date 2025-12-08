// Enhanced Product store with supplier, warehouse stock, and archive functionality
export interface ProductStock {
  warehouseId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  stock: number; // Total stock across all warehouses
  stockByWarehouse: ProductStock[];
  minStock: number;
  sku?: string;
  barcode?: string;
  unit: 'unidades' | 'litros' | 'cajas';
  supplierId?: string;
  active: boolean;
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
    stockByWarehouse: [{ warehouseId: '1', quantity: 5 }],
    minStock: 10,
    sku: 'ACE-5W30-001',
    barcode: '7501234567890',
    unit: 'litros',
    supplierId: '2',
    active: true,
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
    stockByWarehouse: [{ warehouseId: '1', quantity: 8 }],
    minStock: 15,
    sku: 'FIL-AIR-002',
    barcode: '7501234567891',
    unit: 'unidades',
    supplierId: '1',
    active: true,
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
    stockByWarehouse: [{ warehouseId: '1', quantity: 3 }],
    minStock: 5,
    sku: 'FRE-PAD-003',
    barcode: '7501234567892',
    unit: 'cajas',
    supplierId: '1',
    active: true,
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
    stockByWarehouse: [{ warehouseId: '1', quantity: 30 }, { warehouseId: '2', quantity: 20 }],
    minStock: 20,
    sku: 'ELE-BUJ-004',
    barcode: '7501234567893',
    unit: 'unidades',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let products: Product[] = [...initialProducts];

export const getProducts = (includeArchived = false): Product[] => {
  return includeArchived ? [...products] : products.filter(p => p.active);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'stockByWarehouse'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    active: true,
    stockByWarehouse: [{ warehouseId: '1', quantity: product.stock }],
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

export const toggleProductActive = (id: string): Product | undefined => {
  const product = products.find(p => p.id === id);
  if (!product) return undefined;
  product.active = !product.active;
  product.updatedAt = new Date();
  return product;
};

export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
};

export const searchProducts = (query: string, includeArchived = false): Product[] => {
  const lowerQuery = query.toLowerCase().trim();
  const baseProducts = includeArchived ? products : products.filter(p => p.active);
  
  if (!lowerQuery) return [...baseProducts];
  
  return baseProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.sku?.toLowerCase().includes(lowerQuery) ||
    p.barcode?.toLowerCase().includes(lowerQuery)
  );
};

// Update stock for a specific warehouse
export const updateWarehouseStock = (
  productId: string,
  warehouseId: string,
  quantityChange: number
): Product | undefined => {
  const product = products.find(p => p.id === productId);
  if (!product) return undefined;

  const warehouseStock = product.stockByWarehouse.find(s => s.warehouseId === warehouseId);
  
  if (warehouseStock) {
    warehouseStock.quantity += quantityChange;
  } else {
    product.stockByWarehouse.push({ warehouseId, quantity: quantityChange });
  }

  // Recalculate total stock
  product.stock = product.stockByWarehouse.reduce((sum, s) => sum + s.quantity, 0);
  product.updatedAt = new Date();
  
  return product;
};

// Transfer stock between warehouses
export const transferStock = (
  productId: string,
  fromWarehouseId: string,
  toWarehouseId: string,
  quantity: number
): Product | undefined => {
  const product = products.find(p => p.id === productId);
  if (!product) return undefined;

  const fromStock = product.stockByWarehouse.find(s => s.warehouseId === fromWarehouseId);
  if (!fromStock || fromStock.quantity < quantity) return undefined;

  fromStock.quantity -= quantity;

  const toStock = product.stockByWarehouse.find(s => s.warehouseId === toWarehouseId);
  if (toStock) {
    toStock.quantity += quantity;
  } else {
    product.stockByWarehouse.push({ warehouseId: toWarehouseId, quantity });
  }

  product.updatedAt = new Date();
  return product;
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

// Calculate gross profit
export const calculateGrossProfit = (price: number, cost: number): number => {
  return price - cost;
};

export const calculateGrossProfitMargin = (price: number, cost: number): number => {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
};
