/**
 * Bug Context
 * Global state management for bugs
 */

import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { bugReducer } from './bugReducer';

const BugContext = createContext();

const initialState = {
  bugs: [],
  loading: true,
  error: null,
  filters: {
    search: '',
    priority: [],
    severity: [],
    status: [],
  },
};

export const BugProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bugReducer, initialState);

  return (
    <BugContext.Provider value={{ state, dispatch }}>
      {children}
    </BugContext.Provider>
  );
};

BugProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useBugContext = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugContext must be used within a BugProvider');
  }
  return context;
};

export default BugContext;
