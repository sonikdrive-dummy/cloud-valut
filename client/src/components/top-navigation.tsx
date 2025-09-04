import { Search, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "./theme-provider";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

interface TopNavigationProps {
  onSidebarToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TopNavigation({ onSidebarToggle, searchQuery, onSearchChange }: TopNavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between" data-testid="top-navigation">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-white/10"
          onClick={onSidebarToggle}
          data-testid="button-sidebar-toggle"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-cloud text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">CloudVault Pro</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-white/10"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-foreground" data-testid="text-user-name">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </div>
            <div className="text-xs text-muted-foreground" data-testid="text-user-plan">
              {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
            </div>
          </div>
          <img 
            src={user?.avatar || "https://pixabay.com/get/gd156c6bf101554ad4843adef61c41f30a6bf07d02066747b4690bcb8f6fc58056be6f6881f001a724ea57dff1f9476ecd659b16204239e0c7bff898ea22abf71_1280.jpg"}
            alt="Profile picture" 
            className="w-10 h-10 rounded-full border-2 border-white/20 cursor-pointer hover:border-primary transition-colors"
            onClick={() => setLocation("/profile")}
            data-testid="img-user-avatar"
          />
        </div>
      </div>
    </nav>
  );
}
