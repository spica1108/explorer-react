export interface Post {
  id: number;
  userId: number;
  name: string;
  content: string;
  isStar?: boolean;
}

export interface PostsProps {
  //接收父组件传递的userId
  userId: number;
}

export interface PostData {
  id: number;
  userId: number;
  title: string;
  body: string;
}
