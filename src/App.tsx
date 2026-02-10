import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RouteIndexApp from "./router/index.tsx";

function App() {
  return (
    //配置react-query
    <QueryClientProvider client={new QueryClient()}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouteIndexApp />
    </QueryClientProvider>
  );
}

export default App;
