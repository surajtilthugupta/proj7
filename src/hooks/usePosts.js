import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(API_URL);
        return data;
      } catch (error) {
        throw new Error('Failed to fetch posts');
      }
    },
  });
};

export const useDeletePosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
      } catch (error) {
        throw new Error('Delete request failed');
      }
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['posts'], (oldData) =>
        oldData ? oldData.filter((post) => post.id !== deletedId) : []
      );
    },
  });
};

export const useUpdatePosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }) => {
      try {
        const { data } = await axios.put(`${API_URL}/${id}`, values);
        return { ...data, id }; 
      } catch (error) {
        throw new Error('Update request failed');
      }
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (oldData) =>
        oldData
          ? oldData.map((post) => (post.id === updatedPost.id ? updatedPost : post))
          : []
      );
    },
  });
};

export const useCreatePosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      try {
        const { data } = await axios.post(API_URL, values);
        return data;
      } catch (error) {
        throw new Error('Create request failed');
      }
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData(['posts'], (oldData) =>
        oldData ? [newPost, ...oldData] : [newPost]
      );
    },
  });
};

