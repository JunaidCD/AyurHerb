import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupAutoSync } from "./lib/sync";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Setup auto-sync when coming online
setupAutoSync();

createRoot(document.getElementById("root")).render(<App />);
