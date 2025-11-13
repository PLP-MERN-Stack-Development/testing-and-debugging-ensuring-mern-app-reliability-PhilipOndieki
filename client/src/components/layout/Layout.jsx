/**
 * Layout Component
 * Main application layout with sidebar
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed top-0 left-0 h-full">
        <Sidebar />
      </aside>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {children({ toggleMobileMenu })}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Layout;
