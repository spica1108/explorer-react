import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  userId: number;
  name: string;
  content: string;
  isFavorite?: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const Home: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([
    {
      id: 1,
      userId: 1,
      name: "Hello World",
      content: "This is my first post!",
    },
    {
      id: 2,
      userId: 2,
      name: "My Second Post",
      content: "Learning React is fun.",
    },
    {
      id: 3,
      userId: 3,
      name: "React is Awesome",
      content: "React is a powerful library for building user interfaces.",
    },
  ]);

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

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(debouncedsearch.toLowerCase()),
  );

  const toggleFavorite = (postId: number) => {
    setAllPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post,
      ),
    );
  };

  const currentPosts = allPosts.filter((post) =>
    selectedUserId ? post.userId === selectedUserId : true,
  );

  const goDetail = (postId: number) => {
    alert(`跳转到贴文详情页，贴文ID：${postId}`);
  };
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
            {filteredUsers.map((users) => (
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
          {!selectedUserId && (
            <div style={styles.placeholder}>请选择左侧用户</div>
          )}
          {selectedUserId && (
            <div>
              {/* <h2>贴文列表</h2> */}
              {currentPosts.map((post) => (
                <div key={post.id} style={styles.postitem}>
                  <h3>{post.name}</h3>
                  <p>{post.content}</p>

                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                  >
                    <button
                      onClick={() => toggleFavorite(post.id)}
                      style={
                        post.isFavorite
                          ? styles.favoriteButtonActive
                          : styles.favoriteButton
                      }
                    >
                      {post.isFavorite ? "已收藏" : "收藏"}
                    </button>

                    <button
                      onClick={() => goDetail(post.id)}
                      style={styles.detailButton}
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
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    overflowY: "auto",
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
  favoriteButton: {
    padding: "6px 12px",
    backgroundColor: "#fafafa",
    color: "#333",
    border: "1px solid #d9d9d9",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  } as React.CSSProperties,
  favoriteButtonActive: {
    padding: "6px 12px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "1px solid #ff4d4f",
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
};
export default Home;
