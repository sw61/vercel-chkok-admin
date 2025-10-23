import { lazy } from 'react';

const MainPage = lazy(() => import('@/pages/main/mainPage'));
const AdminDetail = lazy(() => import('@/pages/admin/components/adminDetail'));
const UsersTablePage = lazy(() => import('@/pages/users/pages/usersTablePage'));
const UsersDetail = lazy(() => import('@/pages/users/pages/userDetail'));
const CompanyTablePage = lazy(
  () => import('@/pages/companies/pages/companyTablePage')
);
const CampaignsTablePage = lazy(
  () => import('@/pages/campaigns/pages/campaignsTablePage')
);
const CampaignsDetail = lazy(
  () => import('@/pages/campaigns/pages/campaignsDetail')
);
const BannersPage = lazy(() => import('@/pages/banners/pages/bannersDragPage'));
const BannersDetail = lazy(() => import('@/pages/banners/pages/bannersDetail'));
const NoticePage = lazy(() => import('@/pages/notices/pages/noticeTablePage'));
const NoticeDetail = lazy(() => import('@/pages/notices/pages/noticeDetail'));
const NoticeCreate = lazy(() => import('@/pages/notices/pages/noticeCreate'));
const ArticlePage = lazy(() => import('@/pages/articles/pages/tablePage'));
const ArticleDetail = lazy(() => import('@/pages/articles/pages/detailPage'));
const ArticleCreate = lazy(() => import('@/pages/articles/pages/createPage'));
const ServerDashBoard = lazy(() => import('@/pages/grafana/grafanaDashboard'));

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
  { path: '/server', element: <ServerDashBoard /> },
  { path: '/notices', element: <NoticePage /> },
  { path: '/notices/:noticeId', element: <NoticeDetail /> },
  { path: '/notices/create', element: <NoticeCreate /> },
  { path: '/articles', element: <ArticlePage /> },
  { path: '/articles/:articleId', element: <ArticleDetail /> },
  { path: '/articles/create', element: <ArticleCreate /> },
];
