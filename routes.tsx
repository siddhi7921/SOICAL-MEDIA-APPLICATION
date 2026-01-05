import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ShortsPage from './pages/ShortsPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import UploadPage from './pages/UploadPage';
import WelcomePage from './pages/WelcomePage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WelcomePage,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: FeedPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const shortsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shorts',
  component: ShortsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  exploreRoute,
  shortsRoute,
  profileRoute,
  messagesRoute,
  uploadRoute,
]);
