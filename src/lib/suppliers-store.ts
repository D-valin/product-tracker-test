// Suppliers store
export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Distribuidora AutoParts',
    contact: 'Juan Pérez',
    phone: '555-1234',
    email: 'ventas@autoparts.com',
    address: 'Av. Industrial 123',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Lubricantes del Norte',
    contact: 'María García',
    phone: '555-5678',
    email: 'contacto@lubnorte.com',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let suppliers: Supplier[] = [...initialSuppliers];

export const getSuppliers = (includeInactive = false): Supplier[] => {
  return includeInactive ? [...suppliers] : suppliers.filter(s => s.active);
};

export const getSupplierById = (id: string): Supplier | undefined => {
  return suppliers.find(s => s.id === id);
};

export const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'active'>): Supplier => {
  const newSupplier: Supplier = {
    ...supplier,
    id: Date.now().toString(),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  suppliers.push(newSupplier);
  return newSupplier;
};

export const updateSupplier = (id: string, updates: Partial<Omit<Supplier, 'id' | 'createdAt'>>): Supplier | undefined => {
  const index = suppliers.findIndex(s => s.id === id);
  if (index === -1) return undefined;
  
  suppliers[index] = {
    ...suppliers[index],
    ...updates,
    updatedAt: new Date(),
  };
  return suppliers[index];
};

export const toggleSupplierActive = (id: string): Supplier | undefined => {
  const supplier = suppliers.find(s => s.id === id);
  if (!supplier) return undefined;
  supplier.active = !supplier.active;
  supplier.updatedAt = new Date();
  return supplier;
};
