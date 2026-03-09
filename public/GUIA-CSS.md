# Guía de Uso - Sistema de Diseño CSS

## Paleta de Colores

- **Color Principal (Marrón café)**: `#4E342E`
- **Color Secundario (Beige claro)**: `#D7CCC8`
- **Color Acento (Verde natural)**: `#6D8B74`
- **Color Fondo**: `#F5F5F5`
- **Color Texto Oscuro**: `#2E2E2E`

## Clases Principales

### Navbar
```html
<nav class="navbar">
    <div class="navbar-container">
        <a href="#" class="navbar-brand">Café Blockchain Trace</a>
        <ul class="navbar-nav">
            <li><a href="#">Enlace</a></li>
        </ul>
    </div>
</nav>
```

### Tarjetas (Cards)
```html
<div class="card">
    <div class="card-header">
        <h3>Título</h3>
    </div>
    <div class="card-body">
        Contenido de la tarjeta
    </div>
    <div class="card-footer">
        Footer opcional
    </div>
</div>
```

### Formularios
```html
<div class="form-group">
    <label class="form-label" for="campo">Etiqueta</label>
    <input type="text" class="form-input" id="campo" placeholder="Placeholder">
</div>

<!-- Select -->
<select class="form-select">
    <option>Opción</option>
</select>

<!-- Textarea -->
<textarea class="form-textarea"></textarea>
```

### Botones
```html
<!-- Botón Primary -->
<button class="btn btn-primary">Botón</button>

<!-- Botón Secondary -->
<button class="btn btn-secondary">Botón</button>

<!-- Botón Outline -->
<button class="btn btn-outline">Botón</button>

<!-- Botón de ancho completo -->
<button class="btn btn-primary btn-block">Botón</button>
```

### Línea de Tiempo (Timeline)
```html
<div class="timeline">
    <div class="timeline-item">
        <div class="timeline-card">
            <div class="timeline-date">Fecha</div>
            <div class="timeline-title">Título</div>
            <div class="timeline-content">
                Contenido
            </div>
            <span class="timeline-badge timeline-badge-origen">Origen</span>
        </div>
    </div>
</div>
```

### Alertas
```html
<div class="alert alert-success">Mensaje de éxito</div>
<div class="alert alert-error">Mensaje de error</div>
<div class="alert alert-info">Mensaje informativo</div>
```

### Tablas
```html
<div class="table-container">
    <table class="table">
        <thead>
            <tr>
                <th>Columna</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Dato</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Grid System
```html
<div class="row">
    <div class="col">Columna flexible</div>
    <div class="col-2">50% de ancho</div>
    <div class="col-3">33.33% de ancho</div>
</div>
```

### Utilidades
- `.text-center` - Centrar texto
- `.text-right` - Alinear texto a la derecha
- `.mt-1, .mt-2, .mt-3, .mt-4` - Márgenes superiores
- `.mb-1, .mb-2, .mb-3, .mb-4` - Márgenes inferiores
- `.p-1, .p-2, .p-3, .p-4` - Padding

## Ejemplo Completo

Ver el archivo `ejemplo-uso.html` para ejemplos visuales de todas las clases.
