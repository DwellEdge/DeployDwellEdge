import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Careers from "./pages/Careers.jsx";
import ApplyJob from "./pages/ApplyJob.jsx";
import ContactUsPage from "./pages/ContactUs.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/EmployeeLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Services from "./pages/Services.jsx";
import ServiceData from "./pages/ServiceData.jsx";
import JobListing from "./pages/JobListing.jsx";
import EmployeePage from "./pages/EmployeePage.jsx";
import Founders from "./pages/Founders.jsx";
import Applicants from "./pages/Applicants.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";


function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
    <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/apply" element={<ApplyJob />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceData />} />
        <Route path="/admin/JobListing" element={<JobListing/>}/>
        <Route path="/admin/employeepage" element={<EmployeePage />} />
        <Route path="/admin/founders" element={<Founders />} />
        <Route path="/admin/Applicants" element={<Applicants />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;