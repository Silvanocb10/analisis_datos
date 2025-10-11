import { ArrowLeft, BarChart3, TrendingUp, Award, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Results = () => {
  const metrics = [
    { label: "Accuracy", value: "94.2%", trend: "+2.3%" },
    { label: "Precision", value: "91.8%", trend: "+1.5%" },
    { label: "Recall", value: "93.5%", trend: "+3.1%" },
    { label: "F1-Score", value: "92.6%", trend: "+2.8%" },
  ];

  const confusionMatrix = [
    [450, 12],
    [8, 530],
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Resultados</h1>
                <p className="text-muted-foreground">Visualiza métricas, predicciones y análisis de rendimiento</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar reporte
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {metric.trend}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="confusion">Matriz de confusión</TabsTrigger>
              <TabsTrigger value="feature">Importancia de features</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <Card className="p-8 shadow-card">
                <h3 className="text-xl font-semibold mb-6">Métricas de clasificación</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm text-muted-foreground">94.2%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: "94.2%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Precision</span>
                      <span className="text-sm text-muted-foreground">91.8%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: "91.8%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Recall</span>
                      <span className="text-sm text-muted-foreground">93.5%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: "93.5%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">F1-Score</span>
                      <span className="text-sm text-muted-foreground">92.6%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: "92.6%" }} />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="confusion">
              <Card className="p-8 shadow-card">
                <h3 className="text-xl font-semibold mb-6">Matriz de confusión</h3>
                <div className="max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div></div>
                    <div className="grid grid-cols-2 gap-4 text-center text-sm font-medium text-muted-foreground">
                      <div>Pred: No</div>
                      <div>Pred: Sí</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col justify-center gap-20 text-sm font-medium text-muted-foreground">
                      <div>Real: No</div>
                      <div>Real: Sí</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {confusionMatrix.map((row, i) =>
                        row.map((value, j) => (
                          <div
                            key={`${i}-${j}`}
                            className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-bold ${
                              i === j
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {value}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="feature">
              <Card className="p-8 shadow-card">
                <h3 className="text-xl font-semibold mb-6">Importancia de características</h3>
                <div className="space-y-4">
                  {[
                    { name: "income", importance: 0.28 },
                    { name: "age", importance: 0.22 },
                    { name: "education", importance: 0.18 },
                    { name: "experience", importance: 0.15 },
                    { name: "location", importance: 0.11 },
                    { name: "skills", importance: 0.06 },
                  ].map((feature) => (
                    <div key={feature.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{feature.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {(feature.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary"
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Best Model Card */}
          <Card className="p-6 shadow-card bg-gradient-card border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Mejor modelo encontrado</h3>
                <p className="text-sm text-muted-foreground">Random Forest Classifier con accuracy de 94.2%</p>
              </div>
              <Button>Ver detalles</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Results;
