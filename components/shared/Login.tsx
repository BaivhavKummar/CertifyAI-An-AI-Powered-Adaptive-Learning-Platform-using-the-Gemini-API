
import React, { useState } from 'react';
import { Role } from '../../types';
import Button from './Button';
import { BookOpenIcon, UserIcon } from '../icons/Icons';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>(Role.Student);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') {
        setError('Please enter a username.');
        return;
    }
    // Simple mock logic: student logs in with 'student', instructor with 'instructor'
    if (
        (role === Role.Student && username.toLowerCase() !== 'student') ||
        (role === Role.Instructor && username.toLowerCase() !== 'instructor')
    ) {
        setError(`Invalid username for ${role}. Use '${role.toLowerCase()}' to log in.`);
        return;
    }
    setError('');
    onLogin(username);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900/50">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
            <BookOpenIcon className="w-16 h-16 mx-auto text-blue-400" />
            <h1 className="mt-4 text-3xl font-extrabold text-white">Adaptive Learning Platform</h1>
            <p className="mt-2 text-gray-400">Powered by Gemini AI</p>
        </div>
        
        <div className="flex p-1 bg-gray-700 rounded-full">
            <button
                onClick={() => setRole(Role.Student)}
                className={`w-1/2 py-2.5 text-sm font-semibold leading-5 text-center rounded-full transition-colors duration-300
                ${role === Role.Student ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
                Student
            </button>
            <button
                onClick={() => setRole(Role.Instructor)}
                className={`w-1/2 py-2.5 text-sm font-semibold leading-5 text-center rounded-full transition-colors duration-300
                ${role === Role.Instructor ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
                Instructor
            </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder={`Enter username (try '${role.toLowerCase()}')`}
                />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full">
              Sign In as {role === Role.Student ? 'Student' : 'Instructor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
