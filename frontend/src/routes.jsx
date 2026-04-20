import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Maintenance from "./pages/Maintenance";
import Quality from "./pages/Quality";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Hybrid from "./pages/Hybrid";
import PrivateRoute from "./components/common/PrivateRoute";
import { useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Dashboard → ALL */}
        <Route index element={<Dashboard />} />

        {/* Maintenance → Admin + Engineer */}
        <Route
          path="maintenance"
          element={
            <PrivateRoute allowedRoles={["admin", "engineer"]}>
              <Maintenance />
            </PrivateRoute>
          }
        />

        {/* Quality → Admin + Engineer */}
        <Route
          path="quality"
          element={
            <PrivateRoute allowedRoles={["admin", "engineer"]}>
              <Quality />
            </PrivateRoute>
          }
        />

        {/* Hybrid → Admin + Engineer */}
        <Route
          path="hybrid"
          element={
            <PrivateRoute allowedRoles={["admin", "engineer"]}>
              <Hybrid />
            </PrivateRoute>
          }
        />

        {/* Reports → Admin only */}
        <Route
          path="reports"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Reports />
            </PrivateRoute>
          }
        />

        {/* Profile → ALL */}
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;