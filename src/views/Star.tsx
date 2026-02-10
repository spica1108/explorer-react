import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  title: string;
  body: string;
  isStar?: boolean;
}

const Star: React.FC = () => {
  const [, setLocation] = useLocation();

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10",
      );
      if (!response.ok) {
        throw new Error("网络请求错误");
      }
      const data = await response.json();
      return data.map((post: Post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        isStar: true,
      }));
    },
  });

  const [starred, setStarred] = useState<{ [key: number]: boolean }>({});

  const togglestar = (id: number) => {
    setStarred((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const starPosts = posts.filter((post: Post) => starred[post.id] !== false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-primary">
          <h2 className="text-2xl font-bold text-foreground">已收藏的贴文</h2>
          <div className="text-sm text-muted-foreground">
            共 {starPosts.length} 篇
          </div>
        </div>

        {starPosts.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground bg-card rounded-lg border border-border">
            暂无收藏的贴文
          </div>
        ) : (
          <div className="space-y-4">
            {starPosts.map((post: Post) => (
              <div
                key={post.id}
                className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.body}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setLocation(`/detail/${post.id}`)}
                  >
                    查看详情
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => togglestar(post.id)}
                  >
                    取消收藏
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Star;
