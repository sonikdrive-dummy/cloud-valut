import { FileItem } from "./file-item";
import { useFileOperations } from "@/hooks/use-file-operations";
import type { File } from "@shared/schema";

interface FileGridProps {
  files: File[];
  viewMode: "grid" | "list";
  selectedFiles: Set<string>;
  onFileSelect: (fileId: string, selected: boolean) => void;
  onFileOpen: (file: File) => void;
}

export function FileGrid({ files, viewMode, selectedFiles, onFileSelect, onFileOpen }: FileGridProps) {
  const { starFile, deleteFile } = useFileOperations();

  const handleStar = async (file: File) => {
    try {
      await starFile.mutateAsync({
        fileId: file.id,
        starred: !file.isStarred
      });
    } catch (error) {
      console.error("Failed to star file:", error);
    }
  };

  const handleShare = (file: File) => {
    // TODO: Implement sharing functionality
    console.log("Share file:", file.name);
  };

  const handleDelete = async (file: File) => {
    try {
      await deleteFile.mutateAsync(file.id);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  if (files.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center" data-testid="empty-state">
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-folder-open text-2xl text-muted-foreground"></i>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No files found</h3>
        <p className="text-muted-foreground">
          This folder is empty. Upload some files or create a new folder to get started.
        </p>
      </div>
    );
  }

  const containerClass = viewMode === "grid" ? "file-grid" : "space-y-2";

  return (
    <div className={containerClass} data-testid="file-grid">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          isSelected={selectedFiles.has(file.id)}
          onSelect={(selected) => onFileSelect(file.id, selected)}
          onStar={() => handleStar(file)}
          onShare={() => handleShare(file)}
          onDelete={() => handleDelete(file)}
          onOpen={() => onFileOpen(file)}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
