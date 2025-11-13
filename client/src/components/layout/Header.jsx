/**
 * Header Component
 * Top navigation header with user info and logout
 */

import PropTypes from 'prop-types';
import { Menu, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = ({ onCreateBug, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-secondary border-b border-border px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 hover:bg-tertiary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-text-primary" />
          </button>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-text-primary">
              Bug Board
            </h2>
            <p className="text-sm text-text-tertiary hidden sm:block">
              Track and manage bugs efficiently
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-tertiary rounded-lg">
              <User size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">{user.name}</span>
            </div>
          )}

          <Button
            onClick={onCreateBug}
            variant="primary"
            size="md"
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create Bug</span>
          </Button>

          {/* Logout Button */}
          <button
            onClick={logout}
            data-testid="logout-button"
            className="p-2 hover:bg-tertiary rounded-lg transition-colors group"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={20} className="text-text-secondary group-hover:text-text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onCreateBug: PropTypes.func.isRequired,
  onToggleMobileMenu: PropTypes.func,
};

export default Header;
