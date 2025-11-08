import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useSupabaseData';
import { UserCircleIcon, PlusIcon, LogoutIcon } from './icons/Icons';
import AddTeamMemberModal from './AddTeamMemberModal';

const ProfileMenu: React.FC = () => {
  const { user, business, logout } = useAuth();
  const { users, addUser } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddMemberClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsOpen(false);
      setIsModalOpen(true);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Open user menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {user ? (
          user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
            {user && business && (
                <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.role} at {business.name}</p>
                </div>
            )}
            
            <a href="#" onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              My Profile
            </a>

            <div className="border-t border-gray-100">
                <a href="#" onClick={handleAddMemberClick} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Member
                </a>
            </div>

            <div className="border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <LogoutIcon className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
            </div>
          </div>
        </div>
      )}
      <AddTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProfileMenu;
