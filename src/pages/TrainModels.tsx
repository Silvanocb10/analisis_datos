import { useState } from "react";
import { ArrowLeft, Brain, Cpu, Zap, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const TrainModels = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState("Configurando...");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartTraining = () => {
    setIsTraining(true);
    setProgress(0);
    setTrainingStatus("Inicializando modelo...");

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    const statusUpdates = [
      { time: 0, status: "Inicializando modelo..." },
      { time: 1000, status: "Dividiendo datos..." },
      { time: 2000, status: "Entrenando Random Forest..." },
      { time: 2500, status: "Optimizando hiperparámetros..." },
      { time: 3000, status: "Finalizando entrenamiento..." },
    ];

    statusUpdates.forEach(({ time, status }) => {
      setTimeout(() => setTrainingStatus(status), time);
    });

    setTimeout(() => {
      const modelResults = {
        modelType: "Random Forest Classifier",
        accuracy: 94.2,
        precision: 91.8,
        recall: 93.5,
        f1Score: 92.6,
        trainingTime: "3.2s",
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('mlPipelineResults', JSON.stringify(modelResults));

      toast({
        title: "Entrenamiento completado",
        description: `Accuracy: ${modelResults.accuracy}% - Modelo listo`,
      });

      setIsTraining(false);
      setTrainingStatus("Completado");
      
      setTimeout(() => navigate('/results'), 1000);
    }, 3500);
  };

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
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Entrenar Modelos</h1>
              <p className="text-muted-foreground">Configura y entrena modelos con sklearn, PyTorch y más</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="sklearn" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sklearn" className="gap-2">
                <Zap className="w-4 h-4" />
                Scikit-learn
              </TabsTrigger>
              <TabsTrigger value="pytorch" className="gap-2">
                <Cpu className="w-4 h-4" />
                PyTorch
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Settings className="w-4 h-4" />
                Avanzado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sklearn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="p-6 shadow-card">
                    <h3 className="text-xl font-semibold mb-6">Configuración del modelo</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="model-type">Tipo de modelo</Label>
                        <select
                          id="model-type"
                          className="w-full mt-2 px-4 py-2 rounded-lg border border-input bg-background"
                        >
                          <option>Random Forest Classifier</option>
                          <option>Logistic Regression</option>
                          <option>Support Vector Machine (SVM)</option>
                          <option>Gradient Boosting</option>
                          <option>K-Nearest Neighbors</option>
                          <option>Decision Tree</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="test-size">Tamaño del test (%)</Label>
                          <div className="mt-4">
                            <Slider defaultValue={[20]} max={50} step={5} />
                            <div className="text-sm text-muted-foreground mt-2">20%</div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="random-state">Random State</Label>
                          <Input id="random-state" type="number" defaultValue="42" className="mt-2" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="n-estimators">N° de estimadores</Label>
                        <div className="mt-4">
                          <Slider defaultValue={[100]} max={500} step={10} />
                          <div className="text-sm text-muted-foreground mt-2">100 árboles</div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="max-depth">Profundidad máxima</Label>
                        <div className="mt-4">
                          <Slider defaultValue={[10]} max={50} step={1} />
                          <div className="text-sm text-muted-foreground mt-2">10 niveles</div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="features">Features a utilizar</Label>
                        <textarea
                          id="features"
                          placeholder="age, income, education, experience"
                          className="w-full mt-2 px-4 py-2 rounded-lg border border-input bg-background min-h-[80px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="target">Variable objetivo</Label>
                        <Input id="target" placeholder="salary" className="mt-2" />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <Button 
                        className="flex-1"
                        onClick={handleStartTraining}
                        disabled={isTraining}
                      >
                        {isTraining ? "Entrenando..." : "Iniciar entrenamiento"}
                      </Button>
                      <Button variant="outline" disabled={isTraining}>Validación cruzada</Button>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 shadow-card">
                    <h3 className="font-semibold mb-4">Estado del entrenamiento</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estado</span>
                        <span className={`font-medium ${isTraining ? 'text-primary' : 'text-warning'}`}>
                          {trainingStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 shadow-card bg-gradient-card">
                    <h3 className="font-semibold mb-3">Librerías disponibles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">scikit-learn</span>
                        <span className="text-success font-mono text-xs">1.3.0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">pandas</span>
                        <span className="text-success font-mono text-xs">2.0.3</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">numpy</span>
                        <span className="text-success font-mono text-xs">1.24.3</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pytorch">
              <Card className="p-8 shadow-card">
                <div className="text-center py-12">
                  <Cpu className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Configuración de PyTorch</h3>
                  <p className="text-muted-foreground mb-6">
                    Define arquitectura de red neuronal, optimizador y función de pérdida
                  </p>
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-left">
                        <Label>Arquitectura</Label>
                        <Input placeholder="[128, 64, 32]" className="mt-2" />
                      </div>
                      <div className="text-left">
                        <Label>Función de activación</Label>
                        <select className="w-full mt-2 px-4 py-2 rounded-lg border border-input bg-background">
                          <option>ReLU</option>
                          <option>Sigmoid</option>
                          <option>Tanh</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full">Configurar red neuronal</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="p-8 shadow-card">
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Configuración avanzada</h3>
                  <p className="text-muted-foreground">
                    Grid search, optimización de hiperparámetros y más
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TrainModels;
