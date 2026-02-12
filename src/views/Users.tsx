import React, { useEffect, useState } from "react";
import { Posts } from "./Posts";
import { useUsers } from "@/hooks/useUsers";
import { useAddPost } from "@/hooks/useAddPost";
import type { User } from "@/types/index";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const UserSchema = z.object({
  title: z.string().min(2).max(10),
  body: z.string().min(10).max(50),
});

const AddPostDialog = ({ userId }: { userId: number }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  //post请求
  const mutation = useAddPost();
  // 提交新贴文的表单处理
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();

    const result = UserSchema.safeParse({ title: postTitle, body: postBody });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(
      {
        ...result.data,
        userId,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setPostBody("");
          setPostTitle("");
        },
      },
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">新增贴文</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增贴文</DialogTitle>
          <DialogDescription>请输入</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddPost} className="space-y-4 pt-4">
          <div>
            <Input
              placeholder="请输入标题"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="请输入内容"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              required
            />
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "提交中..." : "提交"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedsearch, setDebouncedSearch] = React.useState(searchTerm);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null,
  );

  //防抖逻辑
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  //获取用户列表
  const { data: users = [], isPending, error } = useUsers();

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(debouncedsearch.toLowerCase()),
  );

  if (isPending) {
    return <div>加载中...</div>;
  }
  if (error) {
    return <div>出错了: {(error as Error).message}</div>;
  }

  return (
    <div className="relative flex">
      <div className="flex-1 border-r p-6">
        <h2 className="text-xl font-bold mb-4">用户搜索</h2>
        <Input
          placeholder="搜索用户..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-2">
          {filteredUsers.map((user: User) => (
            <Button
              key={user.id}
              variant={selectedUserId === user.id ? "default" : "outline"}
              className="w-full justify-start text-lg mb-3"
              onClick={() => {
                setSelectedUserId(user.id);
              }}
            >
              {user.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-2 p-6 relative">
        <div className=" p-6 relative">
          <div className="flex justify-end gap-3 mb-4">
            <Button onClick={() => setSelectedUserId(1)}>我的收藏</Button>

            {selectedUserId ? <AddPostDialog userId={selectedUserId} /> : null}
          </div>

          {selectedUserId ? (
            <Posts userId={selectedUserId} />
          ) : (
            <div>请选择左侧用户</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
