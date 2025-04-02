import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register/index';
import Users from '../Pages/Users/index';
import PrivateRoute from './PrivateRoute.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
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
]); 