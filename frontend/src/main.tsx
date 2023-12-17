import ReactDOM from 'react-dom/client'
import './global.css'
import './fonts/GothamPro/fonts.css'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './hoc/PrivateRoute';
import { Login } from './features/auth/Login';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { PageLayout } from './layout/PageLayout';
import { Dashboard } from './app/pages/Dashboard.';
import { Profile } from './app/pages/Profile';
import Occupation from './app/pages/Occupation';
import { Admin } from './app/pages/Admin';
import { AdminPageLayout } from './layout/AdminPageLayout';
import { Graphs } from './app/pages/Graphs';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout><Login /></PageLayout>,
  },
  {
    path: '/',
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
        path: 'admin',
        element: <AdminPageLayout><Admin /></AdminPageLayout>,
      },
      {
        path: 'graph',
        element: <AdminPageLayout><Graphs /></AdminPageLayout>
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" />,
      },
      {
        path: 'occupation/:id',
        element: <PageLayout><Occupation /></PageLayout>
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
