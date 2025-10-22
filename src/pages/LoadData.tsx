import { useState } from "react";
import { Upload, Database, FileText, ArrowLeft, CheckCircle, Search, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import EditableDataGrid, { ColumnSchema } from "@/components/EditableDataGrid";
import { supabase } from "@/integrations/supabase/client";

const LoadData = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [allPreviewData, setAllPreviewData] = useState<any[]>([]);
  const [columnSchema, setColumnSchema] = useState<ColumnSchema[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setPreviewData([]);
      
      toast({
        title: "Archivo cargado",
        description: `${file.name} está listo para procesarse`,
      });
    }
  };

  const handlePreview = () => {
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) return;
      
      // Parse CSV header
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parse all data rows
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || null;
        });
        return row;
      });
      
      setAllPreviewData(rows);
      setPreviewData(rows);
      setShowPreview(true);
      
      toast({
        title: "Vista previa generada",
        description: `Cargados ${rows.length} registros`,
      });
    };
    
    reader.readAsText(uploadedFile);
  };

  const handleSaveToSupabase = async () => {
    if (previewData.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para guardar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Aplicar el esquema modificado a los datos
      const visibleColumns = columnSchema.filter(col => col.visible);
      const transformedData = previewData.map(row => {
        const newRow: any = {};
        visibleColumns.forEach(col => {
          newRow[col.name] = row[col.originalName];
        });
        return newRow;
      });

      // Guardar en la tabla 'dataset'
      const { error } = await supabase
        .from('dataset')
        .insert(transformedData);

      if (error) throw error;

      // Guardar en localStorage para compatibilidad con el flujo actual
      const processedData = {
        fileName: uploadedFile?.name,
        rows: transformedData.length,
        columns: visibleColumns.length,
        timestamp: new Date().toISOString(),
        allData: transformedData,
        headers: visibleColumns.map(col => col.name),
        schema: columnSchema,
      };

      localStorage.setItem('mlPipelineData', JSON.stringify(processedData));

      toast({
        title: "Datos guardados exitosamente",
        description: `${transformedData.length} registros guardados en Supabase`,
      });

      setTimeout(() => navigate('/clean-data'), 1000);
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div className="flex-1">
                      <p className="font-medium text-success">Archivo cargado exitosamente</p>
                      <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                    </div>
                  </div>
                )}

                {showPreview && previewData.length > 0 && (
                  <EditableDataGrid
                    data={previewData}
                    onSchemaChange={setColumnSchema}
                  />
                )}

                <div className="flex gap-3 pt-4">
                  {!showPreview ? (
                    <Button 
                      className="flex-1" 
                      onClick={handlePreview}
                      disabled={!uploadedFile}
                    >
                      Vista previa
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={handleSaveToSupabase}
                      disabled={isProcessing}
                    >
                      <Save className="w-4 h-4" />
                      {isProcessing ? "Guardando..." : "Guardar en Supabase y Continuar"}
                    </Button>
                  )}
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
