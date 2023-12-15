import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './hoc/PrivateRoute';
import { Login } from './features/auth/Login';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { PageLayout } from './layout/PageLayout';


const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <PrivateRoute />,
    children: [
      {
        path: 'dashboard',
        element: <div>DONE</div>,
      },
    ],
  },
  {
    path: 'dashboard',
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PageLayout>
        <RouterProvider router={router} />
      </PageLayout>
    </Provider>
  </React.StrictMode>,
)
