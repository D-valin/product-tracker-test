export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type OrderType = 'purchase' | 'sale';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  customerId?: string;
  customerName?: string;
  supplierId?: string;
  supplierName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

let orders: Order[] = [
  {
    id: '1',
    type: 'sale',
    status: 'delivered',
    customerId: '1',
    customerName: 'María García',
    items: [
      { productId: '1', productName: 'Laptop HP 15', quantity: 1, unitPrice: 899.99, total: 899.99 }
    ],
    subtotal: 899.99,
    tax: 143.99,
    total: 1043.98,
    notes: 'Entrega a domicilio',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-02T14:00:00Z'
  },
  {
    id: '2',
    type: 'purchase',
    status: 'pending',
    supplierId: '1',
    supplierName: 'TechDistributor S.A.',
    items: [
      { productId: '2', productName: 'Mouse Inalámbrico', quantity: 50, unitPrice: 15.99, total: 799.50 },
      { productId: '3', productName: 'Teclado Mecánico', quantity: 25, unitPrice: 45.99, total: 1149.75 }
    ],
    subtotal: 1949.25,
    tax: 311.88,
    total: 2261.13,
    notes: 'Pedido mensual',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z'
  }
];

export const getOrders = (): Order[] => {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(o => o.id === id);
};

export const getOrdersByType = (type: OrderType): Order[] => {
  return orders.filter(o => o.type === type).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return orders.filter(o => o.status === status);
};

export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = (id: string, status: OrderStatus): Order | undefined => {
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return undefined;
  
  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString()
  };
  return orders[index];
};

export const deleteOrder = (id: string): boolean => {
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return false;
  orders.splice(index, 1);
  return true;
};

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    shipped: 'bg-accent/10 text-accent border-accent/20',
    delivered: 'bg-accent/10 text-accent border-accent/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
  };
  return colors[status];
};
