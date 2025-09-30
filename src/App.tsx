// css
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// ts file
import { LoginForm } from './pages/login/components/loginForm';
import { PrivateComponent } from './services/auth/tokenCheck';

// library
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import SideBar from './components/sideBar/sideBar';
import NotFoundPage from './pages/notFound/components/notFoundPage';

import { privateRoutes } from './router/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    <ToastContainer />
  </QueryClientProvider>
);

export default App;
