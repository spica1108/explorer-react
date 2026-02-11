import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/usePost";
import type { Post, PostsProps } from "@/types/post";

export const Posts: React.FC<PostsProps> = ({ userId }) => {
  const [, setLocation] = useLocation();
  //从hook拿数据,data重命名为posts
  const { data: posts = [], isLoading, error } = usePost();
  const [starred, setStarred] = React.useState<{ [key: number]: boolean }>({});

  const togglestar = (postId: number) => {
    setStarred((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  //get请求
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
