export const URLS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CUENTAS: {
    LIST: "/cuentas",
    CREATE: "/cuentas/create",
    EDIT: "/cuentas/edit/:id",
  },
  USUARIOS: {
    LIST: "/usuarios",
    CREATE: "/usuarios/create",
    EDIT: "/usuarios/edit/:id",
  },
  BENEFICIARIOS: {
    LIST: "/beneficiarios",
    CREATE: "/beneficiarios/create",
    EDIT: "/beneficiarios/edit/:id",
  },
  TRANSACCIONES: {
    LIST: "/transacciones",
    CREATE: "/transacciones/create",
    VER: "/cuentas/:cuentaId/transacciones", 
    POR_CUENTA: "/cuentas/:cuentaId/transacciones",
  },
};
