/**
 * Sidebar Component
 * Navigation sidebar
 */

import PropTypes from 'prop-types';
import { Bug, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const Sidebar = ({ onClose }) => {
  const navItems = [
    { to: '/', label: 'Bug Board', icon: Bug },
    { to: '/stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="h-full flex flex-col bg-secondary border-r border-border">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Bug size={32} className="text-accent-primary" />
          <div>
            <h1 className="text-xl font-bold text-text-primary">Bug Tracker</h1>
            <p className="text-xs text-text-tertiary">Professional Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                'hover:bg-tertiary',
                isActive ? 'bg-tertiary text-accent-primary' : 'text-text-secondary'
              )
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-tertiary text-center">
          © 2025 Bug Tracker
        </p>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onClose: PropTypes.func,
};

export default Sidebar;
