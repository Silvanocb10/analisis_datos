import { useState } from "react";
import { Upload, Database, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const LoadData = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Generar vista previa de datos simulados
      const sampleRows = [
        { id: 1, nombre: "Ana García", edad: 28, ciudad: "Madrid", salario: 45000, experiencia: 5 },
        { id: 2, nombre: "Carlos López", edad: null, ciudad: "Barcelona", salario: 52000, experiencia: 7 },
        { id: 3, nombre: "María Rodríguez", edad: 35, ciudad: "Valencia", salario: null, experiencia: 10 },
        { id: 4, nombre: "Juan Martínez", edad: 42, ciudad: "Sevilla", salario: 58000, experiencia: 15 },
        { id: 5, nombre: "Laura Sánchez", edad: 31, ciudad: "Madrid", salario: 48000, experiencia: 8 },
        { id: 6, nombre: "Pedro Fernández", edad: 29, ciudad: "Barcelona", salario: 46000, experiencia: 6 },
      ];
      
      setPreviewData(sampleRows);
      
      toast({
        title: "Archivo cargado",
        description: `${file.name} está listo para procesarse`,
      });
    }
  };

  const handleProcessData = () => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Por favor carga un archivo primero",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento de datos
    setTimeout(() => {
      // Generar datos simulados
      const sampleRows = [
        { id: 1, nombre: "Ana García", edad: 28, ciudad: "Madrid", salario: 45000, experiencia: 5 },
        { id: 2, nombre: "Carlos López", edad: null, ciudad: "Barcelona", salario: 52000, experiencia: 7 },
        { id: 3, nombre: "María Rodríguez", edad: 35, ciudad: "Valencia", salario: null, experiencia: 10 },
        { id: 4, nombre: "Juan Martínez", edad: 42, ciudad: "Sevilla", salario: 58000, experiencia: 15 },
        { id: 5, nombre: "Laura Sánchez", edad: 31, ciudad: "Madrid", salario: 48000, experiencia: 8 },
        { id: 6, nombre: "Pedro Fernández", edad: 29, ciudad: "Barcelona", salario: 46000, experiencia: 6 },
      ];

      const sampleData = {
        fileName: uploadedFile.name,
        rows: 1000,
        columns: 6,
        nullValues: 45,
        duplicates: 12,
        timestamp: new Date().toISOString(),
        sampleRows: sampleRows,
      };
      
      localStorage.setItem('mlPipelineData', JSON.stringify(sampleData));
      
      toast({
        title: "Datos procesados exitosamente",
        description: `${sampleData.rows} filas y ${sampleData.columns} columnas cargadas`,
      });
      
      setIsProcessing(false);
      
      // Navegar a la siguiente etapa
      setTimeout(() => navigate('/clean-data'), 1000);
    }, 2000);
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
              <Database className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Cargar Datos</h1>
              <p className="text-muted-foreground">Importa archivos CSV o conecta a bases de datos externas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="csv" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="csv" className="gap-2">
              <FileText className="w-4 h-4" />
              Archivo CSV
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-2">
              <Database className="w-4 h-4" />
              Base de Datos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv">
            <Card className="p-8 shadow-card">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Importar archivo CSV</h3>
                  <p className="text-muted-foreground">Selecciona un archivo CSV desde tu computadora</p>
                </div>

                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-lg font-medium mb-2">
                      {uploadedFile ? uploadedFile.name : "Arrastra tu archivo aquí"}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      o haz clic para seleccionar
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button variant="secondary" className="mt-2">
                      Seleccionar archivo
                    </Button>
                  </Label>
                </div>

                {uploadedFile && (
                  <>
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div className="flex-1">
                        <p className="font-medium text-success">Archivo cargado exitosamente</p>
                        <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                      </div>
                    </div>

                    {/* Tabla de vista previa */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-4 py-2 border-b border-border">
                        <h4 className="font-semibold text-sm">Vista previa de datos (6 filas)</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/30">
                            <tr>
                              {previewData.length > 0 && Object.keys(previewData[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left font-medium text-muted-foreground border-b border-border">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, idx) => (
                              <tr key={idx} className="border-b border-border hover:bg-muted/20">
                                {Object.values(row).map((value: any, cellIdx) => (
                                  <td key={cellIdx} className="px-4 py-2">
                                    {value === null ? (
                                      <span className="text-warning italic">null</span>
                                    ) : (
                                      value
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1" 
                    onClick={handleProcessData}
                    disabled={!uploadedFile || isProcessing}
                  >
                    {isProcessing ? "Procesando..." : "Procesar datos"}
                  </Button>
                  <Button variant="outline" disabled={!uploadedFile}>Vista previa</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card className="p-8 shadow-card">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Conexión a base de datos</h3>
                  <p className="text-muted-foreground">Configura la conexión a tu base de datos externa</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="db-type">Tipo de base de datos</Label>
                    <select
                      id="db-type"
                      className="w-full mt-2 px-4 py-2 rounded-lg border border-input bg-background"
                    >
                      <option>PostgreSQL</option>
                      <option>MySQL</option>
                      <option>MongoDB</option>
                      <option>SQLite</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="host">Host</Label>
                    <Input id="host" placeholder="localhost:5432" className="mt-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Usuario</Label>
                      <Input id="username" placeholder="admin" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" placeholder="••••••••" className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="database">Nombre de la base de datos</Label>
                    <Input id="database" placeholder="ml_data" className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="query">Query SQL (opcional)</Label>
                    <textarea
                      id="query"
                      placeholder="SELECT * FROM dataset WHERE..."
                      className="w-full mt-2 px-4 py-2 rounded-lg border border-input bg-background min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">Conectar y cargar</Button>
                  <Button variant="outline">Probar conexión</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LoadData;
