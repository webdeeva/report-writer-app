import { Link } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-alt">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-secondary mb-4">Page Not Found</h2>
        <p className="text-secondary mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/login'}
          className="btn btn-primary"
        >
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
