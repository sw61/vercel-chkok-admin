import './App.css';
import axiosInterceptor from './lib/axios-interceptors';
import { LoginForm } from './components/login-form';

// 1. 이메일과 비밀번호 입력 필요
// 2. HTTP 요청인데 POST 요청을 보내야 함
// 3. accessToken, refreshToken, email을 받는다

function App() {
  const getUserMe = async () => {
    try {
      const response = await axiosInterceptor.get('/auth/me');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default App;
