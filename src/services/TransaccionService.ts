import axios from "axios";
import { TransaccionRequest } from "../models/TransaccionRequest";
import { TransaccionResponse } from "../models/TransaccionResponse";

const API_BASE = "http://localhost:8000/banco";

export const TransaccionService = {
  registrar: async (data: TransaccionRequest, token: string): Promise<void> => {
    await axios.post(`${API_BASE}/transacciones/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getPorCuenta: async (cuentaId: number, token: string): Promise<TransaccionResponse[]> => {
    const response = await axios.get(`${API_BASE}/transacciones/cuenta/${cuentaId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
