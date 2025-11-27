import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertCircle, BarChart3, ShoppingCart, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Product Tracker</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Características</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Beneficios</a>
            <Button asChild>
              <Link to="/dashboard">Acceder al Sistema</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Software de Inventario Inteligente
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Gestiona tu inventario de forma{" "}
            <span className="text-primary">simple e intuitiva</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Diseñado especialmente para microempresas. Control total de productos, alertas inteligentes y reportes en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-lg">
              <Link to="/dashboard">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas en un solo lugar
            </h3>
            <p className="text-lg text-muted-foreground">
              Funcionalidades diseñadas para optimizar tu gestión de inventario
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>
                  Añade, edita y organiza tus productos con facilidad. Sistema intuitivo de categorías.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertCircle className="h-12 w-12 text-warning mb-4" />
                <CardTitle>Alertas de Stock Bajo</CardTitle>
                <CardDescription>
                  Recibe notificaciones automáticas cuando tus productos alcancen el stock mínimo.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Reportes en Tiempo Real</CardTitle>
                <CardDescription>
                  Visualiza estadísticas y tendencias de tu inventario al instante.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Control de Movimientos</CardTitle>
                <CardDescription>
                  Registra entradas y salidas de productos con historial completo.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Gestión de Ventas</CardTitle>
                <CardDescription>
                  Sistema POS integrado para registrar ventas y actualizar stock automáticamente.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Exportación de Datos</CardTitle>
                <CardDescription>
                  Exporta reportes en múltiples formatos para análisis y contabilidad.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Diseñado para microempresas como la tuya
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Fácil de usar</h4>
                    <p className="text-muted-foreground">
                      Interfaz intuitiva que no requiere capacitación técnica
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Conexión a base de datos</h4>
                    <p className="text-muted-foreground">
                      Integración flexible con diferentes sistemas de bases de datos
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Acceso desde cualquier lugar</h4>
                    <p className="text-muted-foreground">
                      Sistema web responsive que funciona en cualquier dispositivo
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                <Package className="h-48 w-48 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-primary-foreground">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para optimizar tu inventario?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Comienza a usar Product Tracker hoy y lleva tu negocio al siguiente nivel
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg">
            <Link to="/dashboard">Acceder al Sistema</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">Product Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Product Tracker. Sistema de inventario para microempresas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
