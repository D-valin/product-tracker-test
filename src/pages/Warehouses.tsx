import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, ArrowLeft, Plus, Edit, Power } from "lucide-react";
import { Link } from "react-router-dom";
import { getWarehouses, addWarehouse, updateWarehouse, toggleWarehouseActive, type Warehouse } from "@/lib/warehouses-store";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(getWarehouses(true));
  const [showInactive, setShowInactive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
  });

  const filteredWarehouses = showInactive ? warehouses : warehouses.filter(w => w.active);

  const resetForm = () => {
    setFormData({ name: '', location: '', description: '' });
    setEditingWarehouse(null);
  };

  const handleOpenDialog = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({
        name: warehouse.name,
        location: warehouse.location || '',
        description: warehouse.description || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, formData);
      toast.success("Almacén actualizado");
    } else {
      addWarehouse(formData);
      toast.success("Almacén agregado");
    }

    setWarehouses(getWarehouses(true));
    setIsDialogOpen(false);
    resetForm();
  };

  const handleToggleActive = (id: string, name: string) => {
    const warehouse = toggleWarehouseActive(id);
    if (warehouse) {
      setWarehouses(getWarehouses(true));
      toast.success(`Almacén "${name}" ${warehouse.active ? 'activado' : 'desactivado'}`);
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Almacenes</h2>
            <p className="text-muted-foreground">Gestiona tus ubicaciones de stock</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Almacén
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingWarehouse ? 'Editar Almacén' : 'Nuevo Almacén'}</DialogTitle>
                <DialogDescription>
                  {editingWarehouse ? 'Modifica los datos del almacén' : 'Ingresa los datos del nuevo almacén'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nombre del almacén"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ubicación física"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del almacén"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Listado de Almacenes</CardTitle>
                <CardDescription>Administra las ubicaciones de inventario</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={showInactive} onCheckedChange={setShowInactive} />
                <Label>Mostrar inactivos</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No hay almacenes registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWarehouses.map((warehouse) => (
                      <TableRow key={warehouse.id} className={!warehouse.active ? 'opacity-60' : ''}>
                        <TableCell className="font-medium">{warehouse.name}</TableCell>
                        <TableCell>{warehouse.location || '-'}</TableCell>
                        <TableCell>{warehouse.description || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={warehouse.active ? 'default' : 'secondary'}>
                            {warehouse.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(warehouse)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(warehouse.id, warehouse.name)}
                            >
                              <Power className={`h-4 w-4 ${warehouse.active ? 'text-destructive' : 'text-green-500'}`} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Warehouses;
