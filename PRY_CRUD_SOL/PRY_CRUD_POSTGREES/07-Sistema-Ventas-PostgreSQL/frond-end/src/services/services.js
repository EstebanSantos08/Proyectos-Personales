import api from './api';

// ===== SERVICIOS ACTIVOS CON BACKEND =====

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },
  
  registrar: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  
  getPerfil: async () => {
    const response = await api.get('/auth/profile');
    return response;
  }
};

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/productos', { params });
    return response;
  },
  
  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response;
  },
  
  create: async (data) => {
    const response = await api.post('/productos', data);
    return response;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/productos/${id}`, data);
    return response;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response;
  }
};

export const ventaService = {
  getAll: async (params = {}) => {
    const response = await api.get('/ventas', { params });
    return response;
  },
  
  getById: async (id) => {
    const response = await api.get(`/ventas/${id}`);
    return response;
  },
  
  create: async (data) => {
    const response = await api.post('/ventas', data);
    return response;
  },
  
  getReportes: async () => {
    const response = await api.get('/ventas/reportes');
    return response;
  },
  
  getVentasPorFecha: async (fechaInicio, fechaFin) => {
    const response = await api.get('/ventas/reportes/fecha', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
    });
    return response;
  },
  
  getProductosMasVendidos: async () => {
    const response = await api.get('/ventas/reportes/productos-mas-vendidos');
    return response;
  }
};

export const auditoriaService = {
  getAll: async (params = {}) => {
    const response = await api.get('/auditoria', { params });
    return response;
  },
  
  getReciente: async () => {
    const response = await api.get('/auditoria/reciente');
    return response;
  },
  
  getTriggers: async () => {
    const response = await api.get('/auditoria/triggers');
    return response;
  }
};

