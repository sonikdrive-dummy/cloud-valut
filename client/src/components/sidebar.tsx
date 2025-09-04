import { Folder, Clock, Share2, Star, Trash2, CreditCard, User as UserIcon, Settings, Cloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const storagePercentage = user ? ((user.storageUsed || 0) / (user.storageLimit || 1)) * 100 : 0;

  const navigationItems = [
    { href: "/files", icon: Folder, label: "My Files", testId: "link-files" },
    { href: "/recent", icon: Clock, label: "Recent", testId: "link-recent" },
    { href: "/shared", icon: Share2, label: "Shared", testId: "link-shared" },
    { href: "/starred", icon: Star, label: "Starred", testId: "link-starred" },
    { href: "/trash", icon: Trash2, label: "Trash", testId: "link-trash" },
  ];

  const quickActions = [
    { href: "/subscription", icon: CreditCard, label: "Subscription", testId: "link-subscription" },
    { href: "/profile", icon: UserIcon, label: "Profile", testId: "link-profile" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          data-testid="overlay-sidebar"
        />
      )}
      
      <aside 
        className={`glass w-64 fixed left-0 top-16 bottom-0 z-40 transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        data-testid="sidebar"
      >
        <div className="flex-1 p-6 space-y-6">
          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href || (item.href === "/files" && location === "/");
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start space-x-3 ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-white/10"
                    }`}
                    onClick={() => onClose()}
                    data-testid={item.testId}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start space-x-3 ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground hover:bg-white/10"
                      }`}
                      onClick={() => onClose()}
                      data-testid={item.testId}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 text-foreground hover:bg-white/10"
                data-testid="button-settings"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Storage Overview - Bottom */}
        <div className="p-6 border-t border-border space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Storage</span>
              <span className="text-muted-foreground" data-testid="text-storage-used">
                {user ? `${formatBytes(user.storageUsed || 0)} of ${formatBytes(user.storageLimit || 0)}` : "Loading..."}
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" data-testid="progress-storage" />
          </div>
          
          {/* Upgrade Plan Button */}
          <Link href="/subscription">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 shadow-lg"
              onClick={() => onClose()}
              data-testid="button-upgrade-plan"
            >
              <Zap className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
