import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteUser,
  putMemoUpdate,
  putUserStatus,
  userToClient,
} from './detailApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { UpdateUserMemoProps } from './detailType';

export const usePutUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => putUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail'],
      });
      toast.success('상태 변경을 성공했습니다.');
    },
    onError: () => {
      toast.error('상태 변경에 실패했습니다.');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userTable'],
      });
      navigate('/users');
      toast.success('사용자가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('사용자 삭제를 실패했습니다.');
    },
  });
};

export const useUpdateUserMemo = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateUserMemoProps>({
    mutationFn: ({ userId, userMemo }) => putMemoUpdate(userId, userMemo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail'],
      });
      toast.success('메모가 업데이트 되었습니다.');
    },
    onError: () => {
      toast.error('메모 업데이트에 실패했습니다.');
    },
  });
};
export const useUserToClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userToClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail'],
      });
      toast.success('클라이언트로 승급되었습니다.');
    },
    onError: () => {
      toast.error('클라이언트 승급을 실패했습니다.');
    },
  });
};
