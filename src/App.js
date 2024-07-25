import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import NotFound from "./NotFound";
import Datepicker from "./components/datepicker";
import Home from "./Home";
import RecipeList from "./pages/recipeList";

function App() {
  const today = new Date();
  return (
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
