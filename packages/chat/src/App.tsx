import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import Chat from './baseblocks/chat/pages/Chat';
import User, { userLoader } from './baseblocks/user/pages/User';
import Subscription from './baseblocks/subscription/pages/Subscription';
import {
  createRequestHandler,
  getRequestHandler,
} from '@baseline/client-api/request-handler';
import { AxiosRequestConfig } from 'axios';
import Home from './baseblocks/home/pages/Home';
import Login from './baseblocks/login/pages/Login';
import Layout from './components/layout/Layout';
import Loader from './components/page-content/loader/Loader';

Amplify.configure({
  Auth: {
    Cognito: {
      signUpVerificationMethod: 'code',
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID || '',
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
      userPoolClientId:
        process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID || '',
    },
  },
});

export default function App() {
  useEffect(() => {
    return Hub.listen('auth', (data) => {
      console.debug('auth event', data.payload.event);
      switch (data.payload.event) {
        case 'signedIn':
          router.navigate('/chat').catch((e) => console.error(e));
          break;
        case 'signedOut':
          router.navigate('/').catch((e) => console.error(e));
          break;
        case 'signInWithRedirect_failure':
          break;
        case 'tokenRefresh':
          break;
        default:
          console.debug(`Unhandled event: ${data.payload.event}`);
      }
    });
  }, []);

  return (
    <RouterProvider
      router={router}
      fallbackElement={<Loader hasStartedLoading={true} />}
    />
  );
}

async function protectedLoader() {
  console.debug('protected loader');
  if (!getRequestHandler()) {
    console.debug('creating request handler');
    createRequestHandler(
      async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        const authSession = await fetchAuthSession();
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${authSession?.tokens?.idToken}`;
        return config;
      },
    );
  }
  const authSession = await fetchAuthSession();
  if (!authSession?.tokens?.idToken) {
    return redirect('/login');
  }
  return null;
}

async function loginLoader() {
  console.debug('login loader');
  const authSession = await fetchAuthSession();
  if (authSession?.tokens?.idToken) {
    console.debug('redirecting to chat');
    return redirect('/chat');
  }
  return null;
}

const router = createBrowserRouter([
  {
    id: 'public',
    path: '/',
    Component: Outlet,
    children: [
      { path: '/', Component: Home, index: true },
      { path: '/login', Component: Login, loader: loginLoader },
    ],
  },
  {
    id: 'protected',
    path: '/',
    Component: Layout,
    loader: protectedLoader,
    children: [
      { path: '/chat', Component: Chat },
      { path: '/subscription', Component: Subscription },
      { path: '/settings', Component: User, loader: userLoader },
    ],
  },
]);
