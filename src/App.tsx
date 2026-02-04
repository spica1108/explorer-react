import { Routes, Route } from "react-router-dom";
import Home from "./views/Home.tsx";
import Detail from "./views/Detail.tsx";
import Star from "./views/star.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/star" element={<Star />} />
    </Routes>
  );
}

export default App;
