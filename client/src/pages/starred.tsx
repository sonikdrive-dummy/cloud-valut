import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { FileGrid } from "@/components/file-grid";
import type { File } from "@shared/schema";

export default function StarredPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const { data: files = [], isLoading } = useQuery<File[]>({
    queryKey: ["/api/files/starred"],
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
    // TODO: Implement file preview/download
    console.log("Opening file:", file.name);
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
            Starred Files
          </h2>
          <p className="text-muted-foreground">
            Your favorite files and folders
          </p>
        </div>

        {isLoading ? (
          <div className="glass rounded-xl p-8 text-center" data-testid="loading-state">
            <div className="text-muted-foreground">Loading starred files...</div>
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
