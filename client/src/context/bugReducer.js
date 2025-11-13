/**
 * Bug Reducer
 * Manages bug state transitions
 */

export const ACTIONS = {
  SET_BUGS: 'SET_BUGS',
  ADD_BUG: 'ADD_BUG',
  UPDATE_BUG: 'UPDATE_BUG',
  DELETE_BUG: 'DELETE_BUG',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
};

export const bugReducer = (state, action) => {
  switch (action.type) {
  case ACTIONS.SET_BUGS:
    return {
      ...state,
      bugs: action.payload,
      loading: false,
      error: null,
    };

  case ACTIONS.ADD_BUG:
    return {
      ...state,
      bugs: [action.payload, ...state.bugs],
      error: null,
    };

  case ACTIONS.UPDATE_BUG:
    return {
      ...state,
      bugs: state.bugs.map((bug) =>
        bug._id === action.payload._id || bug.id === action.payload.id
          ? action.payload
          : bug
      ),
      error: null,
    };

  case ACTIONS.DELETE_BUG:
    return {
      ...state,
      bugs: state.bugs.filter(
        (bug) => bug._id !== action.payload && bug.id !== action.payload
      ),
      error: null,
    };

  case ACTIONS.SET_LOADING:
    return {
      ...state,
      loading: action.payload,
    };

  case ACTIONS.SET_ERROR:
    return {
      ...state,
      error: action.payload,
      loading: false,
    };

  case ACTIONS.SET_FILTERS:
    return {
      ...state,
      filters: {
        ...state.filters,
        ...action.payload,
      },
    };

  case ACTIONS.CLEAR_FILTERS:
    return {
      ...state,
      filters: {
        search: '',
        priority: [],
        severity: [],
        status: [],
      },
    };

  default:
    return state;
  }
};
