import './App.css';
import { LoginForm } from './auth/login-form';
import MainPage from './Pages/MainPage';
import UserTablePage from './users/UserTablePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateComponent } from './auth/tokenCheck';
import { Toaster } from './components/ui/sonner';

// 1. 이메일과 비밀번호 입력 필요
// 2. HTTP 요청인데 POST 요청을 보내야 함
// 3. accessToken, refreshToken, email을 받는다

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/main"
            element={
              <PrivateComponent>
                <MainPage />
              </PrivateComponent>
            }
          ></Route>
          <Route
            path="/userTable"
            element={
              <PrivateComponent>
                <UserTablePage />
              </PrivateComponent>
            }
          ></Route>

          <Route path="/" element={<LoginForm />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
