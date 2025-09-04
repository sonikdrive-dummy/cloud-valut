import { useState } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet, MapPin, Clock, Shield, AlertTriangle } from "lucide-react";

export default function SessionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock session data - in a real app, this would come from an API
  const sessions = [
    {
      id: "current",
      isCurrent: true,
      device: "Chrome on macOS",
      deviceType: "desktop",
      location: "San Francisco, CA, USA",
      ipAddress: "192.168.1.100",
      lastActive: "Active now",
      loginTime: new Date(),
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    {
      id: "session-2",
      isCurrent: false,
      device: "iPhone 15 Pro",
      deviceType: "mobile",
      location: "San Francisco, CA, USA",
      ipAddress: "192.168.1.101",
      lastActive: "2 hours ago",
      loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    },
    {
      id: "session-3",
      isCurrent: false,
      device: "Chrome on Windows",
      deviceType: "desktop",
      location: "New York, NY, USA",
      ipAddress: "203.0.113.45",
      lastActive: "1 day ago",
      loginTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    {
      id: "session-4",
      isCurrent: false,
      device: "Safari on iPad",
      deviceType: "tablet",
      location: "Los Angeles, CA, USA",
      ipAddress: "198.51.100.123",
      lastActive: "3 days ago",
      loginTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
    {
      id: "session-5",
      isCurrent: false,
      device: "Firefox on Ubuntu",
      deviceType: "desktop",
      location: "Austin, TX, USA",
      ipAddress: "203.0.113.78",
      lastActive: "1 week ago",
      loginTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
    },
  ];

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const terminateSession = (sessionId: string) => {
    // This would typically call an API to terminate the session
    console.log(`Terminating session: ${sessionId}`);
  };

  const currentSession = sessions.find(s => s.isCurrent);
  const otherSessions = sessions.filter(s => !s.isCurrent);

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
            <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center" data-testid="text-page-title">
              <Shield className="h-8 w-8 mr-3" />
              Active Sessions
            </h2>
            <p className="text-muted-foreground">
              Manage your active sessions and monitor where you're signed in
            </p>
          </div>

          {/* Current Session */}
          {currentSession && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Current Session</h3>
              <Card className="glass border-white/20 border-2 border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = getDeviceIcon(currentSession.deviceType);
                          return <IconComponent className="h-6 w-6 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-foreground" data-testid="text-current-device">
                            {currentSession.device}
                          </h4>
                          <Badge variant="default" data-testid="badge-current-session">
                            Current
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span data-testid="text-current-location">{currentSession.location}</span>
                            <span className="mx-2">•</span>
                            <span data-testid="text-current-ip">{currentSession.ipAddress}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Signed in {formatDate(currentSession.loginTime)}</span>
                            <span className="mx-2">•</span>
                            <span className="text-green-500 font-medium" data-testid="text-current-status">
                              {currentSession.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Secure
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other Sessions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Other Sessions</h3>
              {otherSessions.length > 0 && (
                <Button 
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500/10"
                  data-testid="button-terminate-all"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Terminate All
                </Button>
              )}
            </div>

            {otherSessions.length > 0 ? (
              <div className="space-y-4">
                {otherSessions.map((session) => (
                  <Card key={session.id} className="glass border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            {(() => {
                              const IconComponent = getDeviceIcon(session.deviceType);
                              return <IconComponent className="h-6 w-6 text-muted-foreground" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-device-${session.id}`}>
                              {session.device}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span data-testid={`text-location-${session.id}`}>{session.location}</span>
                                <span className="mx-2">•</span>
                                <span data-testid={`text-ip-${session.id}`}>{session.ipAddress}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Signed in {formatDate(session.loginTime)}</span>
                                <span className="mx-2">•</span>
                                <span data-testid={`text-last-active-${session.id}`}>
                                  Last active {session.lastActive}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => terminateSession(session.id)}
                          className="text-red-500 border-red-500 hover:bg-red-500/10"
                          data-testid={`button-terminate-${session.id}`}
                        >
                          Terminate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass border-white/20">
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No other sessions</h3>
                  <p className="text-muted-foreground">
                    You're only signed in on this device. This is more secure.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Security Notice */}
          <Card className="glass border-white/20 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Security Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    If you see any suspicious activity or don't recognize a session, 
                    terminate it immediately and consider changing your password.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}