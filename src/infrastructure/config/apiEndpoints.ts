const normalizeBaseUrl = (value: string): string => {
  if (!value) return value;
  return value.endsWith('/') ? value : `${value}/`;
};

export const API_BASE_URLS = {
  SERVER: normalizeBaseUrl(import.meta.env.VITE_API_URL ?? 'https://api-solucionesgs.pizzerialalosmid.com.mx/'),
} as const;

export const API_ENDPOINTS_SEGURIDAD = {
  LOGIN: '/api/autenticacion/login',
  REFRESH: '/api/autenticacion/refresh',
  CAMBIAR_PASSWORD: '/api/autenticacion/cambiar-password',

  USUARIOS: '/api/seguridad/usuarios',
  USUARIOS_RESET_PASSWORD: '/api/seguridad/usuarios/{id}/reset-password',
  PERFILES: '/api/seguridad/perfiles',
  MODULOS: '/api/seguridad/modulos',
  PAGINAS: '/api/seguridad/paginas',
  BOTONES: '/api/seguridad/botones',

  PERFIL_MENU: '/api/seguridad/perfiles/{idPerfil}/menu',
  PERFIL_PERMISOS_GET: '/api/seguridad/perfiles/{idPerfil}/permisos',
  PERFIL_PERMISOS_POST: '/api/seguridad/perfiles/{idPerfil}/permisos',
} as const;

export const API_ENDPOINTS_GENERAL = {
  CONFIGURACION: '/api/general/configuracion',
  ZONAS: '/api/general/zonas',
  AUDITORIA: '/api/general/auditoria',
  FERIADOS: '/api/general/feriados',
} as const;

/** Rutas HTTP del módulo de créditos en el backend (`api/creditos`). */
export const API_ENDPOINTS_CREDITOS = {
  CLIENTES: '/api/creditos/clientes',
  CLIENTE_BY_ID: '/api/creditos/clientes/{id}',
  CLIENTE_CREDITOS: '/api/creditos/clientes/{id}/creditos',
  CREDITOS: '/api/creditos/creditos',
  CREDITO_BY_ID: '/api/creditos/creditos/{id}',
  ABONO_FICHA: '/api/creditos/creditos/{creditoId}/fichas/{numeroFicha}/abonos',
  MULTA_FICHA: '/api/creditos/creditos/{creditoId}/fichas/{numeroFicha}/multas',
  REESTRUCTURAR: '/api/creditos/creditos/{creditoId}/reestructura',
  CONDONAR_INTERES: '/api/creditos/creditos/{creditoId}/fichas/{numeroFicha}/condonacion',
  CONDONAR_INTERES_MONTO: '/api/creditos/creditos/{creditoId}/condonacion-monto',
  ACTUALIZAR_OBSERVACION: '/api/creditos/creditos/{creditoId}/observacion',
  APLICAR_MORA: '/api/creditos/creditos/aplicar-mora',
  CREDITO_MOVIMIENTOS: '/api/creditos/creditos/{id}/movimientos',
  CORTES: '/api/creditos/cortes',
  REPORTES: '/api/creditos/reportes',
  DASHBOARD_RESUMEN: '/api/creditos/dashboard/resumen',
  DASHBOARD_MOVIMIENTOS: '/api/creditos/dashboard/movimientos',
} as const;

export const API_ENDPOINTS_COBRANZA = {
  PENDIENTES: '/api/cobranza/pendientes',
  COBRANZA: '/api/cobranza/cobranza',

  LIQUIDACIONES: '/api/cobranza/liquidaciones',
  LIQUIDACIONES_RESUMEN_PENDIENTE: '/api/cobranza/liquidaciones/pendiente/resumen',
  LIQUIDACIONES_HISTORIAL: '/api/cobranza/liquidaciones/historial',
  LIQUIDACIONES_ALL: '/api/cobranza/liquidaciones/all',
  LIQUIDACIONES_COBRADORES_RESUMEN: '/api/cobranza/liquidaciones/cobradores/resumen',
  LIQUIDACIONES_COBRADOR_MOVIMIENTOS_PENDIENTES: '/api/cobranza/liquidaciones/cobradores/{cobradorId}/movimientos-pendientes',
  LIQUIDACIONES_CONFIRMAR: '/api/cobranza/liquidaciones/{id}/confirmar',
  LIQUIDACIONES_RECHAZAR: '/api/cobranza/liquidaciones/{id}/rechazar',
  LIQUIDACIONES_MARCAR_RECIBIDO_CAJA: '/api/cobranza/liquidaciones/movimientos/marcar-recibido-caja',
} as const;
