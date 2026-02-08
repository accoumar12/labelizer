import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Provider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { toast } from "sonner";
import { LayoutWrapper } from "./components/LayoutWrapper.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import App from "./pages/App.tsx";
import { DbConfig } from "./pages/DbConfig.tsx";
import { NotFound } from "./pages/NotFoundPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<LayoutWrapper />}>
      <Route path="/" element={<App />} />
      <Route path="/validation" element={<App isValidation={true} />} />
      <Route path="/db" element={<DbConfig />} />
      <Route path="/*" element={<NotFound />} />
    </Route>,
  ),
);

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (e: Error) =>
      toast("An error has occurred", {
        description: e.message,
        action: {
          label: "Copy",
          onClick: () => navigator.clipboard.writeText(e.message),
        },
      }),
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
