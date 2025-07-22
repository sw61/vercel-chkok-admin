// css
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// page
import MainPage from "./Pages/MainPage";
import UserTablePage from "./users/UserTablePage";
import UserDetail from "./users/UserDetail";
import CampaignTablePage from "./campaigns/CampaignTablePage";
import CampaignDetail from "./campaigns/CampaignDetail";
import SideBar from "./SideBar/SideBar";
// ts
import { LoginForm } from "./auth/login-form";
import { PrivateComponent } from "./auth/tokenCheck";
// library
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

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
