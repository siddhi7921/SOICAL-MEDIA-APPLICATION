import {
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router';

import Layout from './components/Layout';
import WelcomePage from './pages/WelcomePage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ShortsPage from './pages/ShortsPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import UploadPage from './pages/UploadPage';

/* ================= ROOT ROUTE ================= */

export const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

/* ================= PUBLIC ROUTES ================= */

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WelcomePage,
});

/* ================= APP ROUTES ================= */

export const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: FeedPage,
});

export const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

export const shortsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shorts',
  component: ShortsPage,
});

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

export const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
});

export const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadPage,
});

/* ================= ROUTE TREE ================= */

export const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  exploreRoute,
  shortsRoute,
  profileRoute,
  messagesRoute,
  uploadRoute,
]);
