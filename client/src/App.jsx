import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./Home";
import Services from "./Services";
import ServiceData from "./ServiceData";
import Careers from "./Careers";
import "./style.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ApplyJob from './ApplyJob';
import ContactUsPage from './ContactUs';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceData />} />
          <Route path="/Careers" element={<Careers />} />
          <Route path="/apply" element={<ApplyJob />} />
          <Route path="/Contact" element={<ContactUsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
