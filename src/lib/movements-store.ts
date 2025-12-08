// Stock Movements store with audit trail
export type MovementType = 'entry' | 'exit' | 'transfer' | 'correction';
export type ExitReason = 'sale' | 'loss' | 'damaged' | 'expired' | 'other';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  warehouseId: string;
  warehouseName: string;
  destinationWarehouseId?: string;
  destinationWarehouseName?: string;
  supplierId?: string;
  supplierName?: string;
  exitReason?: ExitReason;
  notes?: string;
  correctionOf?: string; // Reference to original movement if this is a correction
  correctedBy?: string; // Reference to correction movement if this was corrected
  createdAt: Date;
  createdBy: string;
}

let movements: StockMovement[] = [];

export const getMovements = (): StockMovement[] => {
  return [...movements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getMovementsByProduct = (productId: string): StockMovement[] => {
  return movements
    .filter(m => m.productId === productId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getMovementById = (id: string): StockMovement | undefined => {
  return movements.find(m => m.id === id);
};

export const addMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement => {
  const newMovement: StockMovement = {
    ...movement,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  movements.push(newMovement);
  return newMovement;
};

// Create a correction movement that reverses the original
export const correctMovement = (
  originalId: string,
  notes: string,
  createdBy: string
): StockMovement | undefined => {
  const original = movements.find(m => m.id === originalId);
  if (!original || original.correctedBy) return undefined;

  // Create reversal movement
  const correctionMovement: StockMovement = {
    id: Date.now().toString(),
    productId: original.productId,
    productName: original.productName,
    type: 'correction',
    quantity: -original.quantity,
    previousStock: original.newStock,
    newStock: original.previousStock,
    warehouseId: original.warehouseId,
    warehouseName: original.warehouseName,
    correctionOf: originalId,
    notes: `Corrección: ${notes}`,
    createdAt: new Date(),
    createdBy,
  };

  // Mark original as corrected
  original.correctedBy = correctionMovement.id;
  
  movements.push(correctionMovement);
  return correctionMovement;
};

export const getExitReasons = () => [
  { value: 'sale', label: 'Venta' },
  { value: 'loss', label: 'Merma' },
  { value: 'damaged', label: 'Dañado' },
  { value: 'expired', label: 'Caducado' },
  { value: 'other', label: 'Otro' },
];
