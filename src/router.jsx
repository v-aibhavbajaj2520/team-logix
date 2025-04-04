import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import VideoFeed from './components/VideoFeed';
import Chat from './components/Chat';
import Settings from './components/Settings';
import Login from './components/Login';
import Register from './components/Register';
import News from './components/News';
import ErrorBoundary from './components/ErrorBoundary';
import { auth } from './firebase';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';

// Protected route wrapper
const requireAuth = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Unauthorized - Please login');
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    loader: requireAuth,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/pitches',
        element: <VideoFeed />,
        errorElement: <ErrorBoundary />
      },
      {
        path: '/chats',
        element: <Chat />,
        errorElement: <ErrorBoundary />
      },
      {
        path: '/news',
        element: <News />,
        errorElement: <ErrorBoundary />
      },
      {
        path: '/settings',
        element: <Settings />,
        errorElement: <ErrorBoundary />
      },
      {
        path: '/profile/:creatorId',
        element: <Profile />,
        errorElement: <ErrorBoundary />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorBoundary />
  }
]);

export default router; 