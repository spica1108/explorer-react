import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
}

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

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedsearch, setDebouncedSearch] = React.useState(searchTerm);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null,
  );

  //防抖函数
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  //获取用户列表
  const {
    //把data属性取出，用users来接收，并设置默认值为空数组
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );
      if (!response.ok) {
        throw new Error("网络请求错误");
      }
      return response.json();
    },
  });

  const { data: posts = [] } = useQuery({
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

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(debouncedsearch.toLowerCase()),
  );

  const togglestar = (postId: number) => {
    console.log("收藏帖子:", postId);
  };

  // 加载和错误状态检查
  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>出错了: {(error as Error).message}</div>;
  }

  const currentPosts = posts.filter((post: Post) =>
    selectedUserId ? post.userId === selectedUserId : true,
  );

  return (
    <>
      <div style={styles.container}>
        {/* 左侧用户列表 */}
        <div style={styles.left}>
          <h2>用户搜索</h2>
          <input
            type="text"
            placeholder="搜索用户..."
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div>
            {filteredUsers.map((users: User) => (
              <div
                key={users.id}
                onClick={() => setSelectedUserId(users.id)}
                style={
                  selectedUserId === users.id
                    ? styles.userItemActive
                    : styles.userItem
                }
              >
                {users.name}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧贴文列表 */}
        <div style={styles.right}>
          <button style={styles.starsButton} onClick={() => navigate("/stars")}>
            已收藏
          </button>
          {!selectedUserId && (
            <div style={styles.placeholder}>请选择左侧用户</div>
          )}
          {selectedUserId && (
            <div>
              {/* <h2>贴文列表</h2> */}
              {currentPosts.map((post: Post) => (
                <div key={post.id} style={styles.postitem}>
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
              ))}
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
  left: {
    flex: 1,
    borderRight: "1px solid #e0e0e0",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    overflowY: "auto",
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
  userItem: {
    padding: "12px 16px",
    marginBottom: "8px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontWeight: "normal",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
  },
  userItemActive: {
    padding: "12px 16px",
    marginBottom: "8px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    backgroundColor: "#1890ff",
    color: "#fff",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px solid #1890ff",
  },
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
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: "8px 14px",
    background: "linear-gradient(90deg,#ff7a45 0%,#ff4d4f 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    boxShadow: "0 6px 18px rgba(255,77,79,0.18)",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "transform 0.12s ease, box-shadow 0.12s ease",
  } as React.CSSProperties,
};
export default Home;
