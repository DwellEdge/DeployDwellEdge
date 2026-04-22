import { Link } from 'react-router-dom';

const services = [
  {
    id: "enterprise-application-development",
    title: "Enterprise Application Development",
    description: "Building scalable, secure, and customized enterprise solutions to streamline business operations.",
    icon: "🏢",
  },
  {
    id: "application-support-maintenance",
    title: "Application Support & Maintenance",
    description: "Ensuring smooth performance, bug fixes, and ongoing support for mission-critical applications.",
    icon: "🛠️",
  },
  {
    id: "web-application-development",
    title: "Web Application Development",
    description: "Creating responsive, user-friendly web apps tailored to client needs.",
    icon: "🌍",
  },
  {
    id: "windows-application-development",
    title: "Windows Application Development",
    description: "Designing and deploying robust desktop applications for Windows environments.",
    icon: "🪟",
  },
  {
    id: "healthcare-domain-solutions",
    title: "Healthcare Domain Solutions",
    description: "Developing specialized applications for healthcare providers, focusing on compliance and patient care.",
    icon: "🏥",
  },
  {
    id: "ecommerce-application-development",
    title: "e-Commerce Application Development",
    description: "Building secure, scalable online shopping platforms with integrated payment and inventory systems.",
    icon: "🛒",
  },
  {
    id: "hotel-hospitality-applications",
    title: "Hotel & Hospitality Applications",
    description: "Crafting solutions for booking, reservations, and customer engagement in the hospitality industry.",
    icon: "🏨",
  },
];

function Services() {
  return (
    <div>

      <header className="navbar">
        <h2>DWELLEDGE Tech</h2>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Employee Login</Link></li>
          </ul>
        </nav>
      </header>

      <div className="services-page">
        <div className="services-header">
          <h1 className="services-title">Our Services</h1>
          <div className="services-underline"></div>
        </div>

        <div className="services-wrapper">
          <div className="services-row-4">
            {services.slice(0, 4).map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <span className="service-emoji">{service.icon}</span>
                  </div>
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-desc">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="services-row-3">
            {services.slice(4).map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="service-card-link">
                <div className="service-card">
                  <div className="service-icon-wrapper">
                    <span className="service-emoji">{service.icon}</span>
                  </div>
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-desc">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Services;