import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File as FileIcon,
  FileSpreadsheet,
  FileBarChart,
  Code,
  FileCode,
  LucideIcon,
} from "lucide-react";

export function getFileIcon(mimeType: string, className?: string): { icon: LucideIcon; className: string } {
  const iconClass = className || "h-5 w-5";
  
  if (mimeType.startsWith("image/")) {
    return { icon: Image, className: iconClass };
  }
  
  if (mimeType.startsWith("video/")) {
    return { icon: Video, className: iconClass };
  }
  
  if (mimeType.startsWith("audio/")) {
    return { icon: Music, className: iconClass };
  }
  
  if (mimeType.includes("pdf")) {
    return { icon: FileText, className: `${iconClass} text-red-500` };
  }
  
  if (mimeType.includes("word") || mimeType.includes("document")) {
    return { icon: FileText, className: `${iconClass} text-blue-500` };
  }
  
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
    return { icon: FileSpreadsheet, className: `${iconClass} text-green-500` };
  }
  
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) {
    return { icon: FileBarChart, className: `${iconClass} text-orange-500` };
  }
  
  if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("compressed")) {
    return { icon: Archive, className: iconClass };
  }
  
  if (mimeType.includes("javascript") || mimeType.includes("typescript") || 
      mimeType.includes("json") || mimeType.includes("xml") || 
      mimeType.includes("html") || mimeType.includes("css")) {
    return { icon: FileCode, className: `${iconClass} text-purple-500` };
  }
  
  return { icon: FileIcon, className: iconClass };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileTypeColor(mimeType: string): string {
  if (mimeType.includes("pdf")) return "text-red-500";
  if (mimeType.includes("word") || mimeType.includes("document")) return "text-blue-500";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "text-green-500";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "text-orange-500";
  if (mimeType.startsWith("image/")) return "text-purple-500";
  if (mimeType.startsWith("video/")) return "text-pink-500";
  if (mimeType.startsWith("audio/")) return "text-cyan-500";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "text-yellow-500";
  if (mimeType.includes("javascript") || mimeType.includes("typescript") || mimeType.includes("code")) return "text-indigo-500";
  
  return "text-gray-500";
}
