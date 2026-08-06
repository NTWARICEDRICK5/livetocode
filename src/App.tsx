import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursePage from "./pages/CoursePage";
import Playground from "./pages/Playground";
import AuthPage from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import TemplatesPage from "./pages/Templates";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import NotesPage from "./pages/Notes";
import SavedPage from "./pages/Saved";
import Certify from "./pages/Certify";
import Verify from "./pages/Verify";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/certify/:courseId" element={<Certify />} />
            <Route path="/verify/:certId" element={<Verify />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
