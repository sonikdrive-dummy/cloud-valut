import { MoreHorizontal, Star, Share2, Trash2, FolderOpen, Download, Copy, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";
import type { File } from "@shared/schema";

interface FileItemProps {
  file: File;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onStar: () => void;
  onShare: () => void;
  onDelete: () => void;
  onOpen: () => void;
  viewMode: "grid" | "list";
}

export function FileItem({ 
  file, 
  isSelected, 
  onSelect, 
  onStar, 
  onShare, 
  onDelete, 
  onOpen,
  viewMode 
}: FileItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      onSelect(!isSelected);
    } else {
      onOpen();
    }
  };

  const timeAgo = formatDistanceToNow(new Date(file.updatedAt || new Date()), { addSuffix: true });

  if (viewMode === "list") {
    return (
      <div 
        className={`glass rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer group flex items-center space-x-4 ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
        onClick={handleClick}
        data-testid={`item-${file.type}-${file.id}`}
      >
        <div className="flex-shrink-0">
          {file.type === "folder" ? (
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-blue-400" />
            </div>
          ) : file.thumbnail ? (
            <img 
              src={file.thumbnail} 
              alt={file.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
              {(() => {
                const { icon: Icon, className } = getFileIcon(file.mimeType || "", "h-5 w-5 text-gray-400");
                return <Icon className={className} />;
              })()}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate" data-testid={`text-filename-${file.id}`}>
            {file.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {file.type === "folder" 
              ? `${file.metadata?.fileCount || 0} files`
              : formatFileSize(file.size)
            }
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span data-testid={`text-modified-${file.id}`}>{timeAgo}</span>
          <div className="flex items-center space-x-1">
            {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            {file.isShared && <Share2 className="h-4 w-4 text-blue-500" />}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 hover:bg-white/10"
                data-testid={`button-menu-${file.id}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpen} data-testid={`menu-open-${file.id}`}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Open
              </DropdownMenuItem>
              {file.type === "file" && (
                <DropdownMenuItem data-testid={`menu-download-${file.id}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onStar} data-testid={`menu-star-${file.id}`}>
                <Star className="h-4 w-4 mr-2" />
                {file.isStarred ? "Unstar" : "Star"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare} data-testid={`menu-share-${file.id}`}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid={`menu-copy-${file.id}`}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem data-testid={`menu-move-${file.id}`}>
                <Move className="h-4 w-4 mr-2" />
                Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive focus:text-destructive"
                data-testid={`menu-delete-${file.id}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`glass rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer group ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={handleClick}
      data-testid={`item-${file.type}-${file.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
          {file.type === "folder" ? (
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-blue-400" />
            </div>
          ) : file.thumbnail ? (
            <img 
              src={file.thumbnail} 
              alt={file.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
              {(() => {
                const { icon: Icon, className } = getFileIcon(file.mimeType || "", "h-6 w-6 text-gray-400");
                return <Icon className={className} />;
              })()}
            </div>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 hover:bg-white/10"
                data-testid={`button-menu-${file.id}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpen} data-testid={`menu-open-${file.id}`}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Open
              </DropdownMenuItem>
              {file.type === "file" && (
                <DropdownMenuItem data-testid={`menu-download-${file.id}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onStar} data-testid={`menu-star-${file.id}`}>
                <Star className="h-4 w-4 mr-2" />
                {file.isStarred ? "Unstar" : "Star"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare} data-testid={`menu-share-${file.id}`}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid={`menu-copy-${file.id}`}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem data-testid={`menu-move-${file.id}`}>
                <Move className="h-4 w-4 mr-2" />
                Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive focus:text-destructive"
                data-testid={`menu-delete-${file.id}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-foreground truncate" data-testid={`text-filename-${file.id}`}>
          {file.name}
        </h4>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span data-testid={`text-size-${file.id}`}>
            {file.type === "folder" 
              ? `${file.metadata?.fileCount || 0} files`
              : formatFileSize(file.size)
            }
          </span>
          <div className="flex items-center space-x-1">
            {file.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            {file.isShared && <Share2 className="h-3 w-3 text-blue-500" />}
          </div>
        </div>
        <div className="text-xs text-muted-foreground" data-testid={`text-modified-${file.id}`}>
          {timeAgo}
        </div>
      </div>
    </div>
  );
}
