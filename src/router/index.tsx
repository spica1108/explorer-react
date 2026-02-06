import Users from "../views/Users";
import Posts from "../views/Posts";
import Detail from "../views/Detail";
import Star from "../views/Star";
//定义路由
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Users />,
    children: [
      {
        path: "/",
        element: <div>请选择左侧用户</div>,
      },
      {
        //动态路由，匹配路径/posts/1、/posts/2等
        path: "posts/:userId",
        element: <Posts />,
      },
    ],
  },
  { path: "/detail/:id", element: <Detail /> },
  { path: "/stars", element: <Star /> },
]);

export default router;
