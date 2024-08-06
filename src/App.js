import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { getWeather } from "./Redux/weatherSlice";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import Navbar from "./pages/home/Navbar";
import NotFound from "./pages/notFound/NotFound";
import Home from "./pages/home/Home";
import RecipeList from "./pages/recipe/recipeList";
import Expense from "./pages/expense/expense";
import Details from "./pages/expense/details";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchWeather() {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=25.0651335306964&lon=121.576200811347&lang=zh_tw&units=metric&appid=445813e62fa1a98ba142c1e48ccd0290"
      )
      .then((response) => {
        let data = {};
        data["main"] = response.data.main;
        data["des"] = response.data.weather;
        dispatch(getWeather(data));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="*" element={<NotFound />}></Route>
              <Route path="/recipe" element={<RecipeList />}></Route>
              <Route path="/expense" element={<Expense />}></Route>
              <Route path="/expense/details" element={<Details />}></Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
