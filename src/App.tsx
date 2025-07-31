// css
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// page
import MainPage from "./Pages/MainPage";
import { UserTablePage } from "./Users/UserTablePage";
import UserDetail from "./Users/UserDetail";
import CampaignTablePage from "./Campaigns/CampaignTablePage";
import CampaignDetail from "./Campaigns/CampaignDetail";
import SideBar from "./SideBar/SideBar";
import BannersTable from "./Banners/BannersTablePage";

// ts
import { LoginForm } from "./auth/login-form";
import { PrivateComponent } from "./auth/tokenCheck";
// library
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BannersDetail from "./Banners/BannersDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<SideBar />}>
            <Route
              path="/"
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

            <Route
              path="/users/:userId"
              element={
                <PrivateComponent>
                  <UserDetail />
                </PrivateComponent>
              }
            ></Route>
            <Route
              path="/campaigns"
              element={
                <PrivateComponent>
                  <CampaignTablePage />
                </PrivateComponent>
              }
            ></Route>
            <Route
              path="/campaigns/:campaignId"
              element={
                <PrivateComponent>
                  <CampaignDetail />
                </PrivateComponent>
              }
            ></Route>
            <Route
              path="/banners"
              element={
                <PrivateComponent>
                  <BannersTable />
                </PrivateComponent>
              }
            ></Route>
            <Route
              path="/banners/:bannerId"
              element={
                <PrivateComponent>
                  <BannersDetail />
                </PrivateComponent>
              }
            ></Route>
          </Route>
          <Route path="/login" element={<LoginForm />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster /> {/* shadcn/ui-sonner */}
      <ToastContainer /> {/* react-toast */}
    </>
  );
}

export default App;
