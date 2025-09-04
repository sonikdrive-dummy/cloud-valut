import { type User, type InsertUser, type File, type InsertFile, type Share, type InsertShare, type Activity, type InsertActivity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // File methods
  getFile(id: string): Promise<File | undefined>;
  getFilesByParent(parentId: string | null, ownerId: string): Promise<File[]>;
  getRecentFiles(ownerId: string, limit?: number): Promise<File[]>;
  getStarredFiles(ownerId: string): Promise<File[]>;
  getSharedFiles(userId: string): Promise<File[]>;
  getDeletedFiles(ownerId: string): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, updates: Partial<File>): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  searchFiles(ownerId: string, query: string): Promise<File[]>;

  // Share methods
  getShare(id: string): Promise<Share | undefined>;
  getFileShares(fileId: string): Promise<Share[]>;
  createShare(share: InsertShare): Promise<Share>;
  deleteShare(id: string): Promise<boolean>;

  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private files: Map<string, File>;
  private shares: Map<string, Share>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.shares = new Map();
    this.activities = new Map();

    // Initialize with demo user and files
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user-1",
      username: "sarah.johnson",
      email: "sarah.johnson@company.com",
      firstName: "Sarah",
      lastName: "Johnson",
      jobTitle: "Senior Marketing Manager",
      avatar: "https://pixabay.com/get/gd156c6bf101554ad4843adef61c41f30a6bf07d02066747b4690bcb8f6fc58056be6f6881f001a724ea57dff1f9476ecd659b16204239e0c7bff898ea22abf71_1280.jpg",
      plan: "pro",
      storageUsed: 2577891328, // 2.4 GB
      storageLimit: 5368709120, // 5 GB
      preferences: {
        theme: "light",
        emailNotifications: true,
        desktopNotifications: false
      },
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo folders
    const folders: File[] = [
      {
        id: "folder-1",
        name: "Marketing Campaign",
        type: "folder",
        mimeType: null,
        size: 0,
        path: "/Marketing Campaign",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: { fileCount: 24 },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "folder-2",
        name: "Financial Reports",
        type: "folder",
        mimeType: null,
        size: 0,
        path: "/Financial Reports",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: true,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: { fileCount: 12 },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "folder-3",
        name: "Design Assets",
        type: "folder",
        mimeType: null,
        size: 0,
        path: "/Design Assets",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: false,
        isShared: true,
        isDeleted: false,
        thumbnail: null,
        metadata: { fileCount: 156 },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "folder-4",
        name: "Project Documents",
        type: "folder",
        mimeType: null,
        size: 0,
        path: "/Project Documents",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: { fileCount: 8 },
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "folder-5",
        name: "Client Files",
        type: "folder",
        mimeType: null,
        size: 0,
        path: "/Client Files",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: true,
        isShared: true,
        isDeleted: false,
        thumbnail: null,
        metadata: { fileCount: 42 },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ];

    // Create demo files
    const files: File[] = [
      {
        id: "file-1",
        name: "Q4_Report.pdf",
        type: "file",
        mimeType: "application/pdf",
        size: 2516582, // 2.4 MB
        path: "/Financial Reports/Q4_Report.pdf",
        parentId: "folder-2",
        ownerId: demoUser.id,
        isStarred: true,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "file-2",
        name: "Proposal_Draft.docx",
        type: "file",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 913408, // 892 KB
        path: "/Marketing Campaign/Proposal_Draft.docx",
        parentId: "folder-1",
        ownerId: demoUser.id,
        isStarred: false,
        isShared: true,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "file-3",
        name: "Budget_2024.xlsx",
        type: "file",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1258291, // 1.2 MB
        path: "/Financial Reports/Budget_2024.xlsx",
        parentId: "folder-2",
        ownerId: demoUser.id,
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "file-4",
        name: "Office_Setup.jpg",
        type: "file",
        mimeType: "image/jpeg",
        size: 3879731, // 3.7 MB
        path: "/Design Assets/Office_Setup.jpg",
        parentId: "folder-3",
        ownerId: demoUser.id,
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=48&h=48",
        metadata: {},
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "file-5",
        name: "Presentation.pptx",
        type: "file",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        size: 6081741, // 5.8 MB
        path: "/Marketing Campaign/Presentation.pptx",
        parentId: "folder-1",
        ownerId: demoUser.id,
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      // Root level files
      {
        id: "file-6",
        name: "Meeting_Notes.md",
        type: "file",
        mimeType: "text/markdown",
        size: 2847, // 2.8 KB
        path: "/Meeting_Notes.md",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: true,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        id: "file-7",
        name: "Team_Photo.jpg",
        type: "file",
        mimeType: "image/jpeg",
        size: 5421896, // 5.2 MB
        path: "/Team_Photo.jpg",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: false,
        isShared: true,
        isDeleted: false,
        thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
        metadata: {},
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        id: "file-8",
        name: "Company_Logo.svg",
        type: "file",
        mimeType: "image/svg+xml",
        size: 18743, // 18 KB
        path: "/Company_Logo.svg",
        parentId: null,
        ownerId: demoUser.id,
        isStarred: true,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      // Additional files in folders
      {
        id: "file-9",
        name: "Contract_Template.docx",
        type: "file",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1456789, // 1.4 MB
        path: "/Project Documents/Contract_Template.docx",
        parentId: "folder-4",
        ownerId: demoUser.id,
        isStarred: false,
        isShared: false,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "file-10",
        name: "Brand_Guidelines.pdf",
        type: "file",
        mimeType: "application/pdf",
        size: 8923456, // 8.5 MB
        path: "/Design Assets/Brand_Guidelines.pdf",
        parentId: "folder-3",
        ownerId: demoUser.id,
        isStarred: false,
        isShared: true,
        isDeleted: false,
        thumbnail: null,
        metadata: {},
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      }
    ];

    [...folders, ...files].forEach(file => {
      this.files.set(file.id, file);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      jobTitle: insertUser.jobTitle || null,
      avatar: insertUser.avatar || null,
      plan: insertUser.plan || "free",
      storageUsed: insertUser.storageUsed || 0,
      storageLimit: insertUser.storageLimit || 5368709120,
      preferences: insertUser.preferences || { theme: "light", emailNotifications: true, desktopNotifications: false },
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // File methods
  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByParent(parentId: string | null, ownerId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      file => file.parentId === parentId && file.ownerId === ownerId && !file.isDeleted
    );
  }

  async getRecentFiles(ownerId: string, limit = 10): Promise<File[]> {
    return Array.from(this.files.values())
      .filter(file => file.ownerId === ownerId && !file.isDeleted)
      .sort((a, b) => new Date(b.updatedAt || new Date()).getTime() - new Date(a.updatedAt || new Date()).getTime())
      .slice(0, limit);
  }

  async getStarredFiles(ownerId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      file => file.ownerId === ownerId && file.isStarred && !file.isDeleted
    );
  }

  async getSharedFiles(userId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      file => file.ownerId === userId && file.isShared && !file.isDeleted
    );
  }

  async getDeletedFiles(ownerId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      file => file.ownerId === ownerId && file.isDeleted
    );
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      ...insertFile,
      id,
      size: insertFile.size || 0,
      mimeType: insertFile.mimeType || null,
      parentId: insertFile.parentId || null,
      isStarred: insertFile.isStarred || false,
      isShared: insertFile.isShared || false,
      isDeleted: insertFile.isDeleted || false,
      thumbnail: insertFile.thumbnail || null,
      metadata: insertFile.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, updates: Partial<File>): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, ...updates, updatedAt: new Date() };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  async searchFiles(ownerId: string, query: string): Promise<File[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.files.values()).filter(
      file => 
        file.ownerId === ownerId && 
        !file.isDeleted &&
        file.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Share methods
  async getShare(id: string): Promise<Share | undefined> {
    return this.shares.get(id);
  }

  async getFileShares(fileId: string): Promise<Share[]> {
    return Array.from(this.shares.values()).filter(share => share.fileId === fileId);
  }

  async createShare(insertShare: InsertShare): Promise<Share> {
    const id = randomUUID();
    const share: Share = {
      ...insertShare,
      id,
      sharedWith: insertShare.sharedWith || null,
      permissions: insertShare.permissions || "read",
      expiresAt: insertShare.expiresAt || null,
      createdAt: new Date(),
    };
    this.shares.set(id, share);
    return share;
  }

  async deleteShare(id: string): Promise<boolean> {
    return this.shares.delete(id);
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      fileId: insertActivity.fileId || null,
      details: insertActivity.details || {},
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getUserActivities(userId: string, limit = 50): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
