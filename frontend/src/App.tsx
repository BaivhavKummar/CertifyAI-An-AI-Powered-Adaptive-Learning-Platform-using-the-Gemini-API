
import React, { useState, useCallback, useMemo } from 'react';
import { User, Role } from './types';
import Login from './components/shared/Login';
import StudentDashboard from './components/student/StudentDashboard';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import Header from './components/shared/Header';
import { apiLogin } from './services/api';

export const UserContext = React.createContext<{
  user: User | null;
  logout: () => void;
}>({
  user: null,
  logout: () => {},
});

const svgPattern = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="rgba(147, 51, 234, 0.08)" cx="10" cy="10" r="1"/></svg>`;
const backgroundImageUrl = `url("data:image/svg+xml,${encodeURIComponent(svgPattern)}")`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = useCallback(async (username: string) => {
    try {
      const loggedInUser = await apiLogin(username);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
      return loggedInUser;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  const contextValue = useMemo(() => ({ user, logout: handleLogout }), [user, handleLogout]);

  const renderContent = () => {
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }
    return (
      <>
        <Header />
        {user.role === Role.Student ? <StudentDashboard /> : <InstructorDashboard />}
      </>
    );
  };

  return (
    <UserContext.Provider value={contextValue}>
      <div 
        className="min-h-screen bg-gray-900 text-gray-100"
        style={{ backgroundImage: backgroundImageUrl, backgroundAttachment: 'fixed' }}
      >
        {renderContent()}
      </div>
    </UserContext.Provider>
  );
};

export default App;
