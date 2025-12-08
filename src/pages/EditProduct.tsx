import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getProductById, updateProduct, getCategories, getUnits } from "@/lib/products-store";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  category: z.string().min(1, "La categoría es requerida"),
  price: z.string().min(1, "El precio es requerido").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Debe ser un número válido"),
  cost: z.string().min(1, "El costo es requerido").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Debe ser un número válido"),
  stock: z.string().min(1, "El stock es requerido").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Debe ser un número entero válido"),
  minStock: z.string().min(1, "El stock mínimo es requerido").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Debe ser un número entero válido"),
  sku: z.string().max(50, "Máximo 50 caracteres").optional(),
  barcode: z.string().max(50, "Máximo 50 caracteres").optional(),
  unit: z.enum(['unidades', 'litros', 'cajas'], { required_error: "La unidad es requerida" }),
});

type ProductFormData = z.infer<typeof productSchema>;

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categories = getCategories();
  const units = getUnits();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const selectedCategory = watch("category");
  const selectedUnit = watch("unit");

  useEffect(() => {
    if (!id) {
      toast.error("Producto no encontrado");
      navigate("/products");
      return;
    }

    const product = getProductById(id);
    if (!product) {
      toast.error("Producto no encontrado");
      navigate("/products");
      return;
    }

    // Populate form with existing data
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("category", product.category);
    setValue("price", product.price.toString());
    setValue("cost", product.cost.toString());
    setValue("stock", product.stock.toString());
    setValue("minStock", product.minStock.toString());
    setValue("sku", product.sku || "");
    setValue("barcode", product.barcode || "");
    setValue("unit", product.unit);
  }, [id, navigate, setValue]);

  const onSubmit = (data: ProductFormData) => {
    if (!id) return;

    const updated = updateProduct(id, {
      name: data.name,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      cost: Number(data.cost),
      stock: Number(data.stock),
      minStock: Number(data.minStock),
      sku: data.sku,
      barcode: data.barcode,
      unit: data.unit,
    });

    if (updated) {
      toast.success("Producto actualizado exitosamente");
      navigate("/products");
    } else {
      toast.error("Error al actualizar el producto");
    }
  };

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
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Editar Producto</h2>
          <p className="text-muted-foreground">Modifica la información del producto</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>Los campos marcados con * son obligatorios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Aceite de Motor 5W-30"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={selectedCategory} onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción detallada del producto"
                  rows={3}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cost">Precio de Compra *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("cost")}
                  />
                  {errors.cost && (
                    <p className="text-sm text-destructive">{errors.cost.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Venta *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* Inventory */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...register("stock")}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">{errors.stock.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    placeholder="0"
                    {...register("minStock")}
                  />
                  {errors.minStock && (
                    <p className="text-sm text-destructive">{errors.minStock.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidad de Medida *</Label>
                  <Select value={selectedUnit} onValueChange={(value: 'unidades' | 'litros' | 'cajas') => setValue("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && (
                    <p className="text-sm text-destructive">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sku">Código SKU</Label>
                  <Input
                    id="sku"
                    placeholder="Código interno"
                    {...register("sku")}
                  />
                  {errors.sku && (
                    <p className="text-sm text-destructive">{errors.sku.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input
                    id="barcode"
                    placeholder="Código de barras"
                    {...register("barcode")}
                  />
                  {errors.barcode && (
                    <p className="text-sm text-destructive">{errors.barcode.message}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/products">Cancelar</Link>
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;
