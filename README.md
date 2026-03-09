# ☕ Sistema de Trazabilidad de Café con Blockchain

Sistema web completo para rastrear el origen y distribución de café utilizando una blockchain simple implementada en Node.js y Express.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Documentación de Código](#documentación-de-código)
  - [blockchain.js](#blockchainjs)
  - [server.js](#serverjs)
- [API Endpoints](#api-endpoints)
- [Características Principales](#características-principales)
- [Flujo de Trabajo](#flujo-de-trabajo)

---

## 📝 Descripción

Este proyecto implementa un sistema de trazabilidad de café que utiliza una blockchain para garantizar la inmutabilidad y transparencia de los registros. Cada lote de café tiene un único bloque en la cadena que puede ser actualizado con información adicional (origen, distribución) sin crear bloques duplicados.

### Características Clave

- ✅ **Un lote = Un bloque**: Cada lote tiene un solo bloque en la blockchain
- ✅ **Actualización de bloques**: Los bloques existentes se actualizan en lugar de crear duplicados
- ✅ **Normalización de lotes**: Evita duplicados por espacios o diferencias de formato
- ✅ **Interfaz web moderna**: Diseño elegante y responsive
- ✅ **Trazabilidad completa**: Visualización de toda la información en una línea de tiempo

---

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución JavaScript
- **Express.js**: Framework web para Node.js
- **crypto-js**: Librería para generar hashes SHA256

### Frontend
- **HTML5**: Estructura de las páginas
- **CSS3**: Estilos modernos con diseño responsive
- **JavaScript (Vanilla)**: Lógica del cliente
- **Google Fonts (Poppins)**: Tipografía moderna

### Dependencias Principales

```json
{
  "express": "^4.18.2",      // Servidor web
  "crypto-js": "^4.2.0"      // Generación de hashes
}
```

---

## 📁 Estructura del Proyecto

```
blockchain-cafe/
│
├── server.js                 # Servidor Express y endpoints API
├── blockchain.js             # Implementación de la blockchain
├── package.json              # Dependencias del proyecto
├── README.md                 # Este archivo
│
└── Public/                    # Archivos estáticos del frontend
    ├── index.html            # Página de inicio
    ├── origen.html          # Formulario de registro de origen
    ├── distribuidor.html    # Formulario de registro de distribución
    ├── trazabilidad.html    # Visualización de la blockchain
    │
    └── css/
        └── styles.css       # Estilos del sistema
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (viene con Node.js)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   ```
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación**
   - Abrir el navegador en: `http://localhost:3000`

---

## 💻 Uso

### 1. Registrar Origen del Café

1. Navegar a `http://localhost:3000/origen.html`
2. Completar el formulario:
   - **Lote**: Número único del lote
   - **Finca**: Nombre de la finca
   - **Región**: Región de origen
   - **Variedad**: Tipo de grano (ej: Arabica, Robusta)
3. Hacer clic en "Registrar Café en Blockchain"

### 2. Registrar Distribución

1. Navegar a `http://localhost:3000/distribuidor.html`
2. Completar el formulario:
   - **Lote**: Mismo número de lote registrado anteriormente
   - **Empresa**: Nombre de la empresa distribuidora
   - **Destino**: Ciudad o país de destino
3. Hacer clic en "Registrar Envío en Blockchain"
4. **Nota**: Si el lote ya existe, se actualizará el bloque existente

### 3. Ver Trazabilidad

1. Navegar a `http://localhost:3000/trazabilidad.html`
2. Ver la línea de tiempo con todos los bloques
3. Cada bloque muestra toda la información combinada (origen + distribución)

---

## 🏗 Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────┐
│   Frontend      │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Express.js     │
│   (server.js)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Blockchain    │
│ (blockchain.js) │
└─────────────────┘
```

### Flujo de Datos

1. **Usuario completa formulario** → Frontend
2. **Frontend envía POST** → `/api/addBlock`
3. **Server.js procesa** → Valida y normaliza datos
4. **Blockchain.addBlock()** → Busca lote existente o crea nuevo
5. **Respuesta JSON** → Frontend muestra resultado

---

## 📚 Documentación de Código

### blockchain.js

Este archivo contiene la implementación completa de la blockchain.

#### Clase `Block`

Representa un bloque individual en la cadena.

**Propiedades:**
- `index`: Número de índice del bloque en la cadena
- `data`: Objeto con la información del bloque
- `timestamp`: Fecha y hora de creación/actualización
- `previousHash`: Hash del bloque anterior (para mantener la cadena)
- `hash`: Hash SHA256 del bloque actual

**Métodos:**

##### `constructor(index, data, previousHash = '')`
Crea un nuevo bloque con los datos proporcionados.

```javascript
// Ejemplo de uso
const block = new Block(1, { lote: "1", finca: "La Esperanza" }, "hash_anterior");
```

##### `createHash()`
Genera el hash SHA256 del bloque usando:
- Índice
- Timestamp
- Datos (JSON stringificado)
- Hash anterior

**Retorna:** String hexadecimal del hash

##### `updateData(newData)`
Actualiza los datos del bloque y recalcula el hash.

**Parámetros:**
- `newData`: Objeto con los nuevos datos a fusionar

**Proceso:**
1. Normaliza el lote si existe
2. Fusiona datos existentes con nuevos (preserva todos los campos)
3. Determina el tipo del bloque según la información disponible
4. Recalcula el hash

**Tipos de bloque:**
- `'origen'`: Solo tiene información de origen
- `'distribucion'`: Solo tiene información de distribución
- `'completo'`: Tiene ambos tipos de información

#### Clase `Blockchain`

Gestiona la cadena completa de bloques.

**Propiedades:**
- `chain`: Array que contiene todos los bloques

**Métodos:**

##### `constructor(genesis)`
Inicializa la blockchain con un bloque génesis.

```javascript
const blockchain = new Blockchain({
    message: 'Bloque génesis',
    tipo: 'genesis'
});
```

##### `createFirstBlock(genesis)`
Crea el bloque génesis (índice 0).

##### `getLastBlock()`
Retorna el último bloque de la cadena.

**Retorna:** Objeto `Block`

##### `findBlockByLote(lote)`
Busca un bloque por su número de lote.

**Parámetros:**
- `lote`: Número de lote a buscar (puede ser string o número)

**Características:**
- Normaliza el lote antes de comparar (elimina espacios)
- Excluye el bloque génesis de la búsqueda
- Comparación case-sensitive pero normalizada

**Retorna:** `Block` si se encuentra, `null` si no existe

##### `addBlock(data)`
Agrega un nuevo bloque o actualiza uno existente.

**Parámetros:**
- `data`: Objeto con los datos del bloque

**Lógica:**
1. Normaliza el lote si existe
2. Si hay lote, busca bloque existente
3. Si existe: actualiza el bloque (NO hace push)
4. Si no existe: crea nuevo bloque y hace push

**Retorna:** `Block` (creado o actualizado)

**Ejemplo:**
```javascript
// Crear nuevo bloque
blockchain.addBlock({ tipo: "origen", lote: "1", finca: "La Esperanza" });

// Actualizar bloque existente
blockchain.addBlock({ tipo: "distribucion", lote: "1", empresa: "Nebula" });
// El bloque del lote "1" se actualiza, no se crea uno nuevo
```

##### `getChain()`
Retorna toda la cadena de bloques.

**Retorna:** Array de bloques

---

### server.js

Servidor Express que maneja las peticiones HTTP y sirve los archivos estáticos.

#### Configuración Inicial

```javascript
const express = require('express');  // Importa Express
const path = require('path');         // Para manejar rutas de archivos
const Blockchain = require('./blockchain'); // Importa la clase Blockchain

const app = express();               // Crea la aplicación Express
const PORT = process.env.PORT || 3000; // Puerto (3000 por defecto)
```

#### Middlewares

##### `app.use(express.json())`
Permite que Express parsee automáticamente el cuerpo de las peticiones JSON.

##### `app.use(express.static(...))`
Sirve archivos estáticos desde la carpeta `Public`.

#### Inicialización de Blockchain

```javascript
const blockchain = new Blockchain({
    message: 'Bloque génesis - Sistema de trazabilidad de café',
    tipo: 'genesis'
});
```

Crea una instancia de la blockchain con un bloque génesis.

---

## 🔌 API Endpoints

### POST `/api/addBlock`

Agrega un nuevo bloque o actualiza uno existente en la blockchain.

**Request Body:**
```json
{
  "data": {
    "tipo": "origen",
    "lote": "1",
    "finca": "La Esperanza",
    "region": "Cauca",
    "variedad": "Castillo"
  }
}
```

O formato directo:
```json
{
  "tipo": "distribucion",
  "lote": "1",
  "empresa": "Nebula",
  "destino": "Popayan"
}
```

**Response (201 Created - Nuevo bloque):**
```json
{
  "message": "Bloque agregado exitosamente",
  "action": "created",
  "block": {
    "index": 1,
    "data": { ... },
    "timestamp": "2026-03-07T...",
    "hash": "abc123...",
    "previousHash": "..."
  }
}
```

**Response (200 OK - Bloque actualizado):**
```json
{
  "message": "Bloque del lote \"1\" actualizado exitosamente",
  "action": "updated",
  "block": { ... }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Se requiere el campo \"data\" en el cuerpo de la petición"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Error al agregar el bloque",
  "details": "Mensaje de error específico"
}
```

### GET `/api/getChain`

Obtiene toda la cadena de bloques.

**Response (200 OK):**
```json
{
  "chain": [
    {
      "index": 0,
      "data": { "message": "...", "tipo": "genesis" },
      "timestamp": "...",
      "hash": "...",
      "previousHash": ""
    },
    {
      "index": 1,
      "data": { "tipo": "completo", "lote": "1", ... },
      "timestamp": "...",
      "hash": "...",
      "previousHash": "..."
    }
  ],
  "length": 2
}
```

---

## ✨ Características Principales

### 1. Normalización de Lotes

El sistema normaliza los lotes para evitar duplicados:
- `"1"`, `" 1"`, `"1 "` → Todos se tratan como el mismo lote
- Se usa `String(lote).trim()` antes de comparar

### 2. Actualización de Bloques

Cuando se registra información adicional para un lote existente:
- **NO** se crea un nuevo bloque
- Se actualiza el bloque existente
- Se fusionan los datos (origen + distribución)
- Se recalcula el hash automáticamente

### 3. Integridad de la Cadena

- Cada bloque contiene el hash del bloque anterior
- El hash se recalcula al actualizar un bloque
- El bloque génesis nunca se modifica

### 4. Tipos de Bloque Automáticos

El sistema determina automáticamente el tipo:
- `origen`: Tiene `finca`, `region` o `variedad`
- `distribucion`: Tiene `empresa` o `destino`
- `completo`: Tiene ambos tipos de información

---

## 🔄 Flujo de Trabajo

### Escenario 1: Registro Completo de un Lote

```
1. Usuario registra ORIGEN (lote "1")
   └─> Se crea Bloque #1
   └─> chain.length = 2 (génesis + 1)

2. Usuario registra DISTRIBUCIÓN (lote "1")
   └─> Se actualiza Bloque #1
   └─> chain.length = 2 (sin cambios)
   └─> Bloque #1 ahora tiene información completa
```

### Escenario 2: Múltiples Lotes

```
1. Registro lote "1" (origen)
   └─> Bloque #1 creado

2. Registro lote "2" (origen)
   └─> Bloque #2 creado

3. Registro lote "1" (distribución)
   └─> Bloque #1 actualizado (NO se crea Bloque #3)

Resultado: chain.length = 3 (génesis + 2 bloques)
```

---

## 🎨 Frontend

### Páginas Disponibles

1. **index.html**: Página de inicio con estadísticas
2. **origen.html**: Formulario de registro de origen
3. **distribuidor.html**: Formulario de registro de distribución
4. **trazabilidad.html**: Visualización de la blockchain en línea de tiempo

### Diseño

- **Paleta de colores**: Inspirada en café (marrón, beige, verde)
- **Tipografía**: Poppins (Google Fonts)
- **Responsive**: Adaptable a móvil y escritorio
- **Animaciones**: Transiciones suaves al cargar

---

## 📝 Notas Importantes

### Sobre la Blockchain

Esta es una **blockchain simplificada** para fines educativos y de demostración. No incluye:
- Consenso distribuido (PoW, PoS, etc.)
- Validación de transacciones entre nodos
- Criptografía avanzada de clave pública/privada

### Limitaciones

- Los datos se almacenan en memoria (se pierden al reiniciar el servidor)
- No hay persistencia en base de datos
- Un solo nodo (no es una red distribuida)

### Mejoras Futuras

- Persistencia con base de datos (MongoDB, PostgreSQL)
- Validación de integridad de la cadena
- Sistema de autenticación
- Exportación de datos (JSON, CSV)

---

## 🐛 Solución de Problemas

### Error: "EADDRINUSE: address already in use :::3000"

El puerto 3000 está en uso. Solución:

```powershell
# Windows PowerShell
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### Error: "Cannot find module 'express'"

Instalar dependencias:
```bash
npm install
```

### Los bloques no se actualizan

1. Verificar que el lote sea exactamente el mismo (incluyendo espacios)
2. Revisar la consola del navegador (F12) para errores
3. Verificar que el servidor esté corriendo

---

## 📄 Licencia

ISC

---

## 👤 Autor

Sistema de Trazabilidad de Café con Blockchain

---

## 🙏 Agradecimientos

- Express.js por el framework web
- crypto-js por la generación de hashes
- Google Fonts por la tipografía Poppins

---

**Última actualización**: Marzo 2026
#   b l o c k c h a i n - c a f e  
 