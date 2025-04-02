import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Home: React.FC = () => {
    const { isAuthenticated, logout } = useAuthStore();

    return (
        <div className="container">
            <header className="card">
                <h1>Bienvenido a MiPlanV</h1>
                <nav>
                    {isAuthenticated ? (
                        <>
                            <Link to="/users" className="btn">Usuarios</Link>
                            <button onClick={logout} className="btn" style={{ marginLeft: '1rem' }}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn">Iniciar Sesión</Link>
                            <Link to="/register" className="btn" style={{ marginLeft: '1rem' }}>
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </header>
            
            <main className="card">
                <h2>Sobre MiPlanV</h2>
                <p>
                    MiPlanV es una plataforma diseñada para ayudarte a organizar y gestionar tus planes
                    de manera eficiente. Con nuestra aplicación, podrás:
                </p>
                <ul>
                    <li>Crear y gestionar tus planes</li>
                    <li>Organizar tus actividades diarias</li>
                    <li>Establecer objetivos y seguirlos</li>
                    <li>Colaborar con otros usuarios</li>
                </ul>
            </main>
        </div>
    );
};

export default Home; 