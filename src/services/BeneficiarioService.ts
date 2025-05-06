
import axios from "axios";
import { BeneficiarioRequest } from "../models/BeneficiarioRequest";

const API_BASE = "http://localhost:8000/banco";

export const BeneficiarioService = {
  getPorUsuario: async (usuarioId: number, token: string) => {
    const response = await axios.get(`${API_BASE}/beneficiarios/usuario/${usuarioId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  crear: async (data: BeneficiarioRequest, token: string) => {
    const response = await axios.post(`${API_BASE}/beneficiarios/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  actualizar: async (id: number, data: BeneficiarioRequest, token: string) => {
    const response = await axios.put(`${API_BASE}/beneficiarios/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  eliminar: async (id: number, token: string) => {
    await axios.delete(`${API_BASE}/beneficiarios/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
