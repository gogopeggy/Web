import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 color="#1c5488">Peggy's APP</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/recipe">Recipe</Link>
      </div>
    </nav>
  );
};

export default Navbar;
