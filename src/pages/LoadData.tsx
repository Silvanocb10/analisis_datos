import { useState } from "react";
import { Upload, Database, FileText, ArrowLeft, CheckCircle, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const LoadData = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [allPreviewData, setAllPreviewData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      
      // Parse all data rows for search functionality
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || null;
        });
        return row;
      });
      
      setAllPreviewData(rows);
      setPreviewData(rows.slice(0, 50)); // Show first 50 rows initially
      setSearchQuery("");
      
      toast({
        title: "Vista previa generada",
        description: `Cargados ${rows.length} registros`,
      });
    };
    
    reader.readAsText(uploadedFile);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setPreviewData(allPreviewData.slice(0, 50));
      return;
    }

    const filtered = allPreviewData.filter(row => {
      return Object.values(row).some(value => 
        value !== null && 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setPreviewData(filtered);
    
    toast({
      title: "Búsqueda completada",
      description: `${filtered.length} coincidencias encontradas`,
    });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setIsProcessing(false);
        return;
      }
      
      // Parse CSV
      const headers = lines[0].split(',').map(h => h.trim());
      const allRows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          const value = values[index] || null;
          row[header] = value;
        });
        return row;
      });
      
      // Calculate statistics
      let nullValues = 0;
      let duplicates = 0;
      
      allRows.forEach(row => {
        Object.values(row).forEach(value => {
          if (value === null || value === '') nullValues++;
        });
      });
      
      // Detect duplicates (simple check on first column)
      const seen = new Set();
      allRows.forEach(row => {
        const key = JSON.stringify(row);
        if (seen.has(key)) duplicates++;
        seen.add(key);
      });
      
      const processedData = {
        fileName: uploadedFile.name,
        rows: allRows.length,
        columns: headers.length,
        nullValues,
        duplicates,
        timestamp: new Date().toISOString(),
        sampleRows: allRows.slice(0, 10),
        allData: allRows,
        headers: headers,
      };
      
      localStorage.setItem('mlPipelineData', JSON.stringify(processedData));
      
      toast({
        title: "Datos procesados exitosamente",
        description: `${processedData.rows} filas y ${processedData.columns} columnas cargadas`,
      });
      
      setIsProcessing(false);
      
      setTimeout(() => navigate('/clean-data'), 1000);
    };
    
    reader.readAsText(uploadedFile);
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

                {previewData.length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 border-b border-border">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-semibold text-sm">Vista previa de datos ({previewData.length} registros)</h4>
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar en los datos..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyPress={handleSearchKeyPress}
                              className="pl-9"
                            />
                          </div>
                          <Button size="sm" onClick={handleSearch}>
                            Buscar
                          </Button>
                        </div>
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/30 sticky top-0 z-10">
                            <tr>
                              {Object.keys(previewData[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left font-medium text-muted-foreground border-b border-border bg-muted/30">
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
                    </ScrollArea>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1" 
                    onClick={handleProcessData}
                    disabled={!uploadedFile || isProcessing}
                  >
                    {isProcessing ? "Procesando..." : "Procesar datos"}
                  </Button>
                  <Button variant="outline" disabled={!uploadedFile} onClick={handlePreview}>Vista previa</Button>
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
