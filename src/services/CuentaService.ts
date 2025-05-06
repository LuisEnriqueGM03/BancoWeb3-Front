import axios from "axios";
import { CuentaResponse } from "../models/CuentaResponse";
import { CuentaCreateRequest } from "../models/CuentaCreateRequest";

const API_BASE = "http://localhost:8000/banco";

export const CuentaService = {
  getCuentasPorUsuario: async (userId: number, token: string): Promise<CuentaResponse[]> => {
    const response = await axios.get(`${API_BASE}/cuentas/usuario/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  actualizarSaldo: async (
    cuentaId: number,
    data: { saldo: number; nro_cuenta: string; usuario: number },
    token: string
  ): Promise<void> => {
    await axios.put(`${API_BASE}/cuentas/${cuentaId}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },  

  getCuentaPorNumero: async (nroCuenta: string, token: string): Promise<CuentaResponse> => {
    const response = await axios.get(`${API_BASE}/cuentas/numero/${nroCuenta}`, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  },  

  createCuenta: async (data: CuentaCreateRequest, token: string) => {
    const response = await axios.post(`${API_BASE}/cuentas/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getCuentaPorId: async (cuentaId: number, token: string): Promise<CuentaResponse> => {
    const response = await axios.get(`${API_BASE}/cuentas/${cuentaId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
};
