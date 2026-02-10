import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  userId: number;
  name: string;
  content: string;
  isStar?: boolean;
}

interface PostData {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface PostsProps {
  userId: number;
}

const Posts: React.FC<PostsProps> = ({ userId }) => {
  const [, setLocation] = useLocation();

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      if (!response.ok) {
        throw new Error("网络请求错误");
      }
      const data = await response.json();
      return data.map((p: PostData) => ({
        id: p.id,
        userId: p.userId,
        name: p.title,
        content: p.body,
      }));
    },
  });

  const [starred, setStarred] = React.useState<{ [key: number]: boolean }>({});

  const togglestar = (postId: number) => {
    setStarred((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>出错了: {(error as Error).message}</div>;
  }

  const currentPosts = posts
    .filter((post: Post) => post.userId === userId)
    .map((post: Post) => ({
      ...post,
      isStar: starred[post.id] || false,
    }));

  if (currentPosts.length === 0) {
    return <div>该用户暂无贴文</div>;
  }

  return (
    <div className="space-y-4">
      {currentPosts.map((post: Post) => (
        <div key={post.id} className="p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">{post.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
          <div className="flex gap-2">
            <Button
              variant={post.isStar ? "default" : "outline"}
              size="sm"
              onClick={() => togglestar(post.id)}
            >
              {post.isStar ? "已收藏" : "收藏"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLocation(`/detail/${post.id}`)}
            >
              查看详情
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
