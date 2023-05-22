import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { MyNavbar } from "./components/navbar";
import { Auth } from "./pages/auth";
import { CreateItem } from "./pages/create-item";
import { Home } from "./pages/home";
import { SavedItems } from "./pages/saved-items";
import { CreatedItems } from "./pages/created-items";
import { SearchItems } from "./pages/search-items";

function App() {
  return (
    <div className="App">
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-items" element={<SearchItems />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/saved-items" element={<SavedItems />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/created-items" element={<CreatedItems />} />
          <Route path="/create-item/:id" element={<CreateItem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
