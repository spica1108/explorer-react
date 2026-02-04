import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  body: string;
  isStar?: boolean;
}

const Star: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((res) => res.json())
      .then((data: any[]) => {
        const starPosts = data.map((post) => ({
          id: post.id,
          title: post.title,
          body: post.body,
          isStar: true,
        }));
        setPosts(starPosts);
        setLoading(false);
      });
  }, []);

  const togglestar = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isStar: !post.isStar } : post,
      ),
    );
  };

  const starPosts = posts.filter((post) => post.isStar);

  if (loading) return <div style={styles.loading}>加载中...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>已收藏的贴文</h2>
      </div>
      {starPosts.length === 0 ? (
        <div style={styles.empty}>暂无收藏的贴文</div>
      ) : (
        <div style={styles.list}>
          {starPosts.map((post) => (
            <div key={post.id} style={styles.listItem}>
              <div style={styles.itemContent}>
                <h3 style={styles.itemTitle}>{post.title}</h3>
                <p style={styles.itemBody}>{post.body}</p>
              </div>
              <div style={styles.itemActions}>
                <button
                  onClick={() => navigate(`/detail/${post.id}`)}
                  style={styles.detailButton}
                >
                  查看详情
                </button>
                <button
                  onClick={() => togglestar(post.id)}
                  style={styles.removeButton}
                >
                  取消收藏
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "32px 24px",
  },
  loading: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    paddingTop: "100px",
  } as React.CSSProperties,
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: "2px solid #1890ff",
  } as React.CSSProperties,
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  } as React.CSSProperties,
  count: {
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "linear-gradient(90deg,#ff7a45 0%,#ff4d4f 100%)",
    background: "linear-gradient(90deg,#ff7a45 0%,#ff4d4f 100%)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: 600,
    minWidth: "32px",
    textAlign: "center",
  } as React.CSSProperties,
  empty: {
    textAlign: "center",
    fontSize: "16px",
    color: "#999",
    padding: "80px 20px",
  } as React.CSSProperties,
  list: {
    maxWidth: "900px",
    margin: "0 auto",
  } as React.CSSProperties,
  listItem: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,
  itemContent: {
    flex: 1,
    marginRight: "20px",
  } as React.CSSProperties,
  itemTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 12px 0",
  } as React.CSSProperties,
  itemBody: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as any,
  } as React.CSSProperties,
  itemActions: {
    display: "flex",
    gap: "12px",
    flexShrink: 0,
  } as React.CSSProperties,
  detailButton: {
    padding: "8px 14px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.3s",
  } as React.CSSProperties,
  removeButton: {
    padding: "8px 14px",
    background: "linear-gradient(90deg,#ff7a45 0%,#ff4d4f 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.3s",
  } as React.CSSProperties,
};

export default Star;
