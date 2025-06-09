import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import App  from "./App";
import { StateContextProvider } from "./context";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider activeChain={Sepolia}>
    <Router>
      <ToastProvider>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </ToastProvider>
    </Router>
  </ThirdwebProvider>
);
