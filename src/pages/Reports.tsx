import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ArrowLeft, TrendingUp, TrendingDown, DollarSign, AlertCircle, BarChart3, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Reports = () => {
  // Datos de ejemplo para los reportes
  const topProducts = [
    { name: "Aceite de Motor 5W-30", sold: 145, revenue: "$4,350" },
    { name: "Filtro de Aire", sold: 98, revenue: "$2,940" },
    { name: "Pastillas de Freno", sold: 87, revenue: "$3,480" },
    { name: "Aceite 10W-40", sold: 76, revenue: "$2,280" },
    { name: "Bujías NGK", sold: 65, revenue: "$1,950" },
  ];

  const lowStockProducts = [
    { name: "Aceite de Motor 5W-30", current: 5, min: 20, status: "critical" },
    { name: "Filtro de Aire", current: 8, min: 15, status: "warning" },
    { name: "Pastillas de Freno", current: 3, min: 10, status: "critical" },
    { name: "Filtro de Aceite", current: 12, min: 15, status: "warning" },
    { name: "Líquido de Frenos", current: 6, min: 12, status: "warning" },
  ];

  const recentMovements = [
    { date: "2024-01-15", type: "Entrada", product: "Aceite 10W-40", quantity: 50, reference: "Factura #1234" },
    { date: "2024-01-15", type: "Salida", product: "Filtro de Aire", quantity: 5, reference: "Venta #890" },
    { date: "2024-01-14", type: "Entrada", product: "Pastillas de Freno", quantity: 30, reference: "Factura #1230" },
    { date: "2024-01-14", type: "Salida", product: "Aceite 5W-30", quantity: 8, reference: "Venta #885" },
    { date: "2024-01-13", type: "Entrada", product: "Bujías NGK", quantity: 100, reference: "Factura #1228" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Reportes y Estadísticas</h2>
              <p className="text-muted-foreground">Análisis detallado de tu inventario</p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exportar Reportes
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">$18,742</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +15% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">471</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">32.5%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +2.3% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Productos requieren atención
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different reports */}
        <Tabs defaultValue="top-products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="top-products">Productos Top</TabsTrigger>
            <TabsTrigger value="low-stock">Stock Bajo</TabsTrigger>
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
          </TabsList>

          <TabsContent value="top-products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos del mes actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? "bg-accent/20 text-accent" :
                          index === 1 ? "bg-primary/20 text-primary" :
                          "bg-muted text-muted-foreground"
                        } font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sold} unidades vendidas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{product.revenue}</p>
                        <p className="text-sm text-muted-foreground">Ingresos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos con Stock Bajo</CardTitle>
                <CardDescription>Productos que necesitan reabastecimiento urgente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <AlertCircle className={`h-5 w-5 ${
                          product.status === "critical" ? "text-destructive" : "text-warning"
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Stock mínimo: {product.min} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          product.status === "critical" ? "text-destructive" : "text-warning"
                        }`}>
                          {product.current} unidades
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.status === "critical" ? "Crítico" : "Advertencia"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Recientes</CardTitle>
                <CardDescription>Últimas entradas y salidas de inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMovements.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          movement.type === "Entrada" ? "bg-accent" : "bg-destructive"
                        }`}></div>
                        <div>
                          <p className="font-medium text-foreground">{movement.product}</p>
                          <p className="text-sm text-muted-foreground">{movement.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          movement.type === "Entrada" ? "text-accent" : "text-destructive"
                        }`}>
                          {movement.type === "Entrada" ? "+" : "-"}{movement.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">{movement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
