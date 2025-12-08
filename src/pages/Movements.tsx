import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, Search, Plus, Minus, ArrowRightLeft, RotateCcw, History } from "lucide-react";
import { Link } from "react-router-dom";
import { getMovements, correctMovement, getExitReasons, type StockMovement } from "@/lib/movements-store";
import { updateWarehouseStock } from "@/lib/products-store";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Movements = () => {
  const [movements, setMovements] = useState<StockMovement[]>(getMovements());
  const [searchQuery, setSearchQuery] = useState("");
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [correctionNotes, setCorrectionNotes] = useState("");

  const exitReasons = getExitReasons();

  const filteredMovements = movements.filter(m =>
    m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.warehouseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entry': return <Plus className="h-4 w-4 text-green-500" />;
      case 'exit': return <Minus className="h-4 w-4 text-red-500" />;
      case 'transfer': return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      case 'correction': return <RotateCcw className="h-4 w-4 text-orange-500" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'entry': return 'Entrada';
      case 'exit': return 'Salida';
      case 'transfer': return 'Transferencia';
      case 'correction': return 'Corrección';
      default: return type;
    }
  };

  const getMovementBadgeVariant = (type: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (type) {
      case 'entry': return 'default';
      case 'exit': return 'destructive';
      case 'transfer': return 'outline';
      case 'correction': return 'secondary';
      default: return 'outline';
    }
  };

  const handleOpenCorrection = (movement: StockMovement) => {
    if (movement.correctedBy) {
      toast.error("Este movimiento ya fue corregido");
      return;
    }
    if (movement.type === 'correction') {
      toast.error("No se puede corregir una corrección");
      return;
    }
    setSelectedMovement(movement);
    setCorrectionNotes("");
    setCorrectionDialogOpen(true);
  };

  const handleSubmitCorrection = () => {
    if (!selectedMovement || !correctionNotes.trim()) {
      toast.error("Ingresa una nota explicando la corrección");
      return;
    }

    // Reverse the stock change
    if (selectedMovement.type === 'entry') {
      updateWarehouseStock(selectedMovement.productId, selectedMovement.warehouseId, -selectedMovement.quantity);
    } else if (selectedMovement.type === 'exit') {
      updateWarehouseStock(selectedMovement.productId, selectedMovement.warehouseId, Math.abs(selectedMovement.quantity));
    }

    const correction = correctMovement(selectedMovement.id, correctionNotes, 'Admin');
    
    if (correction) {
      setMovements(getMovements());
      toast.success("Corrección registrada exitosamente");
      setCorrectionDialogOpen(false);
    } else {
      toast.error("Error al registrar la corrección");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Product Tracker</h1>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Historial de Movimientos</h2>
            <p className="text-muted-foreground">Registro de todas las entradas, salidas y transferencias</p>
          </div>
          <Button asChild>
            <Link to="/stock/entry">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Movimiento
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos de Inventario</CardTitle>
            <CardDescription>Historial completo con registro de auditoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por producto o almacén..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Almacén</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No hay movimientos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMovements.map((movement) => (
                      <TableRow key={movement.id} className={movement.correctedBy ? 'opacity-60 line-through' : ''}>
                        <TableCell className="text-sm">
                          {format(movement.createdAt, "dd/MM/yyyy HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.type)}
                            <Badge variant={getMovementBadgeVariant(movement.type)}>
                              {getMovementLabel(movement.type)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{movement.productName}</TableCell>
                        <TableCell>
                          <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          {movement.warehouseName}
                          {movement.destinationWarehouseName && (
                            <span className="text-muted-foreground"> → {movement.destinationWarehouseName}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {movement.supplierName && <span>Proveedor: {movement.supplierName}</span>}
                          {movement.exitReason && (
                            <span>Motivo: {exitReasons.find(r => r.value === movement.exitReason)?.label}</span>
                          )}
                          {movement.correctionOf && <span>Corrección de movimiento anterior</span>}
                          {movement.notes && <span>{movement.notes}</span>}
                        </TableCell>
                        <TableCell>
                          {movement.correctedBy ? (
                            <Badge variant="outline" className="text-orange-500 border-orange-500">
                              Corregido
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Válido
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!movement.correctedBy && movement.type !== 'correction' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenCorrection(movement)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Corregir
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Corregir Movimiento</DialogTitle>
              <DialogDescription>
                Esta acción creará un movimiento inverso para anular el original. Ingresa una nota explicativa.
              </DialogDescription>
            </DialogHeader>
            {selectedMovement && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm"><strong>Producto:</strong> {selectedMovement.productName}</p>
                  <p className="text-sm"><strong>Tipo:</strong> {getMovementLabel(selectedMovement.type)}</p>
                  <p className="text-sm"><strong>Cantidad:</strong> {selectedMovement.quantity}</p>
                  <p className="text-sm"><strong>Almacén:</strong> {selectedMovement.warehouseName}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Motivo de la corrección *</Label>
                  <Textarea
                    id="notes"
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="Explica el motivo de esta corrección..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setCorrectionDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmitCorrection}>Confirmar Corrección</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Movements;
