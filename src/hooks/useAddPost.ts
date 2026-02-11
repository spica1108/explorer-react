import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

export const useAddPost = () => {
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: async (newPost: {
      name: string;
      title: string;
      body: string;
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
    onSuccess: (newUser) => {
      //setQueryData更新缓存
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => [
        ...(oldUsers || []),
        { id: newUser.id, name: newUser.name },
      ]);
    },
    onError: (error: Error) => {
      console.error("失败:", error.message);
    },
  });

  return addUserMutation;
};
