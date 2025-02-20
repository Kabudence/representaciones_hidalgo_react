import axios from "axios";

const api = axios.create({
    baseURL: "https://web-production-927a.up.railway.app/api", // URL de tu backend

});

// Interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
    (config) => {
        const authData = JSON.parse(sessionStorage.getItem("authData"));
        if (authData?.token) {
            config.headers["Authorization"] = `Bearer ${authData.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar la lógica de refresh token
api.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, simplemente devolverla
    async (error) => {
        const originalRequest = error.config;

        // Si obtenemos un 401 (token caducado) y no hemos intentado refrescar ya
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marcar que ya intentamos refrescar para evitar loops infinitos

            try {
                const authData = JSON.parse(sessionStorage.getItem("authData"));
                const refreshToken = authData?.refreshToken;

                if (!refreshToken) {
                    throw new Error("No se encontró el refresh token");
                }

                // Solicitar un nuevo token de acceso
                const refreshResponse = await axios.post(
                    "https://web-production-927a.up.railway.app/api/auth/refresh",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );

                const newAccessToken = refreshResponse.data.access_token;

                // Actualizar el token en sessionStorage
                sessionStorage.setItem(
                    "authData",
                    JSON.stringify({ ...authData, token: newAccessToken })
                );

                // Volver a intentar la solicitud original con el nuevo token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {

                // Si el refresh falla, cerrar sesión
                sessionStorage.removeItem("authData");
                window.location.href = "/"; // Redirigir al inicio de sesión
            }
        }

        return Promise.reject(error); // Propagar otros errores
    }
);

export default api;
