import React, { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  isFavorite: boolean;
}

const Favorites: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((res) => res.json())
      .then((data: any[]) => {
        const favoritePosts = data.map((post) => ({
          id: post.id,
          title: post.title,
          body: post.body,
        }));
        setPosts(favoritePosts);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isFavorite: !post.isFavorite } : post,
      ),
    );
  };

  const favoritePosts = posts.filter((post) => post.isFavorite);

  if (loading) return <p>加载中...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>已收藏的贴文</h2>
      {favoritePosts.length === 0 ? (
        <p>暂无收藏的贴文</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 15,
          }}
        >
          {favoritePosts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 10,
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <button onClick={() => toggleFavorite(post.id)}>取消收藏</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
