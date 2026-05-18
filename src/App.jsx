import LanguageSelector from './components/LanguageSelector';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './components/ui/Toast';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '10px 20px',
            }}
          >
          </div>

          <AppRoutes />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}