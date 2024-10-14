import { Link, useLocation } from "react-router-dom";
import React from "react";
import logo from "../../assets/brainLogo.png";
import Typography from "@mui/material/Typography";

const Navbar = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const pages = {
    Home: "/",
    Recipe: "/recipe",
    Expense: "/expense",
    Camping: "/camping",
  };
  return (
    <nav className="navbar">
      <img src={logo} alt="logo" width={30} height={30}></img>
      <Typography fontSize={14} pl={1} fontFamily={"system-ui"}>
        Ideas
      </Typography>
      <div className="links">
        {Object.keys(pages).map((p) => {
          return (
            <Link
              to={pages[p]}
              className={pathName === pages[p] ? "navactive" : ""}
            >
              {p}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
