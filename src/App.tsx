// css
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// page
import MainPage from './pages/main/components/mainPage';
import UserTablePage from './pages/users/components/usersTablePage';
import CampaignTablePage from './pages/campaigns/components/campaignTablePage';
import CampaignDetail from './pages/campaigns/components/campaignDetail';
import SideBar from '@/components/sideBar/sideBar';
import UserDetail from './pages/users/components/usersDetail';
import AdminDetail from './pages/admin/components/adminDetail';
import BannersDragpage from '@/pages/banners/components/bannersDragPage';
import BannersDetail from '@/pages/banners/components/bannersDetail';
import NotFoundPage from './pages/notFound/components/notFoundPage';
import NoticePage from './pages/notices/components/noticePage';
import NoticeDetail from './pages/notices/components/noticeDetail';
import NoticeCreate from './pages/notices/components/noticeCreate';
import PostPage from './pages/posts/components/postPage';
import PostDetail from './pages/posts/components/postDetail';
import PostCreate from './pages/posts/components/postCreate';
import ServerDashBoard from './pages/dashboard/components/serverDashBoard';

// ts file
import { LoginForm } from './pages/login/components/loginForm';
import { PrivateComponent } from './services/auth/tokenCheck';

// library
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Route configuration
const privateRoutes = [
  { path: '/', element: <MainPage /> },
  { path: '/admin', element: <AdminDetail /> },
  { path: '/users', element: <UserTablePage /> },
  { path: '/users/:userId', element: <UserDetail /> },
  { path: '/campaigns', element: <CampaignTablePage /> },
  { path: '/campaigns/:campaignId', element: <CampaignDetail /> },
  { path: '/banners', element: <BannersDragpage /> },
  { path: '/banners/:bannerId', element: <BannersDetail /> },
  { path: '/server', element: <ServerDashBoard /> },
  { path: '/notices', element: <NoticePage /> },
  { path: '/notices/:markdownId', element: <NoticeDetail /> },
  { path: '/notices/create', element: <NoticeCreate /> },
  { path: '/posts', element: <PostPage /> },
  { path: '/posts/:markdownId', element: <PostDetail /> },
  { path: '/posts/create', element: <PostCreate /> },
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
