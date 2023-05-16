import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { Auth } from "./pages/auth";
import { CreateItem } from "./pages/create-item";
import { Home } from "./pages/home";
import { SavedItems } from "./pages/saved-items";
import { CreatedItems } from "./pages/created-items";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/saved-items" element={<SavedItems />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/created-items" element={<CreatedItems />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
