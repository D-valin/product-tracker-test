import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, History } from "lucide-react";
import { getProductById } from "@/lib/products-store";
import { getMovementsByProduct, getExitReasons } from "@/lib/movements-store";
import { getWarehouseById } from "@/lib/warehouses-store";
import { getSupplierById } from "@/lib/suppliers-store";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ProductMovements = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = id ? getProductById(id) : undefined;
  const movements = id ? getMovementsByProduct(id) : [];
  const exitReasons = getExitReasons();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Producto no encontrado</p>
          <Button asChild>
            <Link to="/products">Volver a Productos</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const getExitReasonLabel = (reason: string) => {
    return exitReasons.find(r => r.value === reason)?.label || reason;
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      entry: 'Entrada',
      exit: 'Salida',
      transfer: 'Transferencia',
      correction: 'Corrección'
    };
    return labels[type] || type;
  };

  const getMovementVariant = (type: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (type) {
      case 'entry': return 'default';
      case 'exit': return 'destructive';
      case 'correction': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Historial de Movimientos</h1>
            <p className="text-sm text-muted-foreground">{product.name} - SKU: {product.sku}</p>
          </div>
          <Button variant="outline" asChild>
            <Link to={`/products/${product.id}`}>Ver Producto</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Movimientos de Stock
            </CardTitle>
            <CardDescription>
              {movements.length} movimientos registrados para este producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay movimientos registrados para este producto
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Almacén</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((mov) => {
                    const warehouse = mov.warehouseId ? getWarehouseById(mov.warehouseId) : undefined;
                    const destWarehouse = mov.destinationWarehouseId ? getWarehouseById(mov.destinationWarehouseId) : undefined;
                    const supplier = mov.supplierId ? getSupplierById(mov.supplierId) : undefined;

                    return (
                      <TableRow key={mov.id} className={mov.correctedBy ? 'opacity-50' : ''}>
                        <TableCell>
                          {format(new Date(mov.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getMovementVariant(mov.type)}>
                            {getMovementTypeLabel(mov.type)}
                          </Badge>
                          {mov.correctedBy && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              Corregido
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {mov.type === 'entry' ? '+' : mov.type === 'exit' ? '-' : ''}{mov.quantity}
                        </TableCell>
                        <TableCell>
                          {warehouse?.name || 'N/A'}
                          {destWarehouse && ` → ${destWarehouse.name}`}
                        </TableCell>
                        <TableCell>
                          {mov.exitReason ? getExitReasonLabel(mov.exitReason) : '-'}
                        </TableCell>
                        <TableCell>{supplier?.name || '-'}</TableCell>
                        <TableCell>{mov.createdBy}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {mov.notes || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductMovements;
