import { useState, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStringInput } from '@/hooks/useStringInput';
import { login } from '@/services/auth/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Form } from 'react-hook-form';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { value: email, handleValue: handleEmail } = useStringInput('');
  const { value: password, handleValue: handlePassword } = useStringInput('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email, password);
      toast.success('로그인 성공하였습니다.');
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error('이메일과 비밀번호는 필수입니다.');
            break;
          case 401:
            toast.error('잘못된 정보가 있어요');
            break;
          case 403:
            navigate('/login');
            toast.error('관리자 권한이 필요합니다.');
            break;
          case 429:
            toast.error(
              '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요'
            );
            break;
          case 500:
            toast.error('로그인 처리 중 오류가 발생했습니다.');
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleEnterLogin = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="ck-sub-title-1">
                체험콕 관리자 로그인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <label htmlFor="email" className="ck-body-2-bold">
                    아이디
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="chkok@example.com"
                    required
                    value={email}
                    onChange={handleEmail}
                    className="ck-body-2"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <label htmlFor="password" className="ck-body-2-bold">
                      비밀번호
                    </label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    required
                    value={password}
                    onChange={handlePassword}
                    onKeyDown={handleEnterLogin}
                    className="ck-body-2"
                  />
                </div>
                <Button
                  type="submit"
                  className="ck-body-2 w-full"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중입니다...' : '로그인'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
