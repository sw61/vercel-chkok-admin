// css
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// page
import MainPage from "./Pages/MainPage";
import UserTablePage from "./Users/UserTablePage";
import CampaignTablePage from "./Campaigns/CampaignTablePage";
import CampaignDetail from "./Campaigns/CampaignDetail";
import SideBar from "./SideBar/SideBar";
import UserDetail from "./Users/UserDetail";
import AdminDetail from "./AdminAccount/AdminDetail";
import BannersDragpage from "./Banners/BannersDragPage";
import NotFoundPage from "./Pages/NotFoundPage";
import MarkdownDetail from "./Markdown/MarkdownDetail";
import MarkdownTable from "./Markdown/MarkdownTable";
import MarkdownCreate from "./Markdown/MarkdownCreate";
// ts file
import { LoginForm } from "./auth/login-form";
import { PrivateComponent } from "./auth/tokenCheck";
// library
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BannersDetail from "./Banners/BannersDetail";
import ServerDashBoard from "./Server/ServerDashBoard";
import BasicMap from "./KakaoMap/MapTest";

function App() {
  return (
    <>
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
            {/* 캠페인 상세 페이지 테스트*/}
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
            {/* 서버 데이터 대시보드 */}
            <Route
              path="/server"
              element={
                <PrivateComponent>
                  <ServerDashBoard />
                </PrivateComponent>
              }
            ></Route>
            {/* 마크다운 문서 목록 */}
            <Route
              path="/documents"
              element={
                <PrivateComponent>
                  <MarkdownTable />
                </PrivateComponent>
              }
            ></Route>
            {/* 마크다운 문서 상세 페이지 */}
            <Route
              path="/documents/:markdownId"
              element={
                <PrivateComponent>
                  <MarkdownDetail />
                </PrivateComponent>
              }
            ></Route>
            {/* 마크다운 문서 상세 페이지 */}
            <Route
              path="/documents/create"
              element={
                <PrivateComponent>
                  <MarkdownCreate />
                </PrivateComponent>
              }
            ></Route>
            <Route
              path="/map"
              element={
                <PrivateComponent>
                  <BasicMap />
                </PrivateComponent>
              }
            ></Route>
          </Route>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/*" element={<NotFoundPage />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer /> {/* react-toast */}
    </>
  );
}

export default App;
