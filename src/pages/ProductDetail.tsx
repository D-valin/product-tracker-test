import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Package, TrendingUp, Warehouse, History } from "lucide-react";
import { getProductById, getCategories, getUnits, calculateGrossProfitMargin } from "@/lib/products-store";
import { getMovementsByProduct } from "@/lib/movements-store";
import { getSupplierById } from "@/lib/suppliers-store";
import { getWarehouseById } from "@/lib/warehouses-store";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = id ? getProductById(id) : undefined;
  const movements = id ? getMovementsByProduct(id).slice(0, 5) : [];
  const supplier = product?.supplierId ? getSupplierById(product.supplierId) : undefined;
  const categories = getCategories();
  const units = getUnits();

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

  const categoryLabel = categories.find(c => c.value === product.category)?.label || product.category;
  const unitLabel = units.find(u => u.value === product.unit)?.label || product.unit;
  const profitMargin = calculateGrossProfitMargin(product.price, product.cost);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{product.name}</h1>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
          <Button asChild>
            <Link to={`/products/edit/${product.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{product.stock}</div>
              <p className="text-xs text-muted-foreground">Mínimo: {product.minStock}</p>
              {product.stock <= product.minStock && (
                <Badge variant="destructive" className="mt-2">Stock Bajo</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio de Venta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Costo: ${product.cost.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Ganancia: ${(product.price - product.cost).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">{categoryLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidad</p>
                  <p className="font-medium">{unitLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Código de Barras</p>
                  <p className="font-medium">{product.barcode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={product.active ? "default" : "secondary"}>
                    {product.active ? 'Activo' : 'Archivado'}
                  </Badge>
                </div>
              </div>
              {product.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="font-medium">{product.description}</p>
                </div>
              )}
              {supplier && (
                <div>
                  <p className="text-sm text-muted-foreground">Proveedor</p>
                  <p className="font-medium">{supplier.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Stock por Almacén
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(product.stockByWarehouse).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Sin stock en almacenes</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(product.stockByWarehouse).map(([warehouseId, stockData]) => {
                    const warehouse = getWarehouseById(warehouseId);
                    const quantity = typeof stockData === 'object' ? stockData.quantity : stockData;
                    return (
                      <div key={warehouseId} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{warehouse?.name || warehouseId}</span>
                        <Badge variant="outline">{quantity} {unitLabel}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Últimos Movimientos
              </CardTitle>
              <CardDescription>Historial reciente de entradas y salidas</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to={`/products/${product.id}/movements`}>Ver Todo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Sin movimientos registrados</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Almacén</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((mov) => {
                    const warehouse = mov.warehouseId ? getWarehouseById(mov.warehouseId) : undefined;
                    return (
                      <TableRow key={mov.id}>
                        <TableCell>
                          {format(new Date(mov.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={mov.type === 'entry' ? 'default' : mov.type === 'exit' ? 'destructive' : 'secondary'}>
                            {mov.type === 'entry' ? 'Entrada' : mov.type === 'exit' ? 'Salida' : 'Transferencia'}
                          </Badge>
                        </TableCell>
                        <TableCell>{mov.quantity}</TableCell>
                        <TableCell>{warehouse?.name || 'N/A'}</TableCell>
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

export default ProductDetail;
