// Warehouses store
export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const initialWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Almacén Principal',
    location: 'Bodega Central',
    description: 'Almacén principal de productos',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Almacén Secundario',
    location: 'Sucursal Norte',
    description: 'Almacén de respaldo',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let warehouses: Warehouse[] = [...initialWarehouses];

export const getWarehouses = (includeInactive = false): Warehouse[] => {
  return includeInactive ? [...warehouses] : warehouses.filter(w => w.active);
};

export const getWarehouseById = (id: string): Warehouse | undefined => {
  return warehouses.find(w => w.id === id);
};

export const addWarehouse = (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt' | 'active'>): Warehouse => {
  const newWarehouse: Warehouse = {
    ...warehouse,
    id: Date.now().toString(),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  warehouses.push(newWarehouse);
  return newWarehouse;
};

export const updateWarehouse = (id: string, updates: Partial<Omit<Warehouse, 'id' | 'createdAt'>>): Warehouse | undefined => {
  const index = warehouses.findIndex(w => w.id === id);
  if (index === -1) return undefined;
  
  warehouses[index] = {
    ...warehouses[index],
    ...updates,
    updatedAt: new Date(),
  };
  return warehouses[index];
};

export const toggleWarehouseActive = (id: string): Warehouse | undefined => {
  const warehouse = warehouses.find(w => w.id === id);
  if (!warehouse) return undefined;
  warehouse.active = !warehouse.active;
  warehouse.updatedAt = new Date();
  return warehouse;
};
