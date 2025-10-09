// css
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// ts file
import { LoginForm } from './pages/login/components/loginForm';
import NotFoundPage from './pages/notFound/components/notFoundPage';
import { PrivateComponent } from './services/auth/tokenCheck';

// library
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SideBar from './components/sideBar/sideBar';
import { privateRoutes } from './router/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient({});

// tanstack dev tools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
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
    <Toaster position="top-center" />
    <ReactQueryDevtools
      initialIsOpen={false}
      position="right"
      buttonPosition="bottom-right"
    />
  </QueryClientProvider>
);

export default App;
