import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, AlertCircle, BarChart3, Plus, List, Truck, Warehouse, History, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "@/lib/products-store";

const Dashboard = () => {
  const products = getProducts();
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Product Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin</span>
            <Button variant="outline" size="sm">Cerrar Sesión</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Panel de Control</h2>
          <p className="text-muted-foreground">Bienvenido al sistema de gestión de inventario</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${inventoryValue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Link to="/low-stock">
            <Card className="hover:border-destructive/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{lowStockProducts.length}</div>
                <p className="text-xs text-muted-foreground">Ver alertas</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reportes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0" asChild>
                <Link to="/reports">Ver reportes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Inventario</CardTitle>
              <CardDescription>Administra productos y movimientos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link to="/products"><List className="mr-2 h-5 w-5" />Ver Productos</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/products/add"><Plus className="mr-2 h-5 w-5" />Agregar Producto</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/stock/entry"><Package className="mr-2 h-5 w-5" />Movimientos de Stock</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/movements"><History className="mr-2 h-5 w-5" />Historial</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ventas y Compras</CardTitle>
              <CardDescription>Órdenes y clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/orders"><ShoppingCart className="mr-2 h-5 w-5" />Órdenes y Pedidos</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/customers"><Users className="mr-2 h-5 w-5" />Clientes</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/low-stock"><AlertCircle className="mr-2 h-5 w-5" />Alertas de Stock</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Proveedores y almacenes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/suppliers"><Truck className="mr-2 h-5 w-5" />Proveedores</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/warehouses"><Warehouse className="mr-2 h-5 w-5" />Almacenes</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/reports"><TrendingUp className="mr-2 h-5 w-5" />Ver Reportes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alertas de Stock Bajo</CardTitle>
                <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/low-stock">Ver Todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay productos con stock bajo</p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="block">
                    <div className="flex items-center justify-between border-b pb-3 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Stock: {product.stock} / Mínimo: {product.minStock}</p>
                      </div>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
