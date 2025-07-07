import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStringInput } from '@/hooks/use-string-input';
import axiosInterceptor from '@/lib/axios-interceptors';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { value: email, handleValue: handleEmail } = useStringInput('');
  const { value: password, handleValue: handlePassword } = useStringInput('');

  const [isLoading, setIsLoading] = useState(false);

  // 동기 함수
  const login = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.post('/auth/login', {
        email,
        password,
      });

      const data = response.data.data;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  // {
  //   "email": "admin1234@example.com",
  //   "password": "1234"
  // }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>체험콕 어드민 로그인</CardTitle>
          {/* <CardDescription>
            Enter your email below to login to your account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          {/* <form> */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="chkok@example.com"
                required
                value={email}
                onChange={handleEmail}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePassword}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={login}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중입니다...' : '로그인'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{' '}
            <a href="#" className="underline underline-offset-4">
              회원가입{' '}
            </a>
          </div>
          {/* </form> */}
        </CardContent>
      </Card>
    </div>
  );
}
