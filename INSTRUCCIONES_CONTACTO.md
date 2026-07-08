# Instrucciones de Implementación - Formulario de Contacto

Este documento contiene las instrucciones completas para implementar el formulario de contacto con backend en WordPress y frontend en React.

## Arquitectura

```
Frontend (cuchaforas.cl)
    ↓ POST request
WordPress API (api.proyectocuchaforas.cl)
    ↓ Validación + hCaptcha
    ↓ Envío de email
Email del cliente (Gmail)
```

---

## Parte 1: Plugin WordPress

### Paso 1: Crear estructura del plugin

En tu WordPress (`api.proyectocuchaforas.cl`), crea la siguiente estructura de carpetas:

```
wp-content/plugins/cuchaforas-contacto/
├── cuchaforas-contacto.php
└── README.md
```

### Paso 2: Código del plugin

Crea el archivo `cuchaforas-contacto.php` con el siguiente contenido:

```php
<?php
/**
 * Plugin Name: Cuchaforas Contacto
 * Plugin URI: https://proyectocuchaforas.cl
 * Description: Custom REST endpoint para el formulario de contacto de Cuchaforas
 * Version: 1.0.0
 * Author: Cuchaforas
 * Author URI: https://proyectocuchaforas.cl
 * License: GPL v2 or later
 * Text Domain: cuchaforas-contacto
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase principal del plugin
 */
class Cuchaforas_Contacto {
    
    /**
     * Email destinatario de los mensajes
     * ⚠️ CAMBIAR ESTE VALOR CON EL EMAIL REAL DEL CLIENTE
     */
    private $email_destinatario = 'contacto@cuchaforas.cl';
    
    /**
     * Clave secreta de hCaptcha
     * ⚠️ OBTENER DE https://dashboard.hcaptcha.com
     */
    private $hcaptcha_secret_key = 'TU_CLAVE_SECRETA_AQUI';
    
    /**
     * Constructor
     */
    public function __construct() {
        // Registrar endpoint REST
        add_action('rest_api_init', array($this, 'registrar_endpoints'));
    }
    
    /**
     * Registrar endpoints REST API
     */
    public function registrar_endpoints() {
        register_rest_route('cuchaforas/v1', '/contacto', array(
            'methods' => 'POST',
            'callback' => array($this, 'procesar_contacto'),
            'permission_callback' => '__return_true',
            'args' => array(
                'nombre' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => array($this, 'sanitizar_texto'),
                    'validate_callback' => array($this, 'validar_no_vacio'),
                ),
                'email' => array(
                    'required' => true,
                    'type' => 'string',
                    'format' => 'email',
                    'sanitize_callback' => 'sanitize_email',
                    'validate_callback' => array($this, 'validar_email'),
                ),
                'mensaje' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => array($this, 'sanitizar_texto'),
                    'validate_callback' => array($this, 'validar_no_vacio'),
                ),
                'hcaptcha_token' => array(
                    'required' => true,
                    'type' => 'string',
                    'validate_callback' => array($this, 'validar_hcaptcha'),
                ),
            ),
        ));
    }
    
    /**
     * Procesar el formulario de contacto
     */
    public function procesar_contacto($request) {
        // Obtener datos
        $nombre = $request->get_param('nombre');
        $email = $request->get_param('email');
        $mensaje = $request->get_param('mensaje');
        $hcaptcha_token = $request->get_param('hcaptcha_token');
        
        // Verificar hCaptcha
        if (!$this->verificar_hcaptcha($hcaptcha_token)) {
            return new WP_Error(
                'hcaptcha_invalido',
                'Verificación de seguridad fallida. Por favor, intenta nuevamente.',
                array('status' => 400)
            );
        }
        
        // Preparar email
        $asunto = sprintf('[Cuchaforas] Nuevo mensaje de %s', $nombre);
        
        $cuerpo_mensaje = sprintf(
            "Has recibido un nuevo mensaje desde el formulario de contacto de Cuchaforas.\n\n" .
            "Nombre: %s\n" .
            "Email: %s\n\n" .
            "Mensaje:\n%s\n\n" .
            "---\n" .
            "Este mensaje fue enviado desde https://cuchaforas.cl/contacto",
            $nombre,
            $email,
            $mensaje
        );
        
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $nombre . ' <' . $email . '>',
            'From: Cuchaforas <noreply@proyectocuchaforas.cl>',
        );
        
        // Enviar email
        $email_enviado = wp_mail($this->email_destinatario, $asunto, $cuerpo_mensaje, $headers);
        
        if ($email_enviado) {
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'Mensaje enviado correctamente. Te responderemos pronto.',
            ), 200);
        } else {
            return new WP_Error(
                'error_envio',
                'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
                array('status' => 500)
            );
        }
    }
    
    /**
     * Sanitizar texto
     */
    public function sanitizar_texto($texto) {
        return sanitize_text_field(trim($texto));
    }
    
    /**
     * Validar que el campo no esté vacío
     */
    public function validar_no_vacio($valor) {
        return !empty(trim($valor));
    }
    
    /**
     * Validar email
     */
    public function validar_email($email) {
        return is_email($email);
    }
    
    /**
     * Validar token de hCaptcha (validación inicial)
     */
    public function validar_hcaptcha($token) {
        return !empty($token) && strlen($token) > 10;
    }
    
    /**
     * Verificar token de hCaptcha con el servidor
     */
    private function verificar_hcaptcha($token) {
        if (empty($token) || empty($this->hcaptcha_secret_key)) {
            return false;
        }
        
        $response = wp_remote_post('https://hcaptcha.com/siteverify', array(
            'body' => array(
                'secret' => $this->hcaptcha_secret_key,
                'response' => $token,
            ),
        ));
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        return isset($data['success']) && $data['success'] === true;
    }
}

// Inicializar el plugin
new Cuchaforas_Contacto();
```

### Paso 3: Activar el plugin

1. Ve al admin de WordPress: `https://api.proyectocuchaforas.cl/wp-admin`
2. Navega a **Plugins** → **Plugins instalados**
3. Busca **"Cuchaforas Contacto"**
4. Haz clic en **"Activar"**

---

## Parte 2: Configuración de hCaptcha

### Paso 1: Crear cuenta en hCaptcha

1. Ve a https://dashboard.hcaptcha.com
2. Regístrate o inicia sesión
3. Haz clic en **"New Site Key"**

### Paso 2: Configurar el sitio

- **Friendly name**: `Cuchaforas`
- **Site Types**: Selecciona "Web"
- **Hostnames**: 
  - `cuchaforas.cl`
  - `*.cuchaforas.cl` (si usas subdominios)
  - `localhost` (para desarrollo)

### Paso 3: Obtener claves

Después de crear el sitio, obtendrás:
- **Site Key** (pública): Para el frontend
- **Secret Key** (privada): Para el backend (WordPress)

### Paso 4: Configurar en WordPress

Edita el archivo `cuchaforas-contacto.php` y reemplaza:

```php
private $hcaptcha_secret_key = 'TU_CLAVE_SECRETA_AQUI';
```

Con tu **Secret Key** real.

---

## Parte 3: Configuración del email destinatario

### Opción 1: Email con dominio propio (Recomendado)

Si el cliente tiene `contacto@cuchaforas.cl` en Hostinger:

```php
private $email_destinatario = 'contacto@cuchaforas.cl';
```

### Opción 2: Gmail personal

Si el cliente prefiere usar su Gmail:

```php
private $email_destinatario = 'cliente@gmail.com';
```

---

## Parte 4: Código Frontend (React)

### Paso 1: Instalar dependencias

```bash
npm install @hcaptcha/react-hcaptcha
```

### Paso 2: Variables de entorno

Crea o edita `.env` en la raíz del proyecto:

```env
VITE_HCAPTCHA_SITE_KEY=tu_site_key_de_hcaptcha
```

### Paso 3: Actualizar Contacto.tsx

Reemplaza el contenido de `src/pages/Contacto.tsx` con el código de `Contacto.tsx.new` (ver siguiente sección).

---

## Parte 5: Archivo Contacto.tsx actualizado

Crea un archivo temporal `Contacto.tsx.new` con este contenido:

```tsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Facebook, Send } from 'lucide-react';
import { toast } from 'sonner';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Banner } from '@/components/Banner';
import { Footer } from '@/components/Footer';

const API_URL = 'https://api.proyectocuchaforas.cl/wp-json/cuchaforas/v1/contacto';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast('Por favor, completa la verificación de seguridad', {
        description: 'Marca la casilla "No soy un robot"',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hcaptcha_token: captchaToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast('¡Mensaje enviado!', {
          description: 'Gracias por escribirnos. Te responderemos pronto.',
        });

        setFormData({ nombre: '', email: '', mensaje: '' });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      toast('Error al enviar el mensaje', {
        description: error instanceof Error ? error.message : 'Por favor, intenta nuevamente',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="min-h-screen bg-background">
      <Banner />
      <main id="main-content" className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center gap-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-black mb-6"
          >
            <div className="w-9 h-9 bg-black rounded-full"></div>
            Contacto
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            ¿Conoces una artesana que debería estar aquí? ¿Quieres colaborar?
            Escríbenos, estamos tejiendo redes.
          </motion.p>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-shadow"
                    placeholder="Cuéntanos sobre la artesana que quieres nominar, o cómo te gustaría colaborar..."
                  />
                </div>

                {/* hCaptcha */}
                <div className="flex justify-center">
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                    onVerify={handleCaptchaChange}
                    onExpire={() => setCaptchaToken(null)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !captchaToken}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact info & social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Contact cards */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                  Otras formas de contacto
                </h3>

                <div className="space-y-6">
                  {/* Email */}
                  <a
                    href="mailto:contacto@cuchaforas.cl"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Email
                      </p>
                      <p className="text-sm text-muted-foreground">
                        contacto@cuchaforas.cl
                      </p>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/cuchaforas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Instagram className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Instagram
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @cuchaforas
                      </p>
                    </div>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com/cuchaforas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Facebook className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Facebook
                      </p>
                      <p className="text-sm text-muted-foreground">
                        /cuchaforas
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Info card */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                  ¿Qué tipo de colaboraciones buscamos?
                </h3>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Nominaciones de artesanas que merecen ser visibilizadas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Espacios para exposiciones itinerantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Alianzas con organizaciones culturales y comunitarias
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Cobertura mediática y difusión del proyecto</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

---

## Parte 6: Checklist de implementación

### WordPress (api.proyectocuchaforas.cl)

- [ ] Crear carpeta del plugin: `wp-content/plugins/cuchaforas-contacto/`
- [ ] Crear archivo `cuchaforas-contacto.php` con el código proporcionado
- [ ] Activar el plugin en el admin de WordPress
- [ ] Obtener claves de hCaptcha en https://dashboard.hcaptcha.com
- [ ] Actualizar `$hcaptcha_secret_key` en el plugin
- [ ] Actualizar `$email_destinatario` con el email real del cliente
- [ ] Probar endpoint: `curl -X POST https://api.proyectocuchaforas.cl/wp-json/cuchaforas/v1/contacto`

### Frontend (cuchaforas.cl)

- [ ] Instalar dependencia: `npm install @hcaptcha/react-hcaptcha`
- [ ] Crear archivo `.env` con `VITE_HCAPTCHA_SITE_KEY`
- [ ] Actualizar `src/pages/Contacto.tsx` con el código proporcionado
- [ ] Probar formulario en desarrollo
- [ ] Deploy a producción

---

## Parte 7: Testing

### Test manual del endpoint

```bash
curl -X POST https://api.proyectocuchaforas.cl/wp-json/cuchaforas/v1/contacto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "mensaje": "Mensaje de prueba",
    "hcaptcha_token": "token_falso_para_test"
  }'
```

**Respuesta esperada** (sin token válido):
```json
{
  "code": "hcaptcha_invalido",
  "message": "Verificación de seguridad fallida. Por favor, intenta nuevamente.",
  "data": { "status": 400 }
}
```

### Test del formulario completo

1. Abrir `https://cuchaforas.cl/contacto`
2. Completar todos los campos
3. Resolver hCaptcha
4. Enviar formulario
5. Verificar que llega email al destinatario
6. Verificar mensaje de éxito en el frontend

---

## Parte 8: Troubleshooting

### Problema: "Error al enviar el mensaje"

**Causa:** WordPress no puede enviar emails

**Solución:**
1. Instalar plugin **WP Mail SMTP**
2. Configurar con las credenciales SMTP de Hostinger
3. Probar envío desde el plugin

### Problema: hCaptcha no funciona

**Causa:** Claves incorrectas o dominio no autorizado

**Solución:**
1. Verificar que el dominio `cuchaforas.cl` está en la lista de hostnames de hCaptcha
2. Verificar que las claves son correctas
3. Para desarrollo, agregar `localhost` a los hostnames

### Problema: CORS error

**Causa:** WordPress no permite requests desde el frontend

**Solución:**
Agregar al `functions.php` del tema o al plugin:

```php
add_action('init', function() {
    header('Access-Control-Allow-Origin: https://cuchaforas.cl');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
});
```

---

## Parte 9: Seguridad

### Medidas implementadas

1. **hCaptcha**: Protección contra bots y spam
2. **Sanitización**: Todos los inputs se sanitizan con `sanitize_text_field()` y `sanitize_email()`
3. **Validación**: Se valida que los campos no estén vacíos y que el email sea válido
4. **Verificación hCaptcha**: Se verifica el token con el servidor de hCaptcha
5. **wp_mail()**: Función segura de WordPress para enviar emails

### Medidas adicionales recomendadas

1. **Rate limiting**: Limitar número de envíos por IP
2. **Honeypot**: Agregar campo oculto para detectar bots
3. **Akismet**: Integrar con el servicio anti-spam de WordPress

---

## Parte 10: Mantenimiento

### Actualizar email destinatario

Editar `cuchaforas-contacto.php`:
```php
private $email_destinatario = 'nuevo@email.com';
```

### Rotar claves de hCaptcha

1. Generar nuevas claves en https://dashboard.hcaptcha.com
2. Actualizar en `cuchaforas-contacto.php`
3. Actualizar en `.env` del frontend
4. Redeploy

---

## Resumen

✅ **Backend**: Plugin WordPress con custom endpoint REST  
✅ **Frontend**: Formulario React con hCaptcha  
✅ **Seguridad**: hCaptcha + sanitización + validación  
✅ **Envío**: Email directo al cliente sin guardar en WordPress  
✅ **Historial**: Gmail guarda automáticamente las conversaciones  

---

**¿Listo para implementar?** Cuando tengas el email del cliente, solo necesitas:

1. Crear el plugin en WordPress
2. Configurar hCaptcha
3. Actualizar el email destinatario
4. Instalar dependencia en frontend
5. Actualizar `Contacto.tsx`
6. Probar y deploy
