import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { ErrorBoundary } from "../common/components/ErrorBoundary/ErrorBoundary";
import { Toaster } from "../common/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
