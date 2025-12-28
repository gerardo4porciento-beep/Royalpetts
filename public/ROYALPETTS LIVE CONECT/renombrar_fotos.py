import os
import shutil
from pathlib import Path

def renombrar_fotos_en_carpetas(directorio_raiz):
    """
    Renombra todas las fotos en cada carpeta con el nombre de la carpeta + correlativo.
    Ejemplo: goldenretriever1.jpg, goldenretriever2.jpg
    """
    directorio = Path(directorio_raiz)
    
    # Extensiones de imagen comunes
    extensiones_imagen = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'}
    
    # Recorrer cada carpeta en el directorio raíz
    for carpeta in directorio.iterdir():
        if carpeta.is_dir():
            # Obtener el nombre de la carpeta y limpiarlo (sin espacios, en minúsculas)
            nombre_carpeta = carpeta.name
            nombre_base = nombre_carpeta.replace(' ', '').lower()
            
            # Obtener todas las imágenes en la carpeta
            imagenes = []
            for archivo in carpeta.iterdir():
                if archivo.is_file() and archivo.suffix in extensiones_imagen:
                    imagenes.append(archivo)
            
            # Ordenar las imágenes por nombre para mantener consistencia
            imagenes.sort(key=lambda x: x.name)
            
            # Renombrar cada imagen
            for indice, imagen in enumerate(imagenes, start=1):
                extension = imagen.suffix
                nuevo_nombre = f"{nombre_base}{indice}{extension}"
                nuevo_path = carpeta / nuevo_nombre
                
                # Si el nuevo nombre es diferente al actual, renombrar
                if imagen.name != nuevo_nombre:
                    # Si ya existe un archivo con ese nombre, agregar un sufijo temporal
                    if nuevo_path.exists() and nuevo_path != imagen:
                        temp_path = carpeta / f"temp_{indice}_{imagen.name}"
                        imagen.rename(temp_path)
                        imagen = temp_path
                    
                    try:
                        imagen.rename(nuevo_path)
                        print(f"✓ Renombrado: {carpeta.name}/{imagen.name} → {nuevo_nombre}")
                    except Exception as e:
                        print(f"✗ Error al renombrar {imagen.name}: {e}")
                else:
                    print(f"→ Ya tiene el nombre correcto: {nuevo_nombre}")

if __name__ == "__main__":
    # Obtener el directorio actual como directorio raíz
    directorio_actual = os.getcwd()
    print(f"Renombrando fotos en: {directorio_actual}\n")
    renombrar_fotos_en_carpetas(directorio_actual)
    print("\n¡Proceso completado!")



