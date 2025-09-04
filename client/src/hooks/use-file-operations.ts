import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertFile } from "@shared/schema";

export function useFileOperations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createFolder = useMutation({
    mutationFn: async (folderData: {
      name: string;
      parentId: string | null;
      path: string;
    }) => {
      const response = await apiRequest("POST", "/api/folders", folderData);
      return response.json();
    },
    onSuccess: (newFolder) => {
      // Invalidate the files query to refresh the file list
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "Folder created",
        description: `Created folder "${newFolder.name}"`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadFile = useMutation({
    mutationFn: async (fileData: {
      name: string;
      mimeType: string;
      size: number;
      parentId: string | null;
      path: string;
    }) => {
      const response = await apiRequest("POST", "/api/files", fileData);
      return response.json();
    },
    onSuccess: (newFile) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] }); // For storage usage update
      
      toast({
        title: "File uploaded",
        description: `Uploaded "${newFile.name}"`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const starFile = useMutation({
    mutationFn: async ({ fileId, starred }: { fileId: string; starred: boolean }) => {
      const response = await apiRequest("PATCH", `/api/files/${fileId}`, {
        isStarred: starred,
      });
      return response.json();
    },
    onSuccess: (updatedFile, variables) => {
      // Invalidate all file-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/starred"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/shared"] });
      
      toast({
        title: variables.starred ? "File starred" : "File unstarred",
        description: `${updatedFile.name} ${variables.starred ? "added to" : "removed from"} starred files`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await apiRequest("DELETE", `/api/files/${fileId}`);
      return response.json();
    },
    onSuccess: (deletedFile) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/starred"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/shared"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
      
      toast({
        title: "File moved to trash",
        description: `"${deletedFile.name}" has been moved to trash`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const restoreFile = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await apiRequest("PATCH", `/api/files/${fileId}`, {
        isDeleted: false,
      });
      return response.json();
    },
    onSuccess: (restoredFile) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
      
      toast({
        title: "File restored",
        description: `"${restoredFile.name}" has been restored from trash`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restore file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const permanentlyDeleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await apiRequest("DELETE", `/api/files/${fileId}?permanent=true`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate trash query
      queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
      
      toast({
        title: "File permanently deleted",
        description: "File has been permanently deleted and cannot be recovered",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to permanently delete file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const renameFile = useMutation({
    mutationFn: async ({ fileId, newName }: { fileId: string; newName: string }) => {
      const response = await apiRequest("PATCH", `/api/files/${fileId}`, {
        name: newName,
      });
      return response.json();
    },
    onSuccess: (updatedFile) => {
      // Invalidate all file-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/starred"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/shared"] });
      
      toast({
        title: "File renamed",
        description: `File renamed to "${updatedFile.name}"`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to rename file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const moveFile = useMutation({
    mutationFn: async ({ fileId, targetParentId, newPath }: { 
      fileId: string; 
      targetParentId: string | null; 
      newPath: string;
    }) => {
      const response = await apiRequest("PATCH", `/api/files/${fileId}`, {
        parentId: targetParentId,
        path: newPath,
      });
      return response.json();
    },
    onSuccess: (movedFile) => {
      // Invalidate all file-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      
      toast({
        title: "File moved",
        description: `"${movedFile.name}" has been moved successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to move file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const shareFile = useMutation({
    mutationFn: async ({ fileId, shared }: { fileId: string; shared: boolean }) => {
      const response = await apiRequest("PATCH", `/api/files/${fileId}`, {
        isShared: shared,
      });
      return response.json();
    },
    onSuccess: (updatedFile, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/shared"] });
      
      toast({
        title: variables.shared ? "File shared" : "File unshared",
        description: `"${updatedFile.name}" ${variables.shared ? "is now shared" : "is no longer shared"}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update sharing settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bulkOperation = useMutation({
    mutationFn: async ({ 
      action, 
      fileIds, 
      targetParentId 
    }: { 
      action: "delete" | "restore" | "star" | "unstar" | "move" | "copy";
      fileIds: string[];
      targetParentId?: string | null;
    }) => {
      const response = await apiRequest("POST", "/api/files/bulk", {
        action,
        fileIds,
        targetParentId,
      });
      return response.json();
    },
    onSuccess: (results, variables) => {
      // Invalidate all relevant queries based on action
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      
      switch (variables.action) {
        case "delete":
          queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
          break;
        case "restore":
          queryClient.invalidateQueries({ queryKey: ["/api/files/trash"] });
          break;
        case "star":
        case "unstar":
          queryClient.invalidateQueries({ queryKey: ["/api/files/starred"] });
          break;
        case "move":
        case "copy":
          // Refresh all file views
          queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
          break;
      }
      
      toast({
        title: "Bulk operation completed",
        description: `Successfully ${variables.action}d ${variables.fileIds.length} item(s)`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete bulk operation. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    createFolder,
    uploadFile,
    starFile,
    deleteFile,
    restoreFile,
    permanentlyDeleteFile,
    renameFile,
    moveFile,
    shareFile,
    bulkOperation,
  };
}
