import { useParams, useNavigate } from "react-router-dom";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h2>贴文详情页</h2>
      <p>当前贴文ID：{id}</p>

      <button onClick={() => navigate("/")}>返回首页</button>
    </div>
  );
}

export default Detail;
