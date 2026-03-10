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

// Crear una instancia de la blockchain
// Ahora cada lote tendrá su propia cadena independiente
const blockchain = new Blockchain();

// ============================================
// ENDPOINTS DE LA API
// ============================================

/**
 * POST /api/addBlock
 * Endpoint para agregar un nuevo bloque a la cadena de un lote específico
 * Si el lote no existe, crea una nueva cadena con bloque génesis automáticamente
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
        let data = req.body.data || req.body;

        // Validar que existan datos
        if (!data) {
            return res.status(400).json({
                error: 'Se requiere el campo "data" en el cuerpo de la petición'
            });
        }

        // Extraer el lote de los datos
        const lote = data.lote;
        if (!lote) {
            return res.status(400).json({
                error: 'Se requiere el campo "lote" en los datos'
            });
        }

        // Verificar si es la primera vez que se registra este lote
        const isNewChain = !blockchain.hasChain(lote);

        // Agregar el bloque a la cadena del lote (crea la cadena si no existe)
        const resultBlock = blockchain.addBlock(lote, data);

        // Determinar el tipo de acción
        const action = isNewChain ? 'chain_created' : 'block_added';

        // Retornar respuesta exitosa (201 Created)
        res.status(201).json({
            message: isNewChain 
                ? `Nueva cadena creada para el lote "${lote}" y bloque agregado exitosamente`
                : 'Bloque agregado exitosamente a la cadena del lote',
            action: action,
            lote: lote,
            block: resultBlock
        });
    } catch (error) {
        // Capturar cualquier error que ocurra durante el proceso
        console.error('Error en /api/addBlock:', error);

        // Retornar error 500 (Internal Server Error) con detalles
        res.status(500).json({
            error: 'Error al agregar el bloque',
            details: error.message
        });
    }
});

/**
 * GET /api/getChain
 * Endpoint para obtener cadenas de bloques
 * 
 * Query Parameters:
 * - lote (opcional): Si se proporciona, retorna solo la cadena de ese lote
 * 
 * Response (sin parámetro lote):
 * {
 *   "chains": {                    // Objeto con todas las cadenas
 *     "1": [Block, Block, ...],
 *     "2": [Block, Block, ...]
 *   },
 *   "totalChains": 2,              // Número de cadenas (lotes)
 *   "totalBlocks": 5               // Número total de bloques en todas las cadenas
 * }
 * 
 * Response (con parámetro lote):
 * {
 *   "chain": [Block, Block, ...],  // Array con bloques del lote
 *   "lote": "1",
 *   "length": 3                    // Número de bloques en esta cadena
 * }
 */
app.get('/api/getChain', (req, res) => {
    try {
        const lote = req.query.lote;

        if (lote) {
            // Obtener la cadena de un lote específico
            const chain = blockchain.getChain(lote);
            
            res.json({
                chain: chain,
                lote: lote,
                length: chain.length
            });
        } else {
            // Obtener todas las cadenas
            const allChains = blockchain.getAllChains();
            const totalChains = blockchain.getTotalChains();
            
            // Calcular el total de bloques en todas las cadenas
            let totalBlocks = 0;
            Object.values(allChains).forEach(chain => {
                totalBlocks += chain.length;
            });

            res.json({
                chains: allChains,
                totalChains: totalChains,
                totalBlocks: totalBlocks
            });
        }
    } catch (error) {
        // Capturar errores y retornar respuesta de error
        res.status(500).json({
            error: 'Error al obtener la cadena',
            details: error.message
        });
    }
});



app.use(express.static('public'));

// Rutas si quieres forzar el index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
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
    const totalChains = blockchain.getTotalChains();
    console.log(`Blockchain inicializada - Sistema de múltiples cadenas por lote`);
    console.log(`Cadenas activas: ${totalChains}`);
});
