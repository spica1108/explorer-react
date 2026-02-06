import Users from "../views/Users";
import Posts from "../views/Posts";
import Detail from "../views/Detail";
import Star from "../views/Star";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Users />,
    children: [
      {
        path: "posts",
        element: <div>请选择左侧用户</div>,
      },
      {
        path: "posts/:userId",
        element: <Posts />,
      },
    ],
  },
  { path: "/detail/:id", element: <Detail /> },
  { path: "/stars", element: <Star /> },
]);

export default router;
