//定义路由
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./views/Home.tsx";
import Detail from "./views/Detail.tsx";
import Star from "./views/Star.tsx";

function App() {
  return (
    //配置react-query
    <QueryClientProvider client={new QueryClient()}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/stars" element={<Star />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
