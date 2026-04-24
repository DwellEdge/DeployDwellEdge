import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./Home";
import Services from "./Services";
import ServiceData from "./ServiceData";
import Careers from "./Careers";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceData />} />
          <Route path="/Careers" element={<Careers />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
