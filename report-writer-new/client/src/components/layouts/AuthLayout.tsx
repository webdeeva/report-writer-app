import { Outlet } from 'react-router-dom';

/**
 * Layout for authentication pages (login, register, etc.)
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-alt">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            {import.meta.env.VITE_APP_NAME || 'Report Writer'}
          </h1>
          <p className="text-secondary mt-2">Generate personalized card-based reports</p>
        </div>
        
        {/* Outlet for nested routes (login, register, etc.) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
