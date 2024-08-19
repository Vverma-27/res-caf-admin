import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { lazy, useState, Suspense, useEffect, useContext } from 'react';

import { MyContext } from 'src/Context';
import { auth } from 'src/services/firebase';
import { getSocket } from 'src/services/socket';
import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
// export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
// export const ProductsPage = lazy(() => import('src/pages/products'));
export const OnboardingPage = lazy(() => import('src/pages/onboarding'));
export const MenuPage = lazy(() => import('src/pages/menu'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const PaymentPage = lazy(() => import('src/pages/payment'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const OrdersPage = lazy(() => import('src/pages/orders'));

// ----------------------------------------------------------------------

export default function Router({ status, name }) {
  const [authToken, setAuthToken] = useState(null);
  const { setSocket, setOrders } = useContext(MyContext);

  useEffect(() => {
    async function fetchAuthToken() {
      if (status !== 3) return;
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        setAuthToken(token);
        const socketConnection = getSocket(authToken, name);
        if (!socketConnection) return;
        socketConnection.connect();
        socketConnection.on('connect', () => {
          setSocket(socketConnection);
          console.log('Connected to server');
        });
        socketConnection.on('new-order', (order) => {
          setOrders((prevOrders) => [...prevOrders, order]);
        });
        socketConnection.on('order-transaction', ({ orderID, remainingAmount }) =>
          setOrders((prevOrders) =>
            prevOrders.map((order) => {
              if (order.orderID === orderID)
                return {
                  ...order,
                  remainingAmount,
                };
              return order;
            })
          )
        );
        // Use socket and token as needed
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
    }

    fetchAuthToken();
  }, [status, authToken, name, setSocket, setOrders]);
  const dashboardRoutes = [
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        // { path: 'user', element: <UserPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'payments', element: <PaymentPage /> },
        { path: 'orders', element: <OrdersPage /> },
        // { path: 'products', element: <ProductsPage /> },
        { path: 'menu', element: <MenuPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
  ];

  const authRoutes = [
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
  ];

  const onboardingRoute = { path: 'onboarding', element: <OnboardingPage status={status} /> };

  let routes = [];

  if (status === 0) {
    // Only sign up and sign in allowed
    routes = [...authRoutes, { path: '*', element: <Navigate to="/login" replace /> }];
  } else if (status === 1 || status === 2) {
    // Onboarding allowed
    routes = [onboardingRoute, { path: '*', element: <Navigate to="/onboarding" replace /> }];
  } else if (status === 3) {
    // Every page except onboarding and auth allowed
    routes = [...dashboardRoutes, { path: '*', element: <Navigate to="/" replace /> }];
  } else {
    // Fallback to a default or error route
    routes = [{ path: '*', element: <Navigate to="/404" replace /> }];
  }

  return useRoutes([...routes, { path: '404', element: <Page404 /> }]);
}
