import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/usePost";
import type { Post, PostsProps } from "@/types/index";

export const Posts: React.FC<PostsProps> = ({ userId }) => {
  const [, setLocation] = useLocation();
  const [starred, setStarred] = React.useState<{ [key: number]: boolean }>({});
  const { data: posts = [], isLoading, error } = usePost(userId);
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = React.useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // 只渲染当前页的数据
  const currentPageItems = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const togglestar = (postId: number) => {
    setStarred((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  //获取贴文列表
  const currentPosts = posts.map((post: Post) => ({
    ...post,
    isStar: starred[post.id] || false,
  }));

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  if (currentPosts.length === 0) {
    return <div>该用户暂无贴文</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {currentPageItems.map((post: Post) => (
          <div key={post.id} className="p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">{post.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{post.body}</p>
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

      <div className="flex justify-center mt-5 gap-2">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          上一页
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              fontWeight: page === currentPage ? "bold" : "normal",
            }}
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          下一页
        </Button>
      </div>
    </>
  );
};
