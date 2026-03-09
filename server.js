// Importar Express - Framework web para Node.js que facilita la creación de servidores HTTP
const express = require('express');

// Importar path - Módulo de Node.js para manejar rutas de archivos y directorios
const path = require('path');

// Importar la clase Blockchain desde el archivo blockchain.js
const Blockchain = require('./blockchain');

// Crear una instancia de la aplicación Express
const app = express();

// Definir el puerto del servidor
// process.env.PORT permite usar un puerto definido en variables de entorno
// Si no existe, usa el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

// Middleware para parsear automáticamente el cuerpo de las peticiones JSON
// Permite acceder a req.body cuando se envía JSON en POST/PUT
app.use(express.json());

// Middleware para servir archivos estáticos (HTML, CSS, JS, imágenes)
// path.join(__dirname, 'Public') construye la ruta absoluta a la carpeta Public
// __dirname es la ruta del directorio actual
app.use(express.static(path.join(__dirname, 'Public')));

// ============================================
// INICIALIZACIÓN DE LA BLOCKCHAIN
// ============================================

// Crear una instancia de la blockchain con un bloque génesis
// El bloque génesis es el primer bloque y contiene información inicial del sistema
const blockchain = new Blockchain({
    message: 'Bloque génesis - Sistema de trazabilidad de café',
    tipo: 'genesis'
});

// ============================================
// ENDPOINTS DE LA API
// ============================================

/**
 * POST /api/addBlock
 * Endpoint para agregar un nuevo bloque o actualizar uno existente
 * 
 * Request Body (formato 1):
 * {
 *   "data": {
 *     "tipo": "origen",
 *     "lote": "1",
 *     "finca": "La Esperanza",
 *     ...
 *   }
 * }
 * 
 * Request Body (formato 2 - directo):
 * {
 *   "tipo": "distribucion",
 *   "lote": "1",
 *   "empresa": "Nebula",
 *   ...
 * }
 */
app.post('/api/addBlock', (req, res) => {
    try {
        // El frontend puede enviar los datos directamente o envueltos en { data: {...} }
        // Normalizar para aceptar ambos formatos y mantener compatibilidad
        // req.body contiene los datos enviados en el cuerpo de la petición
        let data = req.body.data || req.body;
        
        // Validar que existan datos
        if (!data) {
            // Retornar error 400 (Bad Request) si no hay datos
            return res.status(400).json({ 
                error: 'Se requiere el campo "data" en el cuerpo de la petición' 
            });
        }

        // Crear SIEMPRE un nuevo bloque inmutable en la blockchain
        const resultBlock = blockchain.addBlock(data);

        // Retornar respuesta exitosa (201 Created)
        res.status(201).json({
            message: 'Bloque agregado exitosamente',
            action: 'created',
            block: resultBlock
        });
    } catch (error) {
        // Capturar cualquier error que ocurra durante el proceso
        // console.error registra el error en la consola del servidor para debugging
        console.error('Error en /api/addBlock:', error);
        
        // Retornar error 500 (Internal Server Error) con detalles
        res.status(500).json({ 
            error: 'Error al agregar el bloque',
            details: error.message // Mensaje de error específico
        });
    }
});

/**
 * GET /api/getChain
 * Endpoint para obtener toda la cadena de bloques
 * 
 * Response:
 * {
 *   "chain": [ ... ],  // Array con todos los bloques
 *   "length": 2        // Número de bloques en la cadena
 * }
 */
app.get('/api/getChain', (req, res) => {
    try {
        // Obtener toda la cadena de bloques
        const chain = blockchain.getChain();
        
        // Retornar la cadena y su longitud en formato JSON
        res.json({
            chain: chain,           // Array completo de bloques
            length: chain.length    // Número total de bloques
        });
    } catch (error) {
        // Capturar errores y retornar respuesta de error
        res.status(500).json({ 
            error: 'Error al obtener la cadena',
            details: error.message 
        });
    }
});

// ============================================
// INICIAR EL SERVIDOR
// ============================================

// Iniciar el servidor HTTP en el puerto especificado
// app.listen() inicia el servidor y ejecuta el callback cuando está listo
app.listen(PORT, () => {
    // Mostrar mensaje en consola indicando que el servidor está corriendo
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
    // Mostrar información sobre la blockchain inicializada
    // getChain().length retorna el número de bloques (debe ser 1 = solo génesis)
    console.log(`Blockchain inicializada con ${blockchain.getChain().length} bloque(s)`);
});
