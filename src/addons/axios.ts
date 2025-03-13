import axios from 'axios';

// Crear una instancia de Axios con configuración base
const instance = axios.create({
  baseURL: 'http://localhost:3000', // URL base de tu API
  withCredentials: true, // Permitir el envío de cookies o credenciales
});

// Interceptor para solicitudes
instance.interceptors.request.use(
  (config) => {
    // Recuperar el token almacenado en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Agregar el encabezado Authorization con el token
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Retornar la configuración modificada
  },
  (error) => {
    // Manejar errores en la configuración de la solicitud
    return Promise.reject(error);
  }
);

// Interceptor para respuestas (opcional)
instance.interceptors.response.use(
  (response) => {
    // Manejar respuestas exitosas
    return response;
  },
  (error) => {
    // Manejar errores en la respuesta
    console.error('Error en la respuesta:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default instance;
