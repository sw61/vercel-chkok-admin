// css
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// page
import MainPage from "./Pages/MainPage";
import UserTablePage from "./Users/UserTablePage";
import UserDetail from "./Users/UserDetail";
import CampaignTablePage from "./Campaigns/CampaignTablePage";
import CampaignDetail from "./Campaigns/CampaignDetail";
import SideBar from "./SideBar/SideBar";

import AdminDetail from "./AdminAccount/AdminDetail";
import BannersDragpage from "./Banners/BannersDragPage";
import NotFoundPage from "./Pages/NotFoundPage";
// ts file
import { LoginForm } from "./auth/login-form";
import { PrivateComponent } from "./auth/tokenCheck";
// library
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BannersDetail from "./Banners/BannersDetail";
import { ServerPieChart } from "./Server/ServerPieChart";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터 캐싱
      gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<SideBar />}>
              {/* 메인 페이지 */}
              <Route
                path="/"
                element={
                  <PrivateComponent>
                    <MainPage />
                  </PrivateComponent>
                }
              ></Route>
              {/* 사용자 테이블 페이지 */}
              <Route
                path="/users"
                element={
                  <PrivateComponent>
                    <UserTablePage />
                  </PrivateComponent>
                }
              ></Route>
              {/* 사용자 상세 페이지 */}
              <Route
                path="/users/:userId"
                element={
                  <PrivateComponent>
                    <UserDetail />
                  </PrivateComponent>
                }
              ></Route>
              {/* 캠페인 페이지 */}
              <Route
                path="/campaigns"
                element={
                  <PrivateComponent>
                    <CampaignTablePage />
                  </PrivateComponent>
                }
              ></Route>
              {/* 캠페인 상세 페이지 */}
              <Route
                path="/campaigns/:campaignId"
                element={
                  <PrivateComponent>
                    <CampaignDetail />
                  </PrivateComponent>
                }
              ></Route>
              {/* 배너 목록 페이지 */}
              <Route
                path="/banners"
                element={
                  <PrivateComponent>
                    <BannersDragpage />
                  </PrivateComponent>
                }
              ></Route>

              {/* 배너 상세 페이지 */}
              <Route
                path="/banners/:bannerId"
                element={
                  <PrivateComponent>
                    <BannersDetail />
                  </PrivateComponent>
                }
              ></Route>

              {/* 관리자 계정 페이지 */}
              <Route
                path="/admin"
                element={
                  <PrivateComponent>
                    <AdminDetail />
                  </PrivateComponent>
                }
              ></Route>
              {/* 서버 차트 테스트 */}
              <Route
                path="/server"
                element={
                  <PrivateComponent>
                    <ServerPieChart />
                  </PrivateComponent>
                }
              ></Route>
            </Route>

            {/* 로그인 페이지 */}
            <Route path="/login" element={<LoginForm />}></Route>
            <Route path="/*" element={<NotFoundPage />}></Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer /> {/* react-toast */}
    </>
  );
}

export default App;
