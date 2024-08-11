import { Link } from "react-router-dom";
import logo from "../../assets/brainLogo.png";
import Typography from "@mui/material/Typography";

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="logo" width={30} height={30}></img>
      <Typography fontSize={14} pl={1} fontFamily={"system-ui"}>
        Ideas
      </Typography>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/recipe">Recipe</Link>
        <Link to="/expense">Expense</Link>
        <Link to="/camping">Camping</Link>
      </div>
    </nav>
  );
};

export default Navbar;
