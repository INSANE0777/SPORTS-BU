import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Import Authentication Components ---
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./pages/ProtectedRoute";

// --- Import All Page Components ---
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import HouseView from "./pages/HouseView";
import BroadcastView from "./pages/BroadcastView";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/broadcast" element={<BroadcastView />} />

            {/* --- Protected Routes --- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/house/:houseId"
              element={
                <ProtectedRoute>
                  <HouseView />
                </ProtectedRoute>
              }
            />
            
            {/* --- Catch-All Not Found Route --- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;