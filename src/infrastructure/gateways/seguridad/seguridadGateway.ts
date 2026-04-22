import type { SeguridadGateway } from '../../../application/seguridad/seguridadAppService';
import { AuthService } from '../../servicios/api/seguridad/AuthService';
import { UsuarioService } from '../../servicios/api/seguridad/UsuarioService';
import { PerfilService } from '../../servicios/api/seguridad/PerfilService';
import { PermisoService } from '../../servicios/api/seguridad/PermisoService';
import { ModuloService } from '../../servicios/api/seguridad/ModuloService';
import { PaginaService } from '../../servicios/api/seguridad/PaginaService';
import { BotonService } from '../../servicios/api/seguridad/BotonService';

export const createSeguridadGateway = (): SeguridadGateway => {
  return {
    auth: {
      login: AuthService.login,
    },
    usuarios: {
      getAll: UsuarioService.getAll,
      create: UsuarioService.create,
      update: UsuarioService.update,
      remove: UsuarioService.remove,
    },
    perfiles: {
      getAll: PerfilService.getAll,
      create: PerfilService.create,
      update: PerfilService.update,
      remove: PerfilService.remove,
    },
    permisos: {
      getMenu: PermisoService.getMenu,
      getPermisos: PermisoService.getPermisos,
      setPermisos: PermisoService.setPermisos,
    },
    modulos: {
      getAll: ModuloService.getAll,
      create: ModuloService.create,
      update: ModuloService.update,
      remove: ModuloService.remove,
    },
    paginas: {
      getAll: PaginaService.getAll,
      create: PaginaService.create,
      update: PaginaService.update,
      remove: PaginaService.remove,
    },
    botones: {
      getAll: BotonService.getAll,
      create: BotonService.create,
      update: BotonService.update,
      remove: BotonService.remove,
    },
  };
};
