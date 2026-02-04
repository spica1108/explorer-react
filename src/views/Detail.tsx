import React from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: string;
  postId: number;
  title: string;
  body: string;
}

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = React.useState<Post | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);

  React.useEffect(() => {
    if (id) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => console.error("Error fetching post:", error));

      fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
        .then((response) => response.json())
        .then((data) => setComments(data))
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backButton}>
        ← 返回首页
      </button>

      <div style={styles.postContainer}>
        <h2 style={styles.title}>{post.title}</h2>
        <p style={styles.body}>{post.body}</p>
      </div>

      <div style={styles.commentsContainer}>
        <h3 style={styles.commentsTitle}>评论</h3>
        <ul style={styles.commentsList}>
          {comments.map((comment) => (
            <li key={comment.id} style={styles.commentItem}>
              <h4 style={styles.commentTitle}>{comment.title}</h4>
              <p style={styles.commentBody}>{comment.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  backButton: {
    padding: "8px 16px",
    marginBottom: "24px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  } as React.CSSProperties,
  postContainer: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  } as React.CSSProperties,
  body: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#666",
  } as React.CSSProperties,
  commentsContainer: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  commentsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  } as React.CSSProperties,
  commentsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  } as React.CSSProperties,
  commentItem: {
    padding: "16px",
    marginBottom: "12px",
    backgroundColor: "#fafafa",
    borderRadius: "6px",
    border: "1px solid #f0f0f0",
    transition: "all 0.3s",
  } as React.CSSProperties,
  commentTitle: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#1890ff",
  } as React.CSSProperties,
  commentBody: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#666",
    margin: 0,
  } as React.CSSProperties,
};

export default Detail;
