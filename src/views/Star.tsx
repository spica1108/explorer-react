import { useNavigate } from "react-router-dom";

function Favorite() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>收藏页</h2>

      <button onClick={() => navigate("/")}>返回首页</button>
    </div>
  );
}

export default Favorite;
