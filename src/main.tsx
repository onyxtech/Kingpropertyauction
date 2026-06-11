import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

if (typeof window !== "undefined") {
  window.addEventListener("app:logout", () => {
    queryClient.clear();
  });
}

// Scroll to top on route change
const originalPushState = window.history.pushState;
window.history.pushState = function (...args) {
  originalPushState.apply(this, args);
  window.scrollTo(0, 0);
};
const originalReplaceState = window.history.replaceState;
window.history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  window.scrollTo(0, 0);
};
// Scroll to top on page refresh
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster richColors position="top-right" duration={4000} />
  </QueryClientProvider>
);