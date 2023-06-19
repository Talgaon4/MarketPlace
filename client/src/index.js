import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (procces.env.NODE_ENV === 'production') disableReactDevTools()

=======
>>>>>>> 1883bfdd6d807a6a3495834fef1640814434614b
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
