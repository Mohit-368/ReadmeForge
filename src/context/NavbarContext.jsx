import { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [extraContent, setExtraContent] = useState(null);

  return (
    <NavbarContext.Provider value={{ extraContent, setExtraContent }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarExtra() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbarExtra must be used within a NavbarProvider');
  }
  return context;
}
