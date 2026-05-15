import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './components/ui/Toast';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import PageTransition from './components/shared/PageTransition';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <PageTransition />
          <Navbar />
          <AppRoutes />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
