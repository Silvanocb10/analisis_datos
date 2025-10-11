import { ArrowLeft, Droplets, Settings2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const CleanData = () => {
  const cleaningOptions = [
    {
      category: "Valores faltantes",
      options: [
        { id: "remove-na", label: "Eliminar filas con valores nulos", method: "dropna()" },
        { id: "fill-mean", label: "Rellenar con media", method: "fillna(mean)" },
        { id: "fill-median", label: "Rellenar con mediana", method: "fillna(median)" },
        { id: "interpolate", label: "Interpolación lineal", method: "interpolate()" },
      ],
    },
    {
      category: "Duplicados",
      options: [
        { id: "remove-duplicates", label: "Eliminar filas duplicadas", method: "drop_duplicates()" },
        { id: "keep-first", label: "Mantener primera ocurrencia", method: "keep='first'" },
      ],
    },
    {
      category: "Outliers",
      options: [
        { id: "remove-outliers", label: "Eliminar valores atípicos (Z-score > 3)", method: "scipy.stats" },
        { id: "cap-outliers", label: "Limitar valores extremos (IQR)", method: "np.clip()" },
      ],
    },
    {
      category: "Transformaciones",
      options: [
        { id: "normalize", label: "Normalización (0-1)", method: "MinMaxScaler" },
        { id: "standardize", label: "Estandarización (Z-score)", method: "StandardScaler" },
        { id: "log-transform", label: "Transformación logarítmica", method: "np.log()" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Limpiar Datos</h1>
              <p className="text-muted-foreground">Preprocesa y limpia tus datasets con herramientas avanzadas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Options Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Opciones de limpieza</h2>
                </div>
              </div>

              <div className="space-y-6">
                {cleaningOptions.map((section, idx) => (
                  <div key={section.category}>
                    <h3 className="font-semibold text-foreground mb-3">{section.category}</h3>
                    <div className="space-y-3">
                      {section.options.map((option) => (
                        <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                          <Checkbox id={option.id} />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="cursor-pointer font-medium">
                              {option.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              <code className="text-xs bg-muted px-2 py-0.5 rounded">{option.method}</code>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {idx < cleaningOptions.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button className="flex-1 gap-2">
                  <Play className="w-4 h-4" />
                  Ejecutar limpieza
                </Button>
                <Button variant="outline">Vista previa</Button>
              </div>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Estadísticas del dataset</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Filas totales</span>
                    <span className="font-semibold">1,000</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Columnas</span>
                    <span className="font-semibold">15</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Valores nulos</span>
                    <span className="font-semibold text-warning">45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duplicados</span>
                    <span className="font-semibold text-destructive">12</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Calidad de datos</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Completitud</span>
                        <span className="font-medium">95.5%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: "95.5%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Unicidad</span>
                        <span className="font-medium">98.8%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: "98.8%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card bg-gradient-card">
              <h3 className="font-semibold mb-3">Métodos disponibles</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Pandas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">NumPy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Scikit-learn</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CleanData;
