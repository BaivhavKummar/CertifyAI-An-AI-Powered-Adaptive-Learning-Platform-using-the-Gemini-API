
import React, { useState, useCallback, useMemo } from 'react';
import { User, Role } from './types';
import { MOCK_USERS } from './constants';
import Login from './components/shared/Login';
import StudentDashboard from './components/student/StudentDashboard';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import Header from './components/shared/Header';

export const UserContext = React.createContext<{
  user: User | null;
  logout: () => void;
}>({
  user: null,
  logout: () => {},
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = useCallback((username: string) => {
    const foundUser = MOCK_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
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
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {renderContent()}
      </div>
    </UserContext.Provider>
  );
};

export default App;
