import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Collection from "./pages/collection";
import CollectionsView from "./pages/collections-view";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Collection} />
      <Route path="/collections" component={CollectionsView} />
      <Route component={Collection} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
