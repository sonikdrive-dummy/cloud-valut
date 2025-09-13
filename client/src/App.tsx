import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { UploadProgress } from "@/components/upload-progress";
import NotFound from "@/pages/not-found";
import FilesPage from "@/pages/files";
import ProfilePage from "@/pages/profile";
import SubscriptionPage from "@/pages/subscription";
import RecentPage from "@/pages/recent";
import SharedPage from "@/pages/shared";
import StarredPage from "@/pages/starred";
import TrashPage from "@/pages/trash";
import NotificationsPage from "@/pages/notifications";
import SessionsPage from "@/pages/sessions";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FilesPage} />
      <Route path="/files" component={FilesPage} />
      <Route path="/recent" component={RecentPage} />
      <Route path="/shared" component={SharedPage} />
      <Route path="/starred" component={StarredPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/trash" component={TrashPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/subscription" component={SubscriptionPage} />
      <Route path="/sessions" component={SessionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <UploadProgress />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
