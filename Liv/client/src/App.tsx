import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { QRCode } from "./pages/QRCode";
import { Favorites } from "./pages/Favorites";
import { Map } from "./pages/Map";
import { Profile } from "./pages/Profile";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/not-found";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="liv-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/detail/:id" component={Detail} />
            <Route path="/qr/:id" component={QRCode} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/map" component={Map} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
