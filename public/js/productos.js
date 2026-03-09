// Datos de productos de café para la tienda
// Esta información se usa en la página de inicio (productos destacados)
// y en la página de detalle de producto.

window.productos = [
  {
    id: 1,
    nombre: "Bolsa Café Premium 500g",
    precio: 35000,
    descripcionCorta: "Café 100% colombiano de alta calidad, tostado medio.",
    descripcion:
      "Café 100% colombiano de alta calidad, seleccionado grano a grano. Tostado medio para resaltar notas a cacao, nueces y panela. Ideal para prensa francesa, V60 y cafetera tradicional.",
    imagen: "img/cafe-premium-500.jpg",
    categoria: "Premium",
    destacado: true,
    masVendido: true,
    nuevo: false,
    // Datos básicos para trazabilidad
    lote: "L-001",
    finca: "Finca La Esperanza",
    region: "Cauca",
    variedad: "Castillo",
    altura: "1850 msnm",
    proceso: "Lavado",
    empresa: "Café Andino S.A.S.",
    destino: "Bogotá, Colombia"
  },
  {
    id: 2,
    nombre: "Café de Origen Especial 250g",
    precio: 24000,
    descripcionCorta: "Micro-lote de origen único con notas frutales.",
    descripcion:
      "Micro-lote de origen único con perfil frutal y acidez brillante. Ideal para métodos filtrados como V60, Chemex y Aeropress. Tostado ligero para resaltar su complejidad aromática.",
    imagen: "img/cafe-origen-especial-250.jpg",
    categoria: "Origen Único",
    destacado: true,
    masVendido: false,
    nuevo: true,
    lote: "L-014",
    finca: "Finca El Mirador",
    region: "Huila",
    variedad: "Caturra",
    altura: "1900 msnm",
    proceso: "Honey",
    empresa: "Montaña Coffee",
    destino: "Medellín, Colombia"
  },
  {
    id: 3,
    nombre: "Blend Espresso 1Kg",
    precio: 62000,
    descripcionCorta: "Mezcla especial para espresso con cuerpo intenso.",
    descripcion:
      "Blend diseñado para espresso con cuerpo intenso y crema densa. Notas a chocolate oscuro y caramelo. Perfecto para máquinas de espresso profesionales y caseras.",
    imagen: "img/blend-espresso-1kg.jpg",
    categoria: "Blend",
    destacado: true,
    masVendido: true,
    nuevo: false,
    lote: "L-023",
    finca: "Productores Asociados",
    region: "Antioquia",
    variedad: "Bourbon / Castillo",
    altura: "1750 msnm",
    proceso: "Lavado",
    empresa: "Red de Caficultores",
    destino: "Cali, Colombia"
  },
  {
    id: 4,
    nombre: "Café Orgánico 500g",
    precio: 38000,
    descripcionCorta: "Café certificado orgánico, cultivo sostenible.",
    descripcion:
      "Café certificado orgánico cultivado bajo sombra con prácticas totalmente sostenibles. Sabor balanceado con notas herbales y dulzor suave.",
    imagen: "img/cafe-organico-500.jpg",
    categoria: "Orgánico",
    destacado: false,
    masVendido: true,
    nuevo: false,
    lote: "L-032",
    finca: "Finca Tierra Viva",
    region: "Nariño",
    variedad: "Typica",
    altura: "2000 msnm",
    proceso: "Lavado",
    empresa: "Organic Coffee Co.",
    destino: "Cartagena, Colombia"
  },
  {
    id: 5,
    nombre: "Edición Limitada Geisha 200g",
    precio: 78000,
    descripcionCorta: "Edición limitada de variedad Geisha con alta complejidad aromática.",
    descripcion:
      "Edición limitada de variedad Geisha, con notas florales, cítricas y miel. Ideal para quienes buscan una experiencia de cata de alto nivel. Producido en micro-lotes con trazabilidad completa.",
    imagen: "img/geisha-edicion-limitada-200.jpg",
    categoria: "Edición Limitada",
    destacado: true,
    masVendido: false,
    nuevo: true,
    lote: "L-045",
    finca: "Finca El Cielo",
    region: "Sierra Nevada",
    variedad: "Geisha",
    altura: "1950 msnm",
    proceso: "Natural",
    empresa: "Select Coffee Lab",
    destino: "Exportación - Europa"
  },
  {
    id: 6,
    nombre: "Cápsulas Compatibles Espresso x10",
    precio: 21000,
    descripcionCorta: "Cápsulas compatibles con máquinas tipo Nespresso.",
    descripcion:
      "Cápsulas de café molido fresco, compatibles con máquinas tipo Nespresso. Perfil balanceado para uso diario, con notas a chocolate con leche y nueces.",
    imagen: "img/capsulas-espresso-10.jpg",
    categoria: "Cápsulas",
    destacado: false,
    masVendido: true,
    nuevo: false,
    lote: "L-052",
    finca: "Cooperativa Central",
    region: "Tolima",
    variedad: "Castillo / Caturra",
    altura: "1700 msnm",
    proceso: "Lavado",
    empresa: "Café Urbano",
    destino: "Bucaramanga, Colombia"
  }
];

// Utilidades globales simples para reutilizar en otras páginas
window.getProductoPorId = function (id) {
  if (!window.productos) return null;
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  return window.productos.find((p) => p.id === numericId) || null;
};

