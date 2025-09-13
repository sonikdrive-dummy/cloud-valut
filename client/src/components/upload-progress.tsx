import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, FileText, Image, Video, Music, Archive, CheckCircle, AlertCircle } from "lucide-react";

interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error";
  type: "document" | "image" | "video" | "audio" | "archive" | "other";
}

export function UploadProgress() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Demo upload data - simulate active uploads
  useEffect(() => {
    // Simulate some uploads in progress
    const demoUploads: UploadItem[] = [
      {
        id: "1",
        name: "Presentation.pptx",
        size: 2.5 * 1024 * 1024, // 2.5MB
        progress: 45,
        status: "uploading",
        type: "document"
      },
      {
        id: "2", 
        name: "vacation-photos.zip",
        size: 15.8 * 1024 * 1024, // 15.8MB
        progress: 78,
        status: "uploading",
        type: "archive"
      }
    ];

    setUploads(demoUploads);
    setIsVisible(true);

    // Simulate progress updates
    const interval = setInterval(() => {
      setUploads(prevUploads => 
        prevUploads.map(upload => {
          if (upload.status === "uploading" && upload.progress < 100) {
            const newProgress = Math.min(upload.progress + Math.random() * 15, 100);
            return {
              ...upload,
              progress: newProgress,
              status: newProgress >= 100 ? "completed" : "uploading"
            };
          }
          return upload;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "archive":
        return Archive;
      default:
        return FileText;
    }
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status !== "completed"));
  };

  const activeUploads = uploads.filter(upload => upload.status === "uploading");
  const completedUploads = uploads.filter(upload => upload.status === "completed");

  if (!isVisible || uploads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80" data-testid="upload-progress-container">
      <Card className="glass border-white/20 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              {activeUploads.length > 0 ? "Uploading files..." : "Upload complete"}
            </h3>
            <div className="flex items-center space-x-2">
              {completedUploads.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompleted}
                  className="h-6 px-2 text-xs"
                  data-testid="button-clear-completed"
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
                data-testid="button-close-upload-progress"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploads.map((upload) => {
              const IconComponent = getFileIcon(upload.type);
              return (
                <div key={upload.id} className="space-y-2" data-testid={`upload-item-${upload.id}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate" data-testid={`upload-name-${upload.id}`}>
                          {upload.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {upload.status === "completed" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {upload.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUpload(upload.id)}
                            className="h-4 w-4 p-0"
                            data-testid={`button-remove-upload-${upload.id}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span data-testid={`upload-size-${upload.id}`}>{formatFileSize(upload.size)}</span>
                        <span data-testid={`upload-progress-${upload.id}`}>
                          {upload.status === "completed" ? "Complete" : `${Math.round(upload.progress)}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {upload.status === "uploading" && (
                    <Progress 
                      value={upload.progress} 
                      className="h-1.5"
                      data-testid={`upload-progress-bar-${upload.id}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {activeUploads.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{activeUploads.length} file(s) uploading</span>
                <span>
                  {Math.round(
                    activeUploads.reduce((acc, upload) => acc + upload.progress, 0) / activeUploads.length
                  )}% overall
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}