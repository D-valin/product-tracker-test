import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, AlertCircle, BarChart3, Plus, List } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Panel de Control</h2>
          <p className="text-muted-foreground">Bienvenido al sistema de gestión de inventario</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">12</div>
              <p className="text-xs text-muted-foreground">Productos requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$18,742</div>
              <p className="text-xs text-accent">+15% desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tu inventario de forma rápida</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link to="/products">
                  <List className="mr-2 h-5 w-5" />
                  Ver Productos
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/products/add">
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar Nuevo Producto
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/stock/entry">
                  <Package className="mr-2 h-5 w-5" />
                  Registrar Entrada de Stock
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link to="/reports">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Ver Reportes
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas de Stock Bajo</CardTitle>
              <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-foreground">Aceite de Motor 5W-30</p>
                    <p className="text-sm text-muted-foreground">Stock actual: 5 unidades</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-foreground">Filtro de Aire</p>
                    <p className="text-sm text-muted-foreground">Stock actual: 8 unidades</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Pastillas de Freno</p>
                    <p className="text-sm text-muted-foreground">Stock actual: 3 unidades</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimos movimientos de inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">Entrada de Stock</p>
                    <p className="text-sm text-muted-foreground">50 unidades de Aceite 10W-40</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Hace 2 horas</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">Venta Registrada</p>
                    <p className="text-sm text-muted-foreground">Venta de $850 - 5 productos</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Hace 4 horas</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">Nuevo Producto</p>
                    <p className="text-sm text-muted-foreground">Bujías NGK añadidas al inventario</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Hace 1 día</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
