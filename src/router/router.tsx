import { lazy } from 'react';

const MainPage = lazy(() => import('@/pages/main/components/mainPage'));
const AdminDetail = lazy(() => import('@/pages/admin/components/adminDetail'));
const UsersTablePage = lazy(
  () => import('@/pages/users/components/usersTablePage')
);
const UsersDetail = lazy(() => import('@/pages/users/components/usersDetail'));
const CampaignsTablePage = lazy(
  () => import('@/pages/campaigns/components/table/campaignsTablePage')
);
const CampaignsDetail = lazy(
  () => import('@/pages/campaigns/components/detail/campaignsDetail')
);
const BannersPage = lazy(
  () => import('@/pages/banners/components/bannersDragPage')
);
const BannersDetail = lazy(
  () => import('@/pages/banners/components/bannersDetail')
);
const Dashboard = lazy(
  () => import('@/pages/dashboard/components/serverDashBoard')
);

const NoticePage = lazy(() => import('@/pages/notices/components/noticePage'));
const NoticeDetail = lazy(
  () => import('@/pages/notices/components/noticeDetail')
);
const NoticeCreate = lazy(
  () => import('@/pages/notices/components/noticeCreate')
);
const PostPage = lazy(() => import('@/pages/posts/components/postPage'));
const PostDetail = lazy(() => import('@/pages/posts/components/postDetail'));
const PostCreate = lazy(() => import('@/pages/posts/components/postCreate'));

// Route configuration
export const privateRoutes = [
  { path: '/', element: <MainPage /> },
  { path: '/admin', element: <AdminDetail /> },
  { path: '/users', element: <UsersTablePage /> },
  { path: '/users/:userId', element: <UsersDetail /> },
  { path: '/campaigns', element: <CampaignsTablePage /> },
  { path: '/campaigns/:campaignId', element: <CampaignsDetail /> },
  { path: '/banners', element: <BannersPage /> },
  { path: '/banners/:bannerId', element: <BannersDetail /> },
  { path: '/server', element: <Dashboard /> },
  { path: '/notices', element: <NoticePage /> },
  { path: '/notices/:markdownId', element: <NoticeDetail /> },
  { path: '/notices/create', element: <NoticeCreate /> },
  { path: '/posts', element: <PostPage /> },
  { path: '/posts/:markdownId', element: <PostDetail /> },
  { path: '/posts/create', element: <PostCreate /> },
];
