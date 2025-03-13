import axios from 'axios';
import type ILogin from '@/interfaces/Ilogin';
import { permissionLevel } from '@/store/store';

// Servicio de login
export async function loginService(userData: ILogin) {
  try {
    // Realizar la solicitud de login al backend
    const response = await axios.post(
      'http://localhost:3000/login', // URL del endpoint de login
      userData, // Datos del usuario enviados en el cuerpo de la solicitud
      {
        headers: {
          'Content-Type': 'application/json', // Asegurar el encabezado correcto
        },
        withCredentials: true, // Habilitar credenciales para cookies o tokens
      }
    );

    // Obtener el token desde la respuesta
    const token = response.data.token;

    // Establecer el nivel de permisos (valor de ejemplo: 9)
    permissionLevel.value = 9;

    // Guardar el token en el almacenamiento local para futuras solicitudes
    localStorage.setItem('token', token);

    // Retornar los datos de la respuesta
    return response.data;
  } catch (error) {
    // Manejar errores en la solicitud
    console.error('Error en la solicitud:', error);
    throw error; // Propagar el error para que el llamador lo maneje
  }
}
