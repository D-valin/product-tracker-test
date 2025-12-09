export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

let customers: Customer[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@ejemplo.com',
    phone: '+52 555 123 4567',
    address: 'Calle Principal 123, Ciudad',
    notes: 'Cliente frecuente',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Juan López',
    email: 'juan@ejemplo.com',
    phone: '+52 555 987 6543',
    address: 'Avenida Central 456, Ciudad',
    notes: '',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  }
];

export const getCustomers = (): Customer[] => {
  return [...customers].sort((a, b) => a.name.localeCompare(b.name));
};

export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(c => c.id === id);
};

export const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = (id: string, updates: Partial<Omit<Customer, 'id' | 'createdAt'>>): Customer | undefined => {
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  customers[index] = {
    ...customers[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return customers[index];
};

export const deleteCustomer = (id: string): boolean => {
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return false;
  customers.splice(index, 1);
  return true;
};

export const searchCustomers = (query: string): Customer[] => {
  const lowerQuery = query.toLowerCase();
  return customers.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.email.toLowerCase().includes(lowerQuery) ||
    c.phone.includes(query)
  );
};
