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

export const API_ENDPOINTS_FINANZAS = {
  CLIENTES: '/api/finanzas/clientes',
  CLIENTE_BY_ID: '/api/finanzas/clientes/{id}',
  CLIENTE_CREDITOS: '/api/finanzas/clientes/{id}/creditos',
  CREDITOS: '/api/finanzas/creditos',
  CREDITO_BY_ID: '/api/finanzas/creditos/{id}',
  ABONO_FICHA: '/api/finanzas/creditos/{creditoId}/fichas/{numeroFicha}/abonos',
  MULTA_FICHA: '/api/finanzas/creditos/{creditoId}/fichas/{numeroFicha}/multas',
  REESTRUCTURAR: '/api/finanzas/creditos/{creditoId}/reestructura',
  CONDONAR_INTERES: '/api/finanzas/creditos/{creditoId}/fichas/{numeroFicha}/condonacion',
  CONDONAR_INTERES_MONTO: '/api/finanzas/creditos/{creditoId}/condonacion-monto',
  ACTUALIZAR_OBSERVACION: '/api/finanzas/creditos/{creditoId}/observacion',
  APLICAR_MORA: '/api/finanzas/creditos/aplicar-mora',
  CREDITO_MOVIMIENTOS: '/api/finanzas/creditos/{id}/movimientos',
  CAJA_TURNO: '/api/finanzas/caja/turno',
  CAJA_MOVIMIENTOS: '/api/finanzas/caja/movimientos',
  CAJA_LIQUIDACIONES_RESUMEN: '/api/finanzas/caja/liquidaciones/resumen',
  CAJA_CORTE: '/api/finanzas/caja/corte',
  CAJA_CIERRE_DIARIO: '/api/finanzas/caja/cierre-diario',
  CAJA_MOVIMIENTOS_MARCAR_RECIBIDO: '/api/finanzas/caja/movimientos/marcar-recibido-caja',
  CORTES: '/api/finanzas/cortes',
  REPORTES: '/api/finanzas/reportes',
  DASHBOARD_RESUMEN: '/api/finanzas/dashboard/resumen',
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
} as const;
