import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Check, X, Type } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ColumnSchema {
  name: string;
  originalName: string;
  type: 'text' | 'number' | 'boolean' | 'date';
  visible: boolean;
}

interface EditableDataGridProps {
  data: any[];
  onSchemaChange?: (schema: ColumnSchema[]) => void;
  onDataChange?: (data: any[]) => void;
}

const EditableDataGrid = ({ data, onSchemaChange, onDataChange }: EditableDataGridProps) => {
  const [columns, setColumns] = useState<ColumnSchema[]>(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map(key => ({
      name: key,
      originalName: key,
      type: detectType(data[0][key]),
      visible: true
    }));
  });
  
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function detectType(value: any): 'text' | 'number' | 'boolean' | 'date' {
    if (value === null || value === '') return 'text';
    if (!isNaN(Number(value))) return 'number';
    if (value === 'true' || value === 'false') return 'boolean';
    if (!isNaN(Date.parse(value))) return 'date';
    return 'text';
  }

  const handleRenameColumn = (originalName: string, newName: string) => {
    const updatedColumns = columns.map(col =>
      col.originalName === originalName ? { ...col, name: newName } : col
    );
    setColumns(updatedColumns);
    onSchemaChange?.(updatedColumns);
    setEditingColumn(null);
  };

  const handleDeleteColumn = (originalName: string) => {
    const updatedColumns = columns.map(col =>
      col.originalName === originalName ? { ...col, visible: false } : col
    );
    setColumns(updatedColumns);
    onSchemaChange?.(updatedColumns);
  };

  const handleTypeChange = (originalName: string, type: 'text' | 'number' | 'boolean' | 'date') => {
    const updatedColumns = columns.map(col =>
      col.originalName === originalName ? { ...col, type } : col
    );
    setColumns(updatedColumns);
    onSchemaChange?.(updatedColumns);
  };

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <Card className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 border-b border-border">
        <h4 className="font-semibold text-sm">Vista previa editable ({data.length} registros)</h4>
      </div>

      <ScrollArea className="h-[500px] w-full">
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 sticky top-0 z-20">
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={col.originalName}
                    className="px-4 py-3 text-left font-medium border-b border-border bg-muted/30 whitespace-nowrap"
                  >
                    <div className="space-y-2">
                      {editingColumn === col.originalName ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-7 text-xs"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRenameColumn(col.originalName, editValue)}
                          >
                            <Check className="h-3 w-3 text-success" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => setEditingColumn(null)}
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{col.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setEditingColumn(col.originalName);
                              setEditValue(col.name);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDeleteColumn(col.originalName)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Type className="h-3 w-3 text-muted-foreground" />
                        <Select
                          value={col.type}
                          onValueChange={(value: any) => handleTypeChange(col.originalName, value)}
                        >
                          <SelectTrigger className="h-6 text-xs w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="boolean">Booleano</SelectItem>
                            <SelectItem value="date">Fecha</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/20">
                  {visibleColumns.map((col) => (
                    <td key={col.originalName} className="px-4 py-2 whitespace-nowrap">
                      {row[col.originalName] === null || row[col.originalName] === '' ? (
                        <Badge variant="outline" className="text-warning border-warning/50">
                          null
                        </Badge>
                      ) : (
                        <span>{row[col.originalName]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};

export default EditableDataGrid;
