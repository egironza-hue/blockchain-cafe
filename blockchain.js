// Importar la función SHA256 de crypto-js para generar hashes criptográficos
const SHA256 = require("crypto-js/sha256");

/**
 * Clase Block - Representa un bloque individual en la blockchain
 * Cada bloque contiene información y está vinculado al bloque anterior mediante su hash
 */
class Block {
    /**
     * Constructor del bloque
     * @param {number} index - Posición del bloque en la cadena (0 = génesis)
     * @param {object} data - Datos que se almacenarán en el bloque
     * @param {string} previousHash - Hash del bloque anterior (vacío para el génesis)
     */
    constructor(index, data, previousHash = '') {
        this.index = index;                    // Índice del bloque en la cadena
        this.data = data;                      // Datos del bloque (información del café)
        this.timestamp = new Date();           // Fecha y hora de creación del bloque
        this.previousHash = previousHash;      // Hash del bloque anterior (mantiene la cadena)
        this.hash = this.createHash();         // Hash SHA256 calculado automáticamente
    }

    /**
     * Genera el hash SHA256 del bloque
     * El hash se calcula usando: índice + timestamp + datos (JSON) + hash anterior
     * @returns {string} Hash hexadecimal de 64 caracteres
     */
    createHash() {
        // Convierte todos los componentes a string y los concatena
        // JSON.stringify convierte el objeto data a string JSON
        // .toString() convierte el hash a string hexadecimal
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }

    // IMPORTANTE: En el nuevo modelo de trazabilidad los bloques son inmutables.
    // No se debe permitir actualizar los datos de un bloque existente.
}

/**
 * Clase Blockchain - Gestiona múltiples cadenas de bloques independientes por lote
 * Cada lote tiene su propia cadena de bloques que no se enlaza con otros lotes
 */
class Blockchain {
    /**
     * Constructor de la blockchain
     * Inicializa un objeto vacío para almacenar múltiples cadenas por lote
     */
    constructor() {
        // Estructura para almacenar múltiples blockchains
        // Formato: { "lote1": [Block, Block, ...], "lote2": [Block, Block, ...], ... }
        this.chains = {};
    }

    /**
     * Normaliza el número de lote para evitar duplicados por espacios o formato
     * @param {string|number} lote - Número de lote a normalizar
     * @returns {string} Lote normalizado o null si no es válido
     */
    normalizeLote(lote) {
        if (!lote) return null;
        const normalized = String(lote).trim();
        return normalized || null;
    }

    /**
     * Crea el bloque génesis (primer bloque de una cadena)
     * @param {string} lote - Número de lote para el bloque génesis
     * @returns {Block} Bloque génesis con índice 0
     */
    createFirstBlock(lote) {
        const genesisData = {
            message: `Bloque génesis - Lote ${lote}`,
            tipo: 'GENESIS',
            lote: lote
        };
        // El bloque génesis tiene índice 0 y previousHash vacío
        return new Block(0, genesisData, '');
    }

    /**
     * Crea una nueva cadena de bloques para un lote específico
     * @param {string|number} lote - Número de lote
     * @returns {Array<Block>} Nueva cadena con bloque génesis
     */
    createChain(lote) {
        const normalizedLote = this.normalizeLote(lote);
        if (!normalizedLote) {
            throw new Error('El lote es requerido para crear una cadena');
        }

        // Si la cadena ya existe, retornarla sin crear una nueva
        if (this.chains[normalizedLote]) {
            return this.chains[normalizedLote];
        }

        // Crear nueva cadena con bloque génesis
        const genesisBlock = this.createFirstBlock(normalizedLote);
        this.chains[normalizedLote] = [genesisBlock];

        return this.chains[normalizedLote];
    }

    /**
     * Obtiene el último bloque de una cadena específica
     * @param {string|number} lote - Número de lote
     * @returns {Block|null} Último bloque de la cadena o null si no existe
     */
    getLastBlock(lote) {
        const normalizedLote = this.normalizeLote(lote);
        if (!normalizedLote || !this.chains[normalizedLote]) {
            return null;
        }

        const chain = this.chains[normalizedLote];
        return chain[chain.length - 1];
    }

    /**
     * Agrega un nuevo bloque INMUTABLE a la cadena de un lote específico.
     * Si el lote no existe, crea una nueva cadena con bloque génesis.
     * Cada evento de trazabilidad (ORIGEN, DISTRIBUCION, etc.) genera un bloque nuevo.
     * @param {string|number} lote - Número de lote
     * @param {object} data - Datos del bloque a agregar
     * @returns {Block} Bloque creado
     */
    addBlock(lote, data) {
        const normalizedLote = this.normalizeLote(lote);
        if (!normalizedLote) {
            throw new Error('El lote es requerido para agregar un bloque');
        }

        // Normalizar el lote en los datos
        if (data.lote) {
            data.lote = normalizedLote;
        } else {
            data.lote = normalizedLote;
        }

        // Normalizar tipo a mayúsculas si existe
        if (data.tipo && typeof data.tipo === 'string') {
            data.tipo = data.tipo.toUpperCase();
        }

        // Si la cadena no existe, crearla con bloque génesis
        if (!this.chains[normalizedLote]) {
            this.createChain(normalizedLote);
        }

        // Obtener el último bloque de esta cadena específica
        const prevBlock = this.getLastBlock(normalizedLote);
        if (!prevBlock) {
            throw new Error(`Error: No se pudo obtener el último bloque de la cadena del lote ${normalizedLote}`);
        }

        // Crear nuevo bloque usando el último bloque de esta cadena como referencia
        const block = new Block(prevBlock.index + 1, data, prevBlock.hash);

        // Agregar el bloque a la cadena específica del lote
        this.chains[normalizedLote].push(block);

        return block;
    }

    /**
     * Obtiene la cadena de bloques de un lote específico
     * @param {string|number} lote - Número de lote (opcional)
     * @returns {Array<Block>|Object} Si se proporciona lote, retorna la cadena de ese lote.
     *                                Si no se proporciona, retorna todas las cadenas.
     */
    getChain(lote = null) {
        if (lote === null) {
            // Retornar todas las cadenas
            return this.chains;
        }

        const normalizedLote = this.normalizeLote(lote);
        if (!normalizedLote) {
            return [];
        }

        // Retornar la cadena específica del lote o array vacío si no existe
        return this.chains[normalizedLote] || [];
    }

    /**
     * Obtiene todas las cadenas de bloques
     * @returns {Object} Objeto con todas las cadenas indexadas por lote
     */
    getAllChains() {
        return this.chains;
    }

    /**
     * Verifica si existe una cadena para un lote específico
     * @param {string|number} lote - Número de lote
     * @returns {boolean} True si la cadena existe, false en caso contrario
     */
    hasChain(lote) {
        const normalizedLote = this.normalizeLote(lote);
        return normalizedLote ? this.chains.hasOwnProperty(normalizedLote) : false;
    }

    /**
     * Obtiene el número total de cadenas (lotes) registradas
     * @returns {number} Número de cadenas diferentes
     */
    getTotalChains() {
        return Object.keys(this.chains).length;
    }
}

// Exportar la clase Blockchain para que pueda ser importada en otros archivos
module.exports = Blockchain;
