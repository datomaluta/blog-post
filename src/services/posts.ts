import { instance } from "./axios";

export const getPosts = async ({ page }: { page?: number | string }) => {
  return instance.get(`/posts?_page=${page}`);
};

export const getPostById = async (id: number) => {
  return instance.get(`/posts/${id}`);
};

export const createPost = async (data: { title: string; body: string }) => {
  return instance.post(`/posts`, data);
};

export const deletePost = async (id: number) => {
  return instance.delete(`/posts/${id}`);
};
