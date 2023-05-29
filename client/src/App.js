import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import "./App.css";
import { MyNavbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Auth } from "./pages/auth";
import { CreateItem } from "./pages/create-item";
import { Home } from "./pages/home";
import { SavedItems } from "./pages/saved-items";
import { CreatedItems } from "./pages/created-items";
import { SearchItems } from "./pages/search-items";
import NotFound from "./components/NotFound"; // Import the NotFound component

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  return (
    <div className="App">
      <Router>
        <MyNavbar authenticated={authenticated} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home authenticated={authenticated} />} />
          <Route path="/search-items" element={<SearchItems />} />
          <Route path="/auth" element={<Auth handleLogin={handleLogin} />} />
          {authenticated ? (
            <>
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/saved-items" element={<SavedItems />} />
              <Route path="/created-items" element={<CreatedItems />} />
            </>
          ) : (
            <Route path="*" element={<PleaseLogin />} />
          )}
          <Route path="*" element={<NotFound />} /> {/* Route for 404 page */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

function PleaseLogin() {
  return <div>Please login to access this page.</div>;
}

export default App;
