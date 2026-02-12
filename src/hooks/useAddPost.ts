//post请求，新增特定用户的贴文
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/types/index";

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: {
      title: string;
      body: string;
      userId: number;
    }) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!res.ok) throw new Error("创建用户失败");
      return res.json();
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData<Post[]>(["posts", newPost.userId], (oldData) => {
        return [newPost, ...(oldData ?? [])]; // oldData 如果为空就用空数组
      });
    },

    onError: (error: Error) => {
      console.error("失败:", error.message);
    },
  });
};
