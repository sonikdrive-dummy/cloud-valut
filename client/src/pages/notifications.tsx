import { useState } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, FileText, Share2, Star, Trash2, Settings, Clock } from "lucide-react";

export default function NotificationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      type: "file_shared",
      title: "New file shared with you",
      description: "Sarah Johnson shared 'Q4_Report.pdf' with you",
      time: "2 minutes ago",
      isRead: false,
      icon: Share2,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 2,
      type: "file_starred",
      title: "File starred",
      description: "You starred 'Meeting_Notes.md'",
      time: "1 hour ago",
      isRead: false,
      icon: Star,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: 3,
      type: "file_uploaded",
      title: "File uploaded successfully",
      description: "Your file 'Presentation.pptx' has been uploaded",
      time: "3 hours ago",
      isRead: true,
      icon: FileText,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: 4,
      type: "file_deleted",
      title: "File moved to trash",
      description: "Old_Document.docx was moved to trash",
      time: "1 day ago",
      isRead: true,
      icon: Trash2,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      id: 5,
      type: "system",
      title: "Storage usage warning",
      description: "You've used 85% of your storage space",
      time: "2 days ago",
      isRead: true,
      icon: Settings,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    // This would typically update the backend
    console.log("Mark all notifications as read");
  };

  const markAsRead = (id: number) => {
    // This would typically update the backend
    console.log(`Mark notification ${id} as read`);
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
        <div className="w-full">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center" data-testid="text-page-title">
                  <Bell className="h-8 w-8 mr-3" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-3" data-testid="badge-unread-count">
                      {unreadCount}
                    </Badge>
                  )}
                </h2>
                <p className="text-muted-foreground">
                  Stay updated with your file activities and system notifications
                </p>
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={markAllAsRead}
                  data-testid="button-mark-all-read"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer hover:bg-secondary/50 ${
                      !notification.isRead ? "bg-primary/5 border border-primary/20" : "bg-secondary/20"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    data-testid={`notification-item-${notification.id}`}
                  >
                    <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.title}
                          {!notification.isRead && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2"></span>
                          )}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`notification-description-${notification.id}`}>
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empty State (if no notifications) */}
          {notifications.length === 0 && (
            <Card className="glass border-white/20">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! New notifications will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}