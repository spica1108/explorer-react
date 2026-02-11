//get请求，获取用户列表
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );
      if (!response.ok) {
        throw new Error("网络请求错误");
      }
      return response.json() as Promise<User[]>;
    },
  });
};
