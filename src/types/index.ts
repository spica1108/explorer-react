export interface User {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  isStar?: boolean;
}

export interface PostsProps {
  userId: number;
}

export interface PostData {
  id: number;
  userId: number;
  title: string;
  body: string;
}
