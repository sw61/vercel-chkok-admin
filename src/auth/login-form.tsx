import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStringInput } from "@/hooks/use-string-input";
import { login } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { value: email, handleValue: handleEmail } = useStringInput("");
  const { value: password, handleValue: handlePassword } = useStringInput("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 동기 함수
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>체험콕 관리자 로그인</CardTitle>
            </CardHeader>
            <CardContent>
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
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중입니다..." : "로그인"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
