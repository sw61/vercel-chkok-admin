// css
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// page
import MainPage from './Pages/MainPage';
import UserTablePage from './Users/UserTablePage';
import CampaignTablePage from './Campaigns/CampaignTablePage';
import CampaignDetail from './Campaigns/CampaignDetail';
import SideBar from './SideBar/SideBar';
import UserDetail from './Users/UserDetail';
import AdminDetail from './AdminAccount/AdminDetail';
import BannersDragpage from './Banners/BannersDragPage';
import BannersDetail from './Banners/BannersDetail';
import NotFoundPage from './Pages/NotFoundPage';
import NoticePage from './Notice/NoticePage';
import NoticeDetail from './Notice/NoticeDetail';
import NoticeCreate from './Notice/NoticeCreate';
import PostPage from './Post/PostPage';
import PostDetail from './Post/PostDetail';
import PostCreate from './Post/PostCreate';
import CompanyTablePage from './Company/CompanyTablePage';
import ServerDashBoard from './Server/ServerDashBoard';

// ts file
import { LoginForm } from './auth/login-form';
import { PrivateComponent } from './auth/tokenCheck';

// library
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MapComponent from './KakaoMap/KakaoSearch';

// Route configuration
const privateRoutes = [
  { path: '/', element: <MainPage /> },
  { path: '/users', element: <UserTablePage /> },
  { path: '/users/:userId', element: <UserDetail /> },
  { path: '/companies', element: <CompanyTablePage /> },
  { path: '/campaigns', element: <CampaignTablePage /> },
  { path: '/campaigns/:campaignId', element: <CampaignDetail /> },
  { path: '/banners', element: <BannersDragpage /> },
  { path: '/banners/:bannerId', element: <BannersDetail /> },
  { path: '/admin', element: <AdminDetail /> },
  { path: '/server', element: <ServerDashBoard /> },
  { path: '/notices', element: <NoticePage /> },
  { path: '/notices/:markdownId', element: <NoticeDetail /> },
  { path: '/notices/create', element: <NoticeCreate /> },
  { path: '/posts', element: <PostPage /> },
  { path: '/posts/:markdownId', element: <PostDetail /> },
  { path: '/posts/create', element: <PostCreate /> },
  { path: '/test', element: <MapComponent /> },
];

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        {/* Layout route with SideBar */}
        <Route element={<SideBar />}>
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateComponent>{element}</PrivateComponent>}
            />
          ))}
        </Route>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </>
);

export default App;
