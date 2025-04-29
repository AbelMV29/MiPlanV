import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import Home from '../Pages/Home';
import Register from '../Pages/Register/index';
import Users from '../Pages/Users/index';
import Menu from '../Pages/Menu/index';
import PrivateRoute from './PrivateRoute.tsx';
import AdminRoute from './AdminRoute.tsx';
import Layout from '../layout/Layout.tsx';
import AdminLayout from '../layout/AdminLayout.tsx';
import NotFound from '../Pages/NotFound/index';

// Páginas de administración
import AdminDashboard from '../Pages/Admin/Dashboard/index';
import AdminUsers from '../Pages/Admin/Users/index';
import AdminProducts from '../Pages/Admin/Products/Index.tsx';
import CreateProduct from '../Pages/Admin/Products/CreateProduct.tsx';
import { EditProduct } from '../Pages/Admin/Products/EditProduct.tsx';

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
            {
                path: '/menu',
                element: <Menu />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
    {
        path: '/admin',
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                path: '',
                element: <AdminDashboard />,
            },
            {
                path: 'usuarios',
                element: <AdminUsers />,
            },
            {
                path: 'productos',
                element: <AdminProducts />,
            },
            {
                path: 'productos/crear',
                element:<CreateProduct/>
            },
            {
                path: 'productos/editar/:id',
                element: <EditProduct />,
            },
            {
                path: 'facturas',
                element: <div>Gestión de Facturas</div>,
            },
            {
                path: 'campanas',
                element: <div>Gestión de Campañas</div>,
            },
            {
                path: 'configuracion',
                element: <div>Configuración</div>,
            },
        ],
    },
]); 