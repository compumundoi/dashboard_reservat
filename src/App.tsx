import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { loginUser } from './services/authService';
import { getUserFromCookie, deleteCookie, setCookie, decodeJWT, getCookie, debugCookies } from './utils/auth';
import { LoginCredentials, UserData } from './types/auth';

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    console.log('🚀 Verificando sesión al cargar la aplicación...');
    debugCookies();
    const userData = getUserFromCookie();
    console.log('📊 Resultado de verificación de sesión:', userData ? 'USUARIO ENCONTRADO' : 'NO HAY SESIÓN');
    setUser(userData);
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando proceso de login...');
      const response = await loginUser(credentials);
      console.log('✅ Respuesta de login exitosa:', response);

      // Si el servidor devuelve un token, lo establecemos manualmente
      if (response.access_token) {
        console.log('🔐 Token recibido, estableciendo cookie...');
        setCookie('auth_token', response.access_token, 7);
        try {
          localStorage.setItem('auth_token', response.access_token);
        } catch (e) {
          console.warn('⚠️ No se pudo guardar token en localStorage:', e);
        }

        // Verificar que el token sea válido antes de guardarlo
        const testUserData = decodeJWT(response.access_token);
        if (!testUserData) {
          console.error('❌ Token recibido pero no es válido');
          throw new Error('Token recibido del servidor pero no es válido');
        }

        console.log('✅ Token válido y guardado en cookie:', testUserData.email);
        setUser(testUserData);
        try {
          localStorage.setItem('user_data', JSON.stringify(testUserData));
        } catch (e) {
          console.warn('⚠️ No se pudo guardar usuario en localStorage:', e);
        }
      } else {
        console.log('⚠️ No se recibió token en la respuesta, intentando obtener de cookies...');
        // Fallback: intentar leer la cookie establecida por el servidor
        const userData = getUserFromCookie();
        if (userData) {
          // guardar respaldo en localStorage
          try {
            localStorage.setItem('auth_token', getCookie('auth_token') || '');
            localStorage.setItem('user_data', JSON.stringify(userData));
          } catch (e) {
            console.warn('⚠️ No se pudo guardar respaldo de sesión en localStorage:', e);
          }
          console.log('✅ Usuario obtenido desde cookies:', userData.email);
          setUser(userData);
        } else {
          console.error('❌ No se pudo obtener token de ninguna fuente');
          setError('No se recibió token de acceso. Contacta al administrador.');
        }
      }

    } catch (err) {
      console.error('❌ Error en el proceso de login:', err);
      if (err instanceof Error) {
        // Personalizar mensajes de error según el tipo de error
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('Credenciales incorrectas. Usa las credenciales de prueba: donkk@example.com / 12345678');
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          setError('El usuario no tiene permisos de administrador.');
        } else if (err.message.includes('500')) {
          setError('Error interno del servidor. Inténtalo más tarde.');
        } else if (err.message.includes('fetch')) {
          setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Ha ocurrido un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    deleteCookie('auth_token');
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } catch (e) {
      console.warn('⚠️ No se pudo limpiar localStorage:', e);
    }
    setUser(null);
    setError(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary-500 font-medium animate-pulse">Cargando ReservaT...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-400/20 to-transparent blur-3xl animate-fade-in" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-complementario-1/10 to-transparent blur-3xl animate-fade-in" style={{ animationDelay: '0.2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-primary-600/10 to-transparent blur-3xl animate-fade-in" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Login form container */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;