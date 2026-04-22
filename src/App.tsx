import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './presentation/features/auth/context/AuthContext';
import { InactivitySessionMonitor } from './presentation/features/auth/components/InactivitySessionMonitor';
import AppRouter from './presentation/router/AppRouter';
import { AppContainerProvider } from './infrastructure/di/AppContainerProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContainerProvider>
        <AuthProvider>
          <InactivitySessionMonitor />
          <AppRouter />
          <ToastContainer position="top-right" autoClose={3500} />
        </AuthProvider>
      </AppContainerProvider>
    </QueryClientProvider>
  );
}

export default App;
