import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home';
import Register from '../Pages/Register/index';
import Users from '../Pages/Users/index';
import PrivateRoute from './PrivateRoute.tsx';
import Layout from '../layout/Layout.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/users',
                element: (
                    <PrivateRoute>
                        <Users />
                    </PrivateRoute>
                ),
            },
        ],
    },
]); 