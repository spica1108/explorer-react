import React from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  postId: number;
  title: string;
  body: string;
}

const Detail: React.FC = () => {
  const [match, params] = useRoute("/detail/:id");
  const [, setLocation] = useLocation();

  const id = match ? params!.id : null;

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      if (!response.ok) {
        throw new Error("网络请求错误");
      }
      return response.json();
    },
    enabled: !!id,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
      );
      if (!response.ok) {
        throw new Error("网络请求错误");
      }
      return response.json();
    },
    enabled: !!id,
  });

  if (postLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        加载中...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        贴文不存在
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
          ← 返回首页
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          {post.title}
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          {post.body}
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">评论</h3>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              暂无评论
            </div>
          ) : (
            comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="bg-muted/50 p-4 rounded-md border border-border"
              >
                <h4 className="text-sm font-semibold mb-2 text-foreground">
                  {comment.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comment.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
