import { lazy } from 'react';

const MainPage = lazy(() => import('@/pages/main/components/mainPage'));
const AdminDetail = lazy(() => import('@/pages/admin/components/adminDetail'));
const UsersTablePage = lazy(
  () => import('@/pages/users/components//table/usersTablePage')
);
const UsersDetail = lazy(
  () => import('@/pages/users/components/detail/userDetail')
);
const CompanyTablePage = lazy(
  () => import('@/pages/companies/components/companyTablePage')
);
const CampaignsTablePage = lazy(
  () => import('@/pages/campaigns/components/table/campaignsTablePage')
);
const CampaignsDetail = lazy(
  () => import('@/pages/campaigns/components/detail/campaignsDetail')
);
const BannersPage = lazy(
  () => import('@/pages/banners/components/table/bannersDragPage')
);
const BannersDetail = lazy(
  () => import('@/pages/banners/components/detail/bannersDetail')
);
const Dashboard = lazy(
  () => import('@/pages/dashboard/components/serverDashBoard')
);

const NoticePage = lazy(
  () => import('@/pages/notices/components/table/noticePage')
);
const NoticeDetail = lazy(
  () => import('@/pages/notices/components/detail/noticeDetail')
);
const NoticeCreate = lazy(
  () => import('@/pages/notices/components/create/noticeCreate')
);
const PostPage = lazy(() => import('@/pages/posts/components/table/postPage'));
const PostDetail = lazy(
  () => import('@/pages/posts/components/detail/postDetail')
);
const PostCreate = lazy(
  () => import('@/pages/posts/components/create/postCreate')
);

// Route configuration
export const privateRoutes = [
  { path: '/', element: <MainPage /> },
  { path: '/admin', element: <AdminDetail /> },
  { path: '/users', element: <UsersTablePage /> },
  { path: '/users/:userId', element: <UsersDetail /> },
  { path: '/companies', element: <CompanyTablePage /> },
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
