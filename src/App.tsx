//定义路由
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home.tsx";
import Detail from "./views/Detail.tsx";
import Star from "./views/Star.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/stars" element={<Star />} />
    </Routes>
  );
}

export default App;
