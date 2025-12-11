# Configuración de Firebase para ROYALPETTS

## Pasos para habilitar Firestore

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **royalpetts-6dc14**
3. En el menú lateral, haz clic en **Firestore Database**
4. Haz clic en **Crear base de datos**
5. Selecciona **Comenzar en modo de prueba** (para desarrollo)
6. Elige una ubicación para tu base de datos (recomendado: **us-central** o **southamerica-east1**)
7. Haz clic en **Habilitar**

## Reglas de Seguridad (Importante)

Después de crear la base de datos, ve a la pestaña **Reglas** y configura las siguientes reglas:

### Para Desarrollo (Modo de prueba - NO usar en producción):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Para Producción (Recomendado):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ventas/{ventaId} {
      allow read, write: if request.auth != null;
    }
    match /gastos/{gastoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Estructura de Datos

La aplicación creará automáticamente dos colecciones:

### Colección: `ventas`
Cada documento contiene:
- `tipo`: "venta"
- `fecha`: string (formato fecha)
- `raza`: string
- `cantidad`: number
- `precio`: number
- `descripcion`: string
- `total`: number
- `createdAt`: timestamp
- `updatedAt`: timestamp (opcional)

### Colección: `gastos`
Cada documento contiene:
- `tipo`: "gasto"
- `fecha`: string (formato fecha)
- `categoria`: string
- `monto`: number
- `descripcion`: string
- `total`: number
- `createdAt`: timestamp
- `updatedAt`: timestamp (opcional)

## Características

✅ **Sincronización en tiempo real**: Los datos se actualizan automáticamente en todos los dispositivos
✅ **Acceso desde cualquier dispositivo**: Los datos están en la nube
✅ **Persistencia**: Los datos se guardan permanentemente en Firebase
✅ **Escalable**: Firebase puede manejar grandes volúmenes de datos

## Notas Importantes

- Los datos ahora se almacenan en Firebase, no en localStorage
- Cualquier cambio se verá reflejado en tiempo real en todos los dispositivos conectados
- Asegúrate de tener conexión a internet para que funcione correctamente

