import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Navbar from "./Navbar";
import NotFound from "./NotFound";
// import Datepicker from "./components/datepicker";
import Home from "./Home";
import RecipeList from "./pages/recipeList";
import Expense from "./pages/Money/expense";
import Edit from "./pages/Money/edit";
import Details from "./pages/Money/details";

function App() {
  // const today = new Date();
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home />}>
                {/* <Datepicker anyDate={today} /> */}
              </Route>
              <Route path="*" element={<NotFound />}></Route>
              <Route path="/recipe" element={<RecipeList />}></Route>
              <Route path="/expense" element={<Expense />}></Route>
              <Route path="/expense/edit" element={<Edit />}></Route>
              <Route path="/expense/details" element={<Details />}></Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
