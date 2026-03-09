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
 * Clase Blockchain - Gestiona la cadena completa de bloques
 * Implementa la lógica para agregar bloques y buscar por lote
 */
class Blockchain {
    /**
     * Constructor de la blockchain
     * Inicializa la cadena con un bloque génesis
     * @param {object} genesis - Datos para el bloque génesis
     */
    constructor(genesis) {
        // Inicializa el array chain con el bloque génesis
        // El bloque génesis siempre es el primero (índice 0)
        this.chain = [this.createFirstBlock(genesis)];
    }

    /**
     * Crea el bloque génesis (primer bloque de la cadena)
     * @param {object} genesis - Datos del bloque génesis
     * @returns {Block} Bloque génesis con índice 0
     */
    createFirstBlock(genesis) {
        // El bloque génesis tiene índice 0 y previousHash vacío
        return new Block(0, genesis);
    }

    /**
     * Obtiene el último bloque de la cadena
     * @returns {Block} Último bloque agregado
     */
    getLastBlock() {
        // Retorna el último elemento del array chain
        // chain.length - 1 es el índice del último elemento
        return this.chain[this.chain.length - 1];
    }

    /**
     * Agrega un nuevo bloque INMUTABLE a la cadena.
     * Cada evento de trazabilidad (ORIGEN, DISTRIBUCION, etc.) genera un bloque nuevo.
     * @param {object} data - Datos del bloque a agregar/actualizar
     * @returns {Block} Bloque creado
     */
    addBlock(data) {
        // Normalizar el lote si existe en los datos
        if (data.lote) {
            const normalizedLote = String(data.lote).trim();
            if (normalizedLote) {
                data.lote = normalizedLote;
            } else {
                delete data.lote;
            }
        }

        // Normalizar tipo a mayúsculas si existe
        if (data.tipo && typeof data.tipo === 'string') {
            data.tipo = data.tipo.toUpperCase();
        }

        // Crear siempre un nuevo bloque usando el último como referencia
        const prevBlock = this.getLastBlock();
        const block = new Block(prevBlock.index + 1, data, prevBlock.hash);

        this.chain.push(block);
        return block;
    }

    /**
     * Obtiene toda la cadena de bloques
     * @returns {Array<Block>} Array con todos los bloques de la cadena
     */
    getChain() {
        return this.chain;
    }
}

// Exportar la clase Blockchain para que pueda ser importada en otros archivos
module.exports = Blockchain;
