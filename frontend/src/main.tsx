import ReactDOM from 'react-dom/client'
import './global.css'
import './fonts/GothamPro/fonts.css'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './hoc/PrivateRoute';
import { Login } from './features/auth/Login';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Dashboard } from './app/pages/Dashboard';
import { Profile } from './app/pages/Profile';
import { PageLayout } from './layout/PageLayout';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <PageLayout><Login /></PageLayout>,
  },
  {
    path: '*',
    element: <PrivateRoute />,
    children: [
      {
        path: 'dashboard',
        element: <PageLayout><Dashboard /></PageLayout>,
      },
      {
        path: 'profile',
        element: <PageLayout><Profile /></PageLayout>,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
)
