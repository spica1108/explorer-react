import React, { useEffect, useState } from "react";
import { Posts } from "./Posts";
import { useUsers } from "@/hooks/useUsers";
import { useAddPost } from "@/hooks/useAddPost";
import type { User } from "@/types";
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

const AddPostDialog = () => {
  const [newUserName, setNewUserName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //post请求
  const mutation = useAddPost();

  // 提交新用户的表单处理
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    //调用mutate发请求
    mutation.mutate(
      {
        name: newUserName,
        title: postTitle,
        body: postBody,
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
          <Input
            placeholder="请输入用户名"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />
          <Input
            placeholder="请输入标题"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
          <Input
            placeholder="请输入内容"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            required
          />

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

  // 防抖逻辑
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: users = [], isPending, error } = useUsers();

  //get请求
  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(debouncedsearch.toLowerCase()),
  );

  // 加载和错误状态检查
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
          {filteredUsers.map((users: User) => (
            <Button
              key={users.id}
              variant={selectedUserId === users.id ? "default" : "outline"}
              className="w-full justify-start text-lg mb-3"
              onClick={() => {
                setSelectedUserId(users.id);
              }}
            >
              {users.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-2 p-6 relative">
        <div className=" p-6 relative">
          <div className="flex justify-end gap-3 mb-4">
            <Button onClick={() => setSelectedUserId(1)}>我的收藏</Button>

            <AddPostDialog />
          </div>
          {/* 当前存储的值，点击了ID为5的用户，存的就是5
          通过 props 传递给子组件 */}
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
