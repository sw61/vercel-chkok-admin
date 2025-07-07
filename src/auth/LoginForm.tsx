// src/components/LoginForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/auth/authService';
// import { LoginRequest } from '@/types/auth';

// Zod 스키마 정의
const formSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력하세요.' }),
  password: z
    .string()
    .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form 설정
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(values);
      // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트)
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      window.location.href = '/dashboard'; // 백오피스 대시보드로 리다이렉트
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold">관리자 로그인</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
