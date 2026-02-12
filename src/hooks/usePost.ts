//get请求，获取贴文列表，获取特定用户的贴文
import { useQuery } from "@tanstack/react-query";

export const usePost = (userId: number) => {
  const getPosts = async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
    );
    if (!response.ok) {
      throw new Error("网络请求错误");
    }
    const data = await response.json();
    return data;
  };

  return useQuery({
    queryKey: ["posts", userId],
    queryFn: getPosts,
    enabled: !!userId,
  });
};
