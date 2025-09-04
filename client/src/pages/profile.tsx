import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopNavigation } from "@/components/top-navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await apiRequest("PATCH", `/api/user/${user?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    desktopNotifications: false,
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        jobTitle: user.jobTitle || "",
      });
      setPreferences({
        emailNotifications: (user.preferences as any)?.emailNotifications ?? true,
        desktopNotifications: (user.preferences as any)?.desktopNotifications ?? false,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateProfile.mutate({
      ...formData,
      preferences: {
        ...(user.preferences as any || {}),
        ...preferences,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <TopNavigation
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 md:ml-64 p-6 pt-24">
          <div className="glass rounded-xl p-8 text-center" data-testid="loading-state">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

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
            <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Profile Settings
            </h2>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Information */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                  <div className="mb-6 lg:mb-0">
                    <img 
                      src={user?.avatar || "https://pixabay.com/get/gd156c6bf101554ad4843adef61c41f30a6bf07d02066747b4690bcb8f6fc58056be6f6881f001a724ea57dff1f9476ecd659b16204239e0c7bff898ea22abf71_1280.jpg"}
                      alt="Profile picture" 
                      className="w-32 h-32 rounded-xl border-2 border-white/20 mb-4"
                      data-testid="img-profile-avatar"
                    />
                    <Button 
                      type="button"
                      variant="secondary"
                      className="w-full"
                      data-testid="button-change-photo"
                    >
                      Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-foreground">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="mt-2 bg-secondary border-border text-foreground"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-foreground">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="mt-2 bg-secondary border-border text-foreground"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-2 bg-secondary border-border text-foreground"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobTitle" className="text-foreground">
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        className="mt-2 bg-secondary border-border text-foreground"
                        data-testid="input-job-title"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Button 
                    type="button"
                    variant="default"
                    data-testid="button-enable-2fa"
                  >
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Password</div>
                    <div className="text-sm text-muted-foreground">
                      Last changed 3 months ago
                    </div>
                  </div>
                  <Button 
                    type="button"
                    variant="outline"
                    data-testid="button-change-password"
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-foreground">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive updates about your files and account
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                    }
                    data-testid="switch-email-notifications"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Desktop Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Show notifications when files are shared or updated
                    </div>
                  </div>
                  <Switch
                    checked={preferences.desktopNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, desktopNotifications: checked }))
                    }
                    data-testid="switch-desktop-notifications"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button"
                variant="secondary"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateProfile.isPending}
                data-testid="button-save-changes"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
