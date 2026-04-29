import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

import Clientes from '../features/creditos/pages/Clientes';
import Cobranza from '../features/cobranza/pages/Cobranza';
import Cortes from '../features/creditos/pages/Cortes';
import Creditos from '../features/creditos/pages/Creditos';
import Movimientos from '../features/creditos/pages/Movimientos';
import HomePage from '../features/home/pages/Home';
import DetalleCredito from '../features/creditos/pages/DetalleCredito';
import EstadoCuentaCredito from '../features/creditos/pages/EstadoCuentaCredito';
import CondonacionCredito from '../features/creditos/pages/CondonacionCredito';
import NuevoCredito from '../features/creditos/pages/NuevoCredito';
import Pendientes from '../features/cobranza/pages/Pendientes';
import Reestructura from '../features/creditos/pages/Reestructura';
import ConfiguracionSistema from '../features/general/pages/ConfiguracionSistema';
import ZonasCobranza from '../features/general/pages/ZonasCobranza';
import Auditoria from '../features/general/pages/Auditoria';
import Feriados from '../features/general/pages/Feriados';
import UsuariosSistema from '../features/seguridad/pages/Usuarios';
import PerfilesSistema from '../features/seguridad/pages/Perfiles';
import PermisosSistema from '../features/seguridad/pages/Permisos';
import ElementosSistema from '../features/seguridad/pages/ElementosSistema';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Layout>
              <Clientes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cortes"
        element={
          <ProtectedRoute>
            <Layout>
              <Cortes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/config"
        element={
          <ProtectedRoute>
            <Layout>
              <ConfiguracionSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/configuracion"
        element={
          <ProtectedRoute>
            <Layout>
              <ConfiguracionSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/zonas"
        element={
          <ProtectedRoute>
            <Layout>
              <ZonasCobranza />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/auditoria"
        element={
          <ProtectedRoute>
            <Layout>
              <Auditoria />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/general/feriados"
        element={
          <ProtectedRoute>
            <Layout>
              <Feriados />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/sistema/usuarios" element={<Navigate to="/seguridad/usuarios" replace />} />
      <Route path="/sistema/perfiles" element={<Navigate to="/seguridad/perfiles" replace />} />
      <Route path="/sistema/permisos" element={<Navigate to="/seguridad/permisos" replace />} />
      <Route path="/sistema/elementos" element={<Navigate to="/seguridad/elementos" replace />} />

      <Route
        path="/seguridad/usuarios"
        element={
          <ProtectedRoute>
            <Layout>
              <UsuariosSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/perfiles"
        element={
          <ProtectedRoute>
            <Layout>
              <PerfilesSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/permisos"
        element={
          <ProtectedRoute>
            <Layout>
              <PermisosSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/elementos"
        element={
          <ProtectedRoute>
            <Layout>
              <ElementosSistema />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/auditoria"
        element={
          <ProtectedRoute>
            <Layout>
              <Auditoria />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguridad/feriados"
        element={
          <ProtectedRoute>
            <Layout>
              <Feriados />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/creditos/nuevo"
        element={
          <ProtectedRoute>
            <Layout>
              <NuevoCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id/reestructura"
        element={
          <ProtectedRoute>
            <Layout>
              <Reestructura />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id/estado-cuenta"
        element={
          <ProtectedRoute>
            <Layout>
              <EstadoCuentaCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id/condonacion"
        element={
          <ProtectedRoute>
            <Layout>
              <CondonacionCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DetalleCredito />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/creditos"
        element={
          <ProtectedRoute>
            <Layout>
              <Creditos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/movimientos"
        element={
          <ProtectedRoute>
            <Layout>
              <Movimientos />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pendientes"
        element={
          <ProtectedRoute>
            <Layout>
              <Pendientes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cobranza"
        element={
          <ProtectedRoute>
            <Layout>
              <Cobranza />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
