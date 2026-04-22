import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';


import Caja from '../features/finanzas/pages/Caja';
import Clientes from '../features/finanzas/pages/Clientes';
import Cobranza from '../features/cobranza/pages/Cobranza';
import Cortes from '../features/finanzas/pages/Cortes';
import Creditos from '../features/finanzas/pages/Creditos';
import Dashboard from '../features/finanzas/pages/Dashboard';
import DetalleCredito from '../features/finanzas/pages/DetalleCredito';
import EstadoCuentaCredito from '../features/finanzas/pages/EstadoCuentaCredito';
import CondonacionCredito from '../features/finanzas/pages/CondonacionCredito';
import NuevoCredito from '../features/finanzas/pages/NuevoCredito';
import Pendientes from '../features/cobranza/pages/Pendientes';
import Liquidaciones from '../features/cobranza/pages/Liquidaciones';
import GestionLiquidaciones from '../features/cobranza/pages/GestionLiquidaciones';
import Reestructura from '../features/finanzas/pages/Reestructura';
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
          path="/caja"
          element={
            <ProtectedRoute>
              <Layout>
                <Caja />
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
          path="/cobranza/liquidaciones"
          element={
            <ProtectedRoute>
              <Layout>
                <Liquidaciones />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cobranza/gestion-liquidaciones"
          element={
            <ProtectedRoute>
              <Layout>
                <GestionLiquidaciones />
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
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
