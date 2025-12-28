# Script para renombrar fotos en cada carpeta con el nombre de la carpeta + correlativo

$directorioRaiz = Get-Location
$extensionesImagen = @('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG')

Write-Host "Renombrando fotos en: $directorioRaiz" -ForegroundColor Cyan
Write-Host ""

# Recorrer cada carpeta en el directorio raiz
Get-ChildItem -Directory | ForEach-Object {
    $carpeta = $_
    $nombreCarpeta = $carpeta.Name
    # Limpiar el nombre: quitar espacios y convertir a minusculas
    $nombreBase = $nombreCarpeta -replace '\s', '' | ForEach-Object { $_.ToLower() }
    
    # Obtener todas las imagenes en la carpeta
    $imagenes = Get-ChildItem -Path $carpeta.FullName -File | 
                Where-Object { $extensionesImagen -contains $_.Extension } |
                Sort-Object Name
    
    if ($imagenes.Count -eq 0) {
        Write-Host "No se encontraron imagenes en: $nombreCarpeta" -ForegroundColor Yellow
        return
    }
    
    # Renombrar cada imagen
    $indice = 1
    foreach ($imagen in $imagenes) {
        $extension = $imagen.Extension
        $nuevoNombre = "$nombreBase$indice$extension"
        $nuevoPath = Join-Path $carpeta.FullName $nuevoNombre
        
        # Si el nuevo nombre es diferente al actual, renombrar
        if ($imagen.Name -ne $nuevoNombre) {
            # Si ya existe un archivo con ese nombre y no es el mismo archivo, usar un nombre temporal
            if ((Test-Path $nuevoPath) -and ($nuevoPath -ne $imagen.FullName)) {
                $tempNombre = "temp_$indice" + $imagen.Name
                $tempPath = Join-Path $carpeta.FullName $tempNombre
                Rename-Item -Path $imagen.FullName -NewName $tempNombre
                $imagen = Get-Item $tempPath
            }
            
            try {
                Rename-Item -Path $imagen.FullName -NewName $nuevoNombre -ErrorAction Stop
                Write-Host "Renombrado: $nombreCarpeta\$($imagen.Name) -> $nuevoNombre" -ForegroundColor Green
            }
            catch {
                Write-Host "Error al renombrar $($imagen.Name): $_" -ForegroundColor Red
            }
        }
        else {
            Write-Host "Ya tiene el nombre correcto: $nuevoNombre" -ForegroundColor Gray
        }
        
        $indice++
    }
}

Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Cyan
