# 🛠️ Solución del Problema de Contabilidad

Hemos detectado que los datos no se guardaban en la nube porque las **reglas de seguridad de Firebase no estaban desplegadas**. Esto impedía que los datos se sincronizaran entre dispositivos.

## ✅ Qué hemos hecho
1. Hemos actualizado los archivos `admin.js`, `admin.html` y `firebase-config.js` en la carpeta principal con la versión más robusta y segura (que estaba en la carpeta `/admin`).
2. Hemos mejorado el manejo de errores para avisarte si la conexión falla.

## 🚀 Pasos que DEBES realizar (Imprescindible)

Para que el sistema permita guardar los datos en la nube, necesitas autorizar y desplegar las reglas.

1. Abre una terminal (o PowerShell) en la carpeta del proyecto.
2. Ejecuta el siguiente comando para iniciar sesión:
   ```bash
   firebase login
   ```
   *(Sigue los pasos en el navegador para autorizar)*.

3. Una vez conectado, ejecuta este comando para activar las reglas:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **¡Listo!** Ahora prueba abrir `admin.html` (o la web desplegada) y añade una venta. Debería aparecer en todos los dispositivos.

> **Nota:** Si ves un error de "Permisos insuficientes" o los datos no cargan, asegúrate de que la base de datos Firestore esté creada en la [Consola de Firebase](https://console.firebase.google.com/u/0/project/royalpetts-6dc14/firestore) (En modo prueba o producción).
