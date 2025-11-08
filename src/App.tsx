import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthCard } from "./components/AuthCard";
import HomePage from "./components/HomePage";
import AuthGuard from "./components/AuthGuard";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PublicCommunitiesPage from "./pages/PublicCommunitiesPage";
import PrivateCommunitiesPage from "./pages/PrivateCommunitiesPage";
import UploadAvatarPage from "./pages/UploadAvatar";
import CommunityPage from "./pages/CommunityPage";
import { SidebarStateProvider } from "./context/SidebarStateContext";
import SidebarLayout from "./layouts/GlobalSidebarAndHeader"; 
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <BrowserRouter>
      <ThemeProvider>
        <SidebarStateProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<AuthCard />} />

              {/* Protected routes */}
              <Route element={<AuthGuard><SidebarLayout /></AuthGuard>}>
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/communities/public" element={<PublicCommunitiesPage />} />
                <Route path="/communities/private" element={<PrivateCommunitiesPage />} />
                <Route path="/upload-avatar" element={<UploadAvatarPage />} />
                <Route path="/community/:id" element={<CommunityPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </SidebarStateProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
