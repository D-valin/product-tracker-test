import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShoppingCart, Package, Search, Eye } from "lucide-react";
import { getOrders, getStatusLabel, getStatusColor, OrderStatus } from "@/lib/orders-store";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Orders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const allOrders = getOrders();
  
  const filterOrders = (type: 'sale' | 'purchase') => {
    return allOrders
      .filter(o => o.type === type)
      .filter(o => statusFilter === "all" || o.status === statusFilter)
      .filter(o => 
        o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.includes(searchQuery)
      );
  };

  const salesOrders = filterOrders('sale');
  const purchaseOrders = filterOrders('purchase');

  const statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Órdenes y Pedidos</h1>
            <p className="text-sm text-muted-foreground">Gestión de ventas y compras</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {allOrders.filter(o => o.type === 'sale').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compras</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {allOrders.filter(o => o.type === 'purchase').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Package className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {allOrders.filter(o => o.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Órdenes</CardTitle>
            <CardDescription>Administra las órdenes de venta y compra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, proveedor o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="sales">
              <TabsList className="mb-4">
                <TabsTrigger value="sales">Ventas ({salesOrders.length})</TabsTrigger>
                <TabsTrigger value="purchases">Compras ({purchaseOrders.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="sales">
                {salesOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hay órdenes de venta</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">#{order.id}</TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: es })}
                          </TableCell>
                          <TableCell>{order.customerName || 'N/A'}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="purchases">
                {purchaseOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hay órdenes de compra</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">#{order.id}</TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: es })}
                          </TableCell>
                          <TableCell>{order.supplierName || 'N/A'}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Orders;
