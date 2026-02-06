import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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

const Posts: React.FC = () => {
  const navigate = useNavigate();

  const { userId } = useParams();
  const selectedUserId = userId ? parseInt(userId, 10) : null;

  //获取贴文列表
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

  // 本地收藏状态
  const [starred, setStarred] = React.useState<{ [key: number]: boolean }>({});

  const togglestar = (postId: number) => {
    setStarred((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // 加载和错误状态检查
  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>出错了: {(error as Error).message}</div>;
  }

  const currentPosts = selectedUserId
    ? posts
        .filter((post: Post) => post.userId === selectedUserId)
        .map((post: Post) => ({
          ...post,
          isStar: starred[post.id] || false,
        }))
    : [];

  return (
    <>
      <div style={styles.container}>
        {/* 右侧贴文列表 */}
        <div style={styles.right}>
          <button style={styles.starsButton} onClick={() => navigate("/stars")}>
            已收藏
          </button>
          {!selectedUserId ? (
            <div style={styles.placeholder}>请选择左侧用户</div>
          ) : (
            <div>
              {currentPosts.length === 0 ? (
                <div style={styles.placeholder}>该用户暂无贴文</div>
              ) : (
                currentPosts.map((post: Post, idx: number) => (
                  <div
                    key={post.id}
                    style={{
                      ...styles.postitem,
                      marginTop: idx === 0 ? "0px" : undefined,
                    }}
                  >
                    <h3>{post.name}</h3>
                    <p>{post.content}</p>
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                    >
                      <button
                        onClick={() => togglestar(post.id)}
                        style={
                          post.isStar
                            ? styles.starButtonActive
                            : styles.starButton
                        }
                      >
                        {post.isStar ? "已收藏" : "收藏"}
                      </button>
                      <button
                        style={styles.detailButton}
                        onClick={() => navigate(`/detail/${post.id}`)}
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    boxSizing: "border-box",
    backgroundColor: "#f5f5f5",
  },
  right: {
    flex: 2,
    padding: "24px",
    paddingTop: "72px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    overflowY: "auto",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "16px",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.3s",
  } as React.CSSProperties,
  postitem: {
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  placeholder: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#999",
    fontSize: "16px",
  } as React.CSSProperties,
  starButton: {
    padding: "6px 12px",
    backgroundColor: "#fafafa",
    color: "#333",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  } as React.CSSProperties,
  starButtonActive: {
    padding: "6px 12px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "1px solid #1890ff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  } as React.CSSProperties,
  detailButton: {
    padding: "6px 12px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "1px solid #1890ff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  } as React.CSSProperties,
  starsButton: {
    position: "fixed",
    top: "24px",
    right: "32px",
    zIndex: 999,
    padding: "12px 24px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "1px",
    transition: "transform 0.12s ease, box-shadow 0.12s ease",
  } as React.CSSProperties,
};
export default Posts;
