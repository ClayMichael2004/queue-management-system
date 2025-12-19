import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Booking from "./pages/Booking";
import Secretary from "./pages/Secretary";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import DisplayBoard from "./pages/DisplayBoard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Booking />} />
        <Route path="/login" element={<Login />} />

        {/* Protected pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/secretary"
          element={
            <ProtectedRoute role="CASHIER">
              <Secretary />
            </ProtectedRoute>
          }
        />

        {/* Display board - no login required */}
        <Route path="/display" element={<DisplayBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
