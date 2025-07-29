import { createContext, useContext } from 'react';

// Replace 'unknown' with a more specific type if available
export const AuthContext = createContext<unknown>(null);
export const useAuth = () => useContext(AuthContext);
