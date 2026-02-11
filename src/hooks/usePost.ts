import { useQuery } from "@tanstack/react-query";
import type { PostData } from "@/types";

export const usePost = () => {
  const UserMutation = useQuery({
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

  return UserMutation;
};
