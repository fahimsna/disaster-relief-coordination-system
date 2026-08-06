import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VolunteerRegistration from "./pages/VolunteerRegistration";

import CampaignList from "./pages/CampaignList";
import CampaignDetails from "./pages/CampaignDetails";
import MyDonations from "./pages/MyDonations";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

import AdminCampaigns from "./pages/admin/AdminCampaigns";
import CreateCampaign from "./pages/admin/CreateCampaign";
import EditCampaign from "./pages/admin/EditCampaign";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/register" element={<VolunteerRegistration />} />

          <Route path="/" element={<VolunteerRegistration />} />

          {/* Donor */}

          <Route path="/campaigns" element={<CampaignList />} />

          <Route path="/campaigns/:id" element={<CampaignDetails />} />

          <Route path="/donations" element={<MyDonations />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path="/payment-cancel" element={<PaymentCancel />} />

          {/* User Dashboard */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Campaign Management */}

          <Route
            path="/admin/campaigns"
            element={
              <ProtectedRoute role="admin">
                <AdminCampaigns />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/create"
            element={
              <ProtectedRoute role="admin">
                <CreateCampaign />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/edit/:id"
            element={
              <ProtectedRoute role="admin">
                <EditCampaign />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
