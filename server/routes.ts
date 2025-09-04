import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFileSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (demo user for now)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("demo-user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get files by parent (folder contents or root files)
  app.get("/api/files", async (req, res) => {
    try {
      const { parentId } = req.query;
      const parent = parentId === "null" || !parentId ? null : parentId as string;
      
      const files = await storage.getFilesByParent(parent, "demo-user-1");
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get files" });
    }
  });

  // Get recent files
  app.get("/api/files/recent", async (req, res) => {
    try {
      const files = await storage.getRecentFiles("demo-user-1");
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent files" });
    }
  });

  // Get starred files
  app.get("/api/files/starred", async (req, res) => {
    try {
      const files = await storage.getStarredFiles("demo-user-1");
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get starred files" });
    }
  });

  // Get shared files
  app.get("/api/files/shared", async (req, res) => {
    try {
      const files = await storage.getSharedFiles("demo-user-1");
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shared files" });
    }
  });

  // Get deleted files (trash)
  app.get("/api/files/trash", async (req, res) => {
    try {
      const files = await storage.getDeletedFiles("demo-user-1");
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get deleted files" });
    }
  });

  // Search files
  app.get("/api/files/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const files = await storage.searchFiles("demo-user-1", q);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to search files" });
    }
  });

  // Create folder
  app.post("/api/folders", async (req, res) => {
    try {
      const folderData = {
        ...req.body,
        type: "folder",
        mimeType: null,
        size: 0,
        ownerId: "demo-user-1",
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: { fileCount: 0 }
      };
      
      const result = insertFileSchema.safeParse(folderData);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid folder data", errors: result.error.errors });
      }
      
      const folder = await storage.createFile(result.data);
      res.status(201).json(folder);
    } catch (error) {
      res.status(500).json({ message: "Failed to create folder" });
    }
  });

  // Create file (upload simulation)
  app.post("/api/files", async (req, res) => {
    try {
      const fileData = {
        ...req.body,
        type: "file",
        ownerId: "demo-user-1",
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {}
      };
      
      const result = insertFileSchema.safeParse(fileData);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid file data", errors: result.error.errors });
      }
      
      const file = await storage.createFile(result.data);
      res.status(201).json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to create file" });
    }
  });

  // Update file/folder
  app.patch("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const file = await storage.updateFile(id, updates);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to update file" });
    }
  });

  // Delete file/folder (move to trash)
  app.delete("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { permanent } = req.query;
      
      if (permanent === "true") {
        const success = await storage.deleteFile(id);
        if (!success) {
          return res.status(404).json({ message: "File not found" });
        }
        res.json({ message: "File permanently deleted" });
      } else {
        const file = await storage.updateFile(id, { isDeleted: true });
        if (!file) {
          return res.status(404).json({ message: "File not found" });
        }
        res.json(file);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Bulk operations
  app.post("/api/files/bulk", async (req, res) => {
    try {
      const { action, fileIds, targetParentId } = req.body;
      
      if (!action || !fileIds || !Array.isArray(fileIds)) {
        return res.status(400).json({ message: "Invalid bulk operation data" });
      }
      
      const results = [];
      
      for (const fileId of fileIds) {
        let result;
        switch (action) {
          case "delete":
            result = await storage.updateFile(fileId, { isDeleted: true });
            break;
          case "restore":
            result = await storage.updateFile(fileId, { isDeleted: false });
            break;
          case "star":
            result = await storage.updateFile(fileId, { isStarred: true });
            break;
          case "unstar":
            result = await storage.updateFile(fileId, { isStarred: false });
            break;
          case "move":
            if (targetParentId !== undefined) {
              result = await storage.updateFile(fileId, { parentId: targetParentId });
            }
            break;
          default:
            continue;
        }
        if (result) {
          results.push(result);
        }
      }
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform bulk operation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
