import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadAreaProps {
  onFileSelect: (files: FileList) => void;
}

export function UploadArea({ onFileSelect }: UploadAreaProps) {
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  }, [onFileSelect]);

  const handleBrowseClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileSelect(files);
      }
    };
    input.click();
  };

  return (
    <div 
      className="upload-area glass rounded-xl p-8 mb-6 text-center transition-all duration-300 hover:border-primary hover:bg-primary/5"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid="upload-area"
    >
      <div className="space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <CloudUpload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drag & drop files here
          </h3>
          <p className="text-muted-foreground">
            or click to browse your files
          </p>
        </div>
        <Button 
          onClick={handleBrowseClick}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          data-testid="button-browse-files"
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
}
