import { ArrowLeft, BarChart3, TrendingUp, Award, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  // Datos para gráfico de línea - Evolución del entrenamiento
  const trainingData = [
    { epoch: 1, train: 0.75, validation: 0.72 },
    { epoch: 2, train: 0.82, validation: 0.80 },
    { epoch: 3, train: 0.87, validation: 0.85 },
    { epoch: 4, train: 0.91, validation: 0.89 },
    { epoch: 5, train: 0.94, validation: 0.92 },
  ];

  // Datos para gráfico de barras - Comparación de modelos
  const modelComparison = [
    { model: "Random Forest", accuracy: 94.2, precision: 91.8, recall: 93.5 },
    { model: "Logistic Reg", accuracy: 87.3, precision: 85.1, recall: 88.2 },
    { model: "SVM", accuracy: 89.5, precision: 87.9, recall: 90.1 },
    { model: "Neural Net", accuracy: 92.1, precision: 90.5, recall: 91.8 },
  ];

  // Datos para gráfico de pie - Distribución de clases
  const classDistribution = [
    { name: "Clase 0", value: 462, color: "hsl(var(--primary))" },
    { name: "Clase 1", value: 538, color: "hsl(var(--success))" },
  ];

  // Datos para feature importance
  const featureImportance = [
    { name: "income", importance: 28 },
    { name: "age", importance: 22 },
    { name: "education", importance: 18 },
    { name: "experience", importance: 15 },
    { name: "location", importance: 11 },
    { name: "skills", importance: 6 },
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="training">Entrenamiento</TabsTrigger>
              <TabsTrigger value="comparison">Comparación</TabsTrigger>
              <TabsTrigger value="confusion">Matriz confusión</TabsTrigger>
              <TabsTrigger value="feature">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <Card className="p-8 shadow-card">
                <h3 className="text-xl font-semibold mb-6">Distribución de clases</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={classDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {classDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="training">
              <Card className="p-8 shadow-card">
                <h3 className="text-xl font-semibold mb-6">Evolución durante el entrenamiento</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="epoch" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Época', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Accuracy', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="train" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Entrenamiento"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="validation" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Validación"
                      dot={{ fill: 'hsl(var(--success))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <Card className="p-8 shadow-card">
                <h3 className="text-xl font-semibold mb-6">Comparación de modelos</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={modelComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="model" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Accuracy" />
                    <Bar dataKey="precision" fill="hsl(var(--success))" name="Precision" />
                    <Bar dataKey="recall" fill="hsl(var(--warning))" name="Recall" />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={featureImportance} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Importancia (%)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="importance" fill="hsl(var(--primary))" name="Importancia" />
                  </BarChart>
                </ResponsiveContainer>
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
