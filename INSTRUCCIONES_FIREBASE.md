# Instrucciones para Configurar Firebase - ROYALPETTS

## ✅ Archivos ya Configurados

Los siguientes archivos ya están creados y configurados:
- ✅ `firebase-config.js` - Configuración de Firebase
- ✅ `.firebaserc` - Proyecto de Firebase configurado
- ✅ `firebase.json` - Configuración de Firestore y Hosting
- ✅ `firestore.rules` - Reglas de seguridad
- ✅ `firestore.indexes.json` - Índices de Firestore
- ✅ `admin.js` - Código actualizado para usar Firestore
- ✅ `admin.html` - Scripts de Firebase agregados

## 📋 Pasos para Completar la Configuración

### 1. Iniciar Sesión en Firebase

Ejecuta en la terminal:
```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Google.

### 2. Habilitar Firestore en la Consola

1. Ve a https://console.firebase.google.com/
2. Selecciona el proyecto **royalpetts-6dc14**
3. En el menú lateral, haz clic en **Firestore Database**
4. Si no está creada, haz clic en **Crear base de datos**
5. Selecciona **Comenzar en modo de prueba**
6. Elige una ubicación (recomendado: **southamerica-east1** para Venezuela)
7. Haz clic en **Habilitar**

### 3. Desplegar las Reglas de Firestore

Ejecuta en la terminal:
```bash
firebase deploy --only firestore:rules
```

Esto desplegará las reglas de seguridad configuradas en `firestore.rules`.

### 4. Verificar la Conexión

Abre `admin.html` en tu navegador y:
1. Inicia sesión con: usuario `admin` / contraseña `admin123`
2. Intenta agregar una venta o gasto
3. Verifica en la consola del navegador (F12) que no haya errores
4. Verifica en Firebase Console que los datos se estén guardando

## 🚀 Desplegar el Sitio Web (Opcional)

Si quieres desplegar tu sitio web en Firebase Hosting:

```bash
firebase deploy --only hosting
```

Tu sitio estará disponible en: `https://royalpetts-6dc14.web.app`

## 🔧 Solución de Problemas

### Error: "Failed to authenticate"
- Ejecuta `firebase login` nuevamente

### Error: "Firebase SDK no está cargado"
- Verifica que tengas conexión a internet
- Abre la consola del navegador (F12) para ver errores específicos

### Los datos no se guardan
- Verifica que Firestore esté habilitado en Firebase Console
- Verifica que las reglas de Firestore permitan lectura/escritura
- Revisa la consola del navegador para errores

## 📝 Notas Importantes

- **Modo Desarrollo**: Las reglas actuales permiten lectura/escritura sin autenticación (solo para desarrollo)
- **Producción**: Cambia las reglas en `firestore.rules` para requerir autenticación
- **Datos en Tiempo Real**: Los cambios se sincronizan automáticamente en todos los dispositivos
- **Backup**: Los datos se guardan permanentemente en Firebase

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación estará completamente funcional con Firebase.

