import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function RecipeList() {
  const [query, setQuery] = useState(" ");
  const [recipes, setRecipes] = useState([]);
  const [healthLabels, setHealthLabels] = useState("vegan");
  const labels = [
    "vegan",
    "vegetarian",
    "soy-free",
    "peanut-free",
    "wheat-free",
    "dairy-free",
    "egg-free",
    "gluten-free",
    "low-sugar",
    "alcohol-free",
  ];

  const ID = process.env.REACT_APP_API_ID;
  const KEY = process.env.REACT_APP_API_KEY;

  const URL = `https://api.edamam.com/search?q=${query}&app_id=${ID}&app_key=${KEY}&health=${healthLabels}`;

  async function getRecipes() {
    const result = await axios.get(URL);
    console.log("URL", URL);
    setRecipes(result.data.hits); // return an array
  }

  const handleChange = (event) => {
    setHealthLabels(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    getRecipes();
  };

  const reset = () => {
    setHealthLabels("vegan");
    setRecipes([]);
    setQuery("");
  };

  return (
    <Box>
      <Typography
        textAlign={"center"}
        variant="h6"
        fontFamily={"Segoe UI"}
        color={"#a94848"}
      >
        Let's find your recipes
        <MenuBookIcon
          sx={{ verticalAlign: "middle", pl: 1, color: "#40a0c2" }}
        />
      </Typography>

      <form onSubmit={onSubmit} style={{ textAlign: "center", paddingTop: 10 }}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="text"
          placeholder="Enter ingridient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
        />
        <FormControl sx={{ width: 150 }} size="small">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={healthLabels}
            onChange={handleChange}
            MenuProps={{ style: { maxHeight: 250 } }}
          >
            {labels.map((l) => (
              <MenuItem key={"label" + l} value={l}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="outlined" size="large">
          Search
        </Button>
        <Button
          variant="outlined"
          size="large"
          color="error"
          onClick={() => reset()}
        >
          reset
        </Button>
      </form>
      <Box>
        <Grid container>
          {recipes.map((recipe) => {
            return (
              <Grid item md={4} p={2} textAlign={"center"}>
                <img
                  className="img"
                  src={recipe["recipe"]["image"]}
                  width={230}
                  onClick={() => window.open(recipe["recipe"]["url"])}
                  alt={recipe["recipe"]["label"]}
                />
                {/* <p
                  className="title"
                  style={{ textAlign: "center" }}
                  onClick={() => window.open(recipe["recipe"]["url"])}
                >
                  {recipe["recipe"]["label"]}
                </p> */}
                {/* <Typography textAlign={'center'} ></Typography>
                 */}
                {/* <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    window.open(recipe["recipe"]["url"]);
                  }}
                >
                  {recipe["recipe"]["label"]}
                </Link> */}
                <Button
                  onClick={() => {
                    window.open(recipe["recipe"]["url"]);
                  }}
                  // color="#737a80"
                >
                  {recipe["recipe"]["label"]}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
