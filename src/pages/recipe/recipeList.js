import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

export default function RecipeList() {
  const [query, setQuery] = useState("");
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

  const URL = `https://d1-tutorial.a29098477.workers.dev/api/recipe?q=${encodeURIComponent(query)}&health=${encodeURIComponent(healthLabels)}`;

  async function getRecipes() {
    const result = await axios.get(URL);
    setRecipes(result.data.hits);
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
      <Typography textAlign={"center"} variant="h5" gutterBottom>
        Let's find your recipes
        <MenuBookIcon
          sx={{ verticalAlign: "middle", pl: 1, color: "secondary.main" }}
        />
      </Typography>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
          pt: 1,
        }}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="text"
          placeholder="Enter ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{ flex: "1 1 150px", maxWidth: 240, minWidth: 140 }}
        />
        <FormControl sx={{ flex: "1 1 150px", maxWidth: 240, minWidth: 140 }} size="small">
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
        <Button
          type="submit"
          variant="outlined"
          size="large"
          sx={{ flex: "1 1 140px", maxWidth: 200, minWidth: 120 }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          size="large"
          color="error"
          onClick={() => reset()}
          sx={{ flex: "1 1 140px", maxWidth: 200, minWidth: 120 }}
        >
          reset
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {recipes.map((recipe) => {
            const r = recipe["recipe"];
            return (
              <Grid item xs={12} sm={6} md={4} key={r["label"]}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow:
                        "0 10px 25px -5px rgba(15,23,42,.10), 0 8px 10px -6px rgba(15,23,42,.06)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => window.open(r["url"])}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={r["image"]}
                      alt={r["label"]}
                    />
                    <CardContent>
                      <Typography variant="subtitle2">{r["label"]}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
