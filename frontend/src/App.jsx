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
import VolunteerProfile from "./pages/VolunteerProfile";
import SMSBroadcast from "./pages/admin/SMSBroadcast";
//IMPORT
import AlertConfiguration from "./pages/admin/AlertConfiguration";
import WeatherTracker from "./pages/admin/WeatherTracker";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/register"
            element={
              <ProtectedRoute role="volunteer">
                <VolunteerRegistration />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Signup />} />

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

          {/* Volunteer Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="volunteer">
                <VolunteerProfile />
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

          {/*  Alert Configuration */}
          <Route
            path="/admin/alerts"
            element={
              <ProtectedRoute role="admin">
                <AlertConfiguration />
              </ProtectedRoute>
            }
          />

          {/* SMS Broadcast */}
          <Route
            path="/admin/sms-broadcast"
            element={
              <ProtectedRoute role="admin">
                <SMSBroadcast />
          {/* Weather Safety Tracker */}
          <Route
            path="/admin/weather"
            element={
              <ProtectedRoute role="admin">
                <WeatherTracker />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}