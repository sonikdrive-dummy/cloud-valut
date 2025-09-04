import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { FileGrid } from "@/components/file-grid";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { File } from "@shared/schema";

export default function TrashPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery<File[]>({
    queryKey: ["/api/files/trash"],
  });

  const restoreFiles = useMutation({
    mutationFn: async (fileIds: string[]) => {
      const response = await apiRequest("POST", "/api/files/bulk", {
        action: "restore",
        fileIds,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
      setSelectedFiles(new Set());
      toast({
        title: "Files restored",
        description: "The selected files have been restored from trash.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restore files. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteFilesPermanently = useMutation({
    mutationFn: async (fileIds: string[]) => {
      const promises = fileIds.map(id => 
        apiRequest("DELETE", `/api/files/${id}?permanent=true`)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
      setSelectedFiles(new Set());
      toast({
        title: "Files deleted",
        description: "The selected files have been permanently deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete files permanently. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (fileId: string, selected: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (selected) {
      newSelected.add(fileId);
    } else {
      newSelected.delete(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleFileOpen = (file: File) => {
    // Files in trash cannot be opened
    toast({
      title: "File in trash",
      description: "Restore the file to open it.",
      variant: "destructive",
    });
  };

  const handleRestore = () => {
    if (selectedFiles.size === 0) return;
    restoreFiles.mutate(Array.from(selectedFiles));
  };

  const handleDeletePermanently = () => {
    if (selectedFiles.size === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${selectedFiles.size} file(s)? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      deleteFilesPermanently.mutate(Array.from(selectedFiles));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <TopNavigation
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Trash
          </h2>
          <p className="text-muted-foreground">
            Files that have been deleted. They will be permanently removed after 30 days.
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.size > 0 && (
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedFiles.size} item(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRestore}
                  disabled={restoreFiles.isPending}
                  data-testid="button-restore-selected"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeletePermanently}
                  disabled={deleteFilesPermanently.isPending}
                  data-testid="button-delete-permanently"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Forever
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="glass rounded-xl p-8 text-center" data-testid="loading-state">
            <div className="text-muted-foreground">Loading trash...</div>
          </div>
        ) : files.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center" data-testid="empty-state">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Trash is empty</h3>
            <p className="text-muted-foreground">
              No files in trash. Deleted files will appear here.
            </p>
          </div>
        ) : (
          <FileGrid
            files={files}
            viewMode="grid"
            selectedFiles={selectedFiles}
            onFileSelect={handleFileSelect}
            onFileOpen={handleFileOpen}
          />
        )}
      </main>
    </div>
  );
}
