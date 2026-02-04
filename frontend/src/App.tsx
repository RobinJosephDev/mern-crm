import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Leads from "./pages/LeadsPage";
import FollowUps from "./pages/FollowUpPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeadsQuotesPage from "./pages/LeadsQuotesPage";
import CustomerPage from "./pages/CustomerPage";
import UsersPage from "./pages/UsersPage";
import { ToastContainer } from "react-toastify";
import ShipmentPage from "./pages/ShipmentPage";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<div>Welcome to CRM</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/leads-with-quotes" element={<LeadsQuotesPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/shipments" element={<ShipmentPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </>
  );
}

export default App;
