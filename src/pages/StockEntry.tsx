import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ArrowLeft, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const stockEntrySchema = z.object({
  productName: z.string().min(1, "Selecciona un producto"),
  movementType: z.enum(["entrada", "salida"], {
    required_error: "Selecciona el tipo de movimiento",
  }),
  quantity: z.string().min(1, "La cantidad es requerida").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Debe ser un número mayor a 0"),
  reason: z.string().min(1, "El motivo es requerido").max(200, "Máximo 200 caracteres"),
  reference: z.string().max(100, "Máximo 100 caracteres").optional(),
  notes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type StockEntryFormData = z.infer<typeof stockEntrySchema>;

const StockEntry = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockEntryFormData>({
    resolver: zodResolver(stockEntrySchema),
  });

  const movementType = watch("movementType");

  const onSubmit = (data: StockEntryFormData) => {
    console.log("Stock movement data:", data);
    toast.success(`${data.movementType === "entrada" ? "Entrada" : "Salida"} registrada exitosamente`);
    navigate("/dashboard");
  };

  // Productos de ejemplo
  const sampleProducts = [
    "Aceite de Motor 5W-30",
    "Aceite de Motor 10W-40",
    "Filtro de Aire",
    "Filtro de Aceite",
    "Pastillas de Freno",
    "Bujías NGK",
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Registrar Movimiento de Stock</h2>
          <p className="text-muted-foreground">Registra entradas y salidas de inventario</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Información del Movimiento</CardTitle>
              <CardDescription>Todos los campos son obligatorios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Movement Type */}
              <div className="space-y-2">
                <Label htmlFor="movementType">Tipo de Movimiento *</Label>
                <Select onValueChange={(value) => setValue("movementType", value as "entrada" | "salida")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-accent" />
                        <span>Entrada (Agregar stock)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="salida">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-destructive" />
                        <span>Salida (Reducir stock)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.movementType && (
                  <p className="text-sm text-destructive">{errors.movementType.message}</p>
                )}
              </div>

              {/* Product Selection */}
              <div className="space-y-2">
                <Label htmlFor="productName">Producto *</Label>
                <Select onValueChange={(value) => setValue("productName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleProducts.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productName && (
                  <p className="text-sm text-destructive">{errors.productName.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity.message}</p>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Select onValueChange={(value) => setValue("reason", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {movementType === "entrada" ? (
                      <>
                        <SelectItem value="compra">Compra a proveedor</SelectItem>
                        <SelectItem value="devolucion">Devolución de cliente</SelectItem>
                        <SelectItem value="ajuste">Ajuste de inventario</SelectItem>
                        <SelectItem value="traslado">Traslado de bodega</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="devolucion_proveedor">Devolución a proveedor</SelectItem>
                        <SelectItem value="merma">Merma o pérdida</SelectItem>
                        <SelectItem value="ajuste">Ajuste de inventario</SelectItem>
                        <SelectItem value="traslado">Traslado de bodega</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.reason && (
                  <p className="text-sm text-destructive">{errors.reason.message}</p>
                )}
              </div>

              {/* Reference */}
              <div className="space-y-2">
                <Label htmlFor="reference">Número de Referencia</Label>
                <Input
                  id="reference"
                  placeholder="Ej: Factura #12345, Orden #67890"
                  {...register("reference")}
                />
                {errors.reference && (
                  <p className="text-sm text-destructive">{errors.reference.message}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Información adicional sobre el movimiento"
                  rows={3}
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">{errors.notes.message}</p>
                )}
              </div>

              {/* Summary Card */}
              {movementType && (
                <Card className={movementType === "entrada" ? "bg-accent/10 border-accent" : "bg-destructive/10 border-destructive"}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {movementType === "entrada" ? (
                          <Plus className="h-8 w-8 text-accent" />
                        ) : (
                          <Minus className="h-8 w-8 text-destructive" />
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Movimiento</p>
                          <p className="text-lg font-semibold">
                            {movementType === "entrada" ? "Entrada de Stock" : "Salida de Stock"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard">Cancelar</Link>
                </Button>
                <Button type="submit">Registrar Movimiento</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default StockEntry;
