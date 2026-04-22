import {Link} from 'react-router-dom';
function Home() {
  return (
    <div className="homepage">
      <header className="navbar">
        <h2>DWELLEDGE Tech</h2>
        <nav>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Employee Login</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h1>Empowering Talent Transformations</h1>
        <p>Embrace the talent revolution to remain relevant in the future.</p>
      </section>
    </div>
  );
}

export default Home;
