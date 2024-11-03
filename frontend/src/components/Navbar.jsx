  import { Link, useLocation } from 'react-router-dom';

  const Navbar = () => {
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('user'));


    const handleLogout = () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      sessionStorage.removeItem('user');
      window.location.reload();
    };

    return (
      <nav className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                SCD
              </Link>
            </div>
            <div className="flex">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/' ? 'bg-primary-foreground text-primary' : 'hover:bg-primary-foreground/10'
                }`}
              >
                Home
              </Link>
            
              {user ? (
                <>
                  <Link 
                    to="/create-post" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/create-post' ? 'bg-primary-foreground text-primary' : 'hover:bg-primary-foreground/10'
                    }`}
                  >
                    Create Post
                  </Link>
                  {user.role === 'superUser' && (
                    <Link 
                      to="/user-management" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/user-management' ? 'bg-primary-foreground text-primary' : 'hover:bg-primary-foreground/10'
                      }`}
                    >
                      User Management
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/login' ? 'bg-primary-foreground text-primary' : 'hover:bg-primary-foreground/10'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;