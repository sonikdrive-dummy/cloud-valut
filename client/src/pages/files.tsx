import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { FileGrid } from "@/components/file-grid";
import { UploadArea } from "@/components/upload-area";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Grid3X3, List, Plus, Upload, Copy, Move, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFileOperations } from "@/hooks/use-file-operations";
import type { File } from "@shared/schema";

export default function FilesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [currentParent, setCurrentParent] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<File | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<{id: string | null, name: string, path: string}[]>([{id: null, name: 'Home', path: '/'}]);
  const [showDropOverlay, setShowDropOverlay] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  
  const { toast } = useToast();
  const { createFolder, uploadFile } = useFileOperations();

  const { data: files = [], isLoading, error } = useQuery<File[]>({
    queryKey: ["/api/files", { parentId: currentParent }],
    queryFn: async () => {
      const parentParam = currentParent === null ? 'null' : currentParent;
      const response = await fetch(`/api/files?parentId=${parentParam}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      return response.json();
    },
  });


  const { data: searchResults = [] } = useQuery<File[]>({
    queryKey: ["/api/files/search", { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const filteredFiles = useMemo(() => {
    if (searchQuery.length > 0) {
      return searchResults;
    }
    return files;
  }, [files, searchResults, searchQuery]);

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
    if (file.type === "folder") {
      setCurrentParent(file.id);
      setCurrentFolder(file);
      setSelectedFiles(new Set());
      
      // Update breadcrumb path
      const newPath = [...breadcrumbPath, { id: file.id, name: file.name, path: file.path }];
      setBreadcrumbPath(newPath);
    } else {
      // TODO: Implement file preview/download
      toast({
        title: "File opened",
        description: `Opening ${file.name}`,
      });
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const targetBreadcrumb = breadcrumbPath[index];
    setCurrentParent(targetBreadcrumb.id);
    setCurrentFolder(targetBreadcrumb.id ? { id: targetBreadcrumb.id, name: targetBreadcrumb.name } as File : null);
    setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
    setSelectedFiles(new Set());
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;

    try {
      await createFolder.mutateAsync({
        name,
        parentId: currentParent,
        path: currentParent ? `/${name}` : `/${name}`,
      });
      toast({
        title: "Folder created",
        description: `Created folder "${name}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (fileList: FileList) => {
    const files = Array.from(fileList);
    
    for (const file of files) {
      try {
        await uploadFile.mutateAsync({
          name: file.name,
          mimeType: file.type,
          size: file.size,
          parentId: currentParent,
          path: currentParent ? `/${file.name}` : `/${file.name}`,
        });
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }

    toast({
      title: "Files uploaded",
      description: `Uploaded ${files.length} file(s)`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedFiles.size === 0) return;
    
    // TODO: Implement bulk operations
    toast({
      title: "Bulk action",
      description: `${action} ${selectedFiles.size} item(s)`,
    });
  };

  // Global drag and drop handlers
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer?.types?.includes('Files')) {
      setDragCounter(prev => prev + 1);
      setShowDropOverlay(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter <= 0) {
        setShowDropOverlay(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowDropOverlay(false);
    setDragCounter(0);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);


  return (
    <div className="min-h-screen bg-gradient-dark">
      <TopNavigation
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 md:ml-64 p-6 pt-24">
        {/* Toolbar */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbPath.map((crumb, index) => (
                  <BreadcrumbItem key={index}>
                    {index === breadcrumbPath.length - 1 ? (
                      <BreadcrumbPage className="text-foreground font-medium">
                        {crumb.name}
                      </BreadcrumbPage>
                    ) : (
                      <>
                        <Button 
                          variant="link" 
                          className="text-primary hover:text-primary/80 font-medium p-0"
                          onClick={() => handleBreadcrumbClick(index)}
                          data-testid={`breadcrumb-${crumb.name.toLowerCase()}`}
                        >
                          {crumb.name}
                        </Button>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-secondary rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleCreateFolder}
                disabled={createFolder.isPending}
                data-testid="button-new-folder"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Folder
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                      handleFileUpload(files);
                    }
                  };
                  input.click();
                }}
                data-testid="button-upload"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>

              {/* Bulk Actions */}
              {selectedFiles.size > 0 && (
                <div className="flex items-center space-x-2 pl-4 border-l border-border">
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.size} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBulkAction("copy")}
                    title="Copy"
                    data-testid="button-bulk-copy"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBulkAction("move")}
                    title="Move"
                    data-testid="button-bulk-move"
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBulkAction("delete")}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                    data-testid="button-bulk-delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drop Overlay - only shown when dragging files */}
        {showDropOverlay && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="glass rounded-xl p-12 text-center max-w-md mx-4">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-12 w-12 text-primary animate-bounce" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Drop your files here
              </h3>
              <p className="text-muted-foreground">
                Release to upload files to your storage
              </p>
            </div>
          </div>
        )}

        {/* Files Grid */}
        {isLoading ? (
          <div className="glass rounded-xl p-8 text-center" data-testid="loading-state">
            <div className="text-muted-foreground">Loading files...</div>
          </div>
        ) : (
          <FileGrid
            files={filteredFiles}
            viewMode={viewMode}
            selectedFiles={selectedFiles}
            onFileSelect={handleFileSelect}
            onFileOpen={handleFileOpen}
          />
        )}
      </main>
    </div>
  );
}
