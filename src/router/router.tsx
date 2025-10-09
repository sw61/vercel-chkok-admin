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
const BannersPage = lazy(() => import('@/pages/banners/pages/bannersDragPage'));
const BannersDetail = lazy(() => import('@/pages/banners/pages/bannersDetail'));
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
const ArticlePage = lazy(() => import('@/pages/articles/pages/tablePage'));
const ArticleDetail = lazy(() => import('@/pages/articles/pages/detailPage'));
const ArticleCreate = lazy(() => import('@/pages/articles/pages/createPage'));
const TestServerDashBoard = lazy(
  () => import('@/pages/dashboard/components/testServer')
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
  { path: '/articles', element: <ArticlePage /> },
  { path: '/articles/:articleId', element: <ArticleDetail /> },
  { path: '/articles/create', element: <ArticleCreate /> },
  { path: '/test', element: <TestServerDashBoard /> },
];
