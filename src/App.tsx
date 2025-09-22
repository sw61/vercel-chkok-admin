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
