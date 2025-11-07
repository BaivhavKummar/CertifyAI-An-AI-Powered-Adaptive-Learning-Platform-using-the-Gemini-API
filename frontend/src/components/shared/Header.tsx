
import React, { useContext } from 'react';
import { UserContext } from '../../App';
import Button from './Button';
import { BookOpenIcon, LogoutIcon } from '../icons/Icons';

const Header: React.FC = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">Adaptive Learning</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className='text-right'>
                <span className="text-gray-300 font-medium">{user?.username}</span>
                <span className="text-xs text-amber-400 block">{user?.role}</span>
            </div>
            <Button onClick={logout} variant="secondary" size="sm">
              <LogoutIcon className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
