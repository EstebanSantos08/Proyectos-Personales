const { User, Category, Product, Cart } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');
    
    // Crear usuario admin
    const adminExiste = await User.findOne({ where: { email: 'admin@tiendaropa.com' } });
    let admin;
    if (!adminExiste) {
      admin = await User.create({
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@tiendaropa.com',
        password: 'admin123',
        rol: 'admin',
        telefono: '0999999999',
        direccion: 'Oficina Principal'
      });
      await Cart.create({ userId: admin.id });
      console.log('✅ Usuario admin creado');
    } else {
      admin = adminExiste;
      console.log('ℹ️ Usuario admin ya existe');
    }
    
    // Crear usuario cliente de prueba
    const clienteExiste = await User.findOne({ where: { email: 'cliente@test.com' } });
    if (!clienteExiste) {
      const cliente = await User.create({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'cliente@test.com',
        password: 'cliente123',
        rol: 'cliente',
        telefono: '0988888888',
        direccion: 'Av. Principal 123'
      });
      await Cart.create({ userId: cliente.id });
      console.log('✅ Usuario cliente creado');
    } else {
      console.log('ℹ️ Usuario cliente ya existe');
    }
    
    // Crear categorías
    const categoriasData = [
      { nombre: 'Camisetas', descripcion: 'Camisetas y tops para todas las ocasiones' },
      { nombre: 'Pantalones', descripcion: 'Jeans, pantalones casuales y formales' },
      { nombre: 'Vestidos', descripcion: 'Vestidos para eventos y uso diario' },
      { nombre: 'Chaquetas', descripcion: 'Chaquetas y abrigos' },
      { nombre: 'Accesorios', descripcion: 'Cinturones, bufandas y más' },
      { nombre: 'Calzado', descripcion: 'Zapatos, zapatillas y botas' }
    ];
    
    for (const catData of categoriasData) {
      const [categoria, created] = await Category.findOrCreate({
        where: { nombre: catData.nombre },
        defaults: catData
      });
      if (created) {
        console.log(`✅ Categoría "${catData.nombre}" creada`);
      }
    }
    
    // Obtener categorías
    const categorias = await Category.findAll();
    const categoriaMap = {};
    categorias.forEach(cat => {
      categoriaMap[cat.nombre] = cat.id;
    });
    
    // Crear productos de ejemplo
    const productosData = [
      {
        nombre: 'Camiseta Básica Blanca',
        descripcion: 'Camiseta de algodón 100%, cómoda y versátil para el día a día.',
        precio: 19.99,
        categoryId: categoriaMap['Camisetas'],
        stock: 100,
        tallas: ['XS', 'S', 'M', 'L', 'XL'],
        colores: ['Blanco', 'Negro', 'Gris'],
        genero: 'unisex',
        destacado: true,
        sku: 'CAM-BAS-001'
      },
      {
        nombre: 'Camiseta Estampada Urban',
        descripcion: 'Camiseta con diseño urbano moderno, perfecta para un look casual.',
        precio: 24.99,
        categoryId: categoriaMap['Camisetas'],
        stock: 75,
        tallas: ['S', 'M', 'L', 'XL'],
        colores: ['Negro', 'Azul marino'],
        genero: 'hombre',
        destacado: true,
        sku: 'CAM-URB-001'
      },
      {
        nombre: 'Jeans Slim Fit',
        descripcion: 'Jeans de corte slim, denim de alta calidad con elasticidad.',
        precio: 49.99,
        precioOferta: 39.99,
        categoryId: categoriaMap['Pantalones'],
        stock: 50,
        tallas: ['28', '30', '32', '34', '36'],
        colores: ['Azul oscuro', 'Negro', 'Azul claro'],
        genero: 'hombre',
        destacado: true,
        sku: 'PAN-JEA-001'
      },
      {
        nombre: 'Pantalón Chino Casual',
        descripcion: 'Pantalón chino elegante para ocasiones semi-formales.',
        precio: 39.99,
        categoryId: categoriaMap['Pantalones'],
        stock: 60,
        tallas: ['28', '30', '32', '34', '36'],
        colores: ['Beige', 'Azul marino', 'Gris'],
        genero: 'hombre',
        destacado: false,
        sku: 'PAN-CHI-001'
      },
      {
        nombre: 'Vestido Floral Verano',
        descripcion: 'Vestido ligero con estampado floral, ideal para días calurosos.',
        precio: 45.99,
        categoryId: categoriaMap['Vestidos'],
        stock: 40,
        tallas: ['XS', 'S', 'M', 'L'],
        colores: ['Floral Rosa', 'Floral Azul'],
        genero: 'mujer',
        destacado: true,
        sku: 'VES-FLO-001'
      },
      {
        nombre: 'Vestido Cocktail Negro',
        descripcion: 'Elegante vestido negro para eventos especiales.',
        precio: 79.99,
        precioOferta: 69.99,
        categoryId: categoriaMap['Vestidos'],
        stock: 25,
        tallas: ['XS', 'S', 'M', 'L'],
        colores: ['Negro', 'Rojo'],
        genero: 'mujer',
        destacado: true,
        sku: 'VES-COC-001'
      },
      {
        nombre: 'Chaqueta Denim Clásica',
        descripcion: 'Chaqueta de jean clásica que nunca pasa de moda.',
        precio: 59.99,
        categoryId: categoriaMap['Chaquetas'],
        stock: 35,
        tallas: ['S', 'M', 'L', 'XL'],
        colores: ['Azul medio', 'Negro'],
        genero: 'unisex',
        destacado: true,
        sku: 'CHA-DEN-001'
      },
      {
        nombre: 'Blazer Ejecutivo',
        descripcion: 'Blazer formal de corte moderno para ambientes profesionales.',
        precio: 89.99,
        categoryId: categoriaMap['Chaquetas'],
        stock: 20,
        tallas: ['S', 'M', 'L', 'XL'],
        colores: ['Negro', 'Azul marino', 'Gris'],
        genero: 'hombre',
        destacado: false,
        sku: 'CHA-BLA-001'
      },
      {
        nombre: 'Cinturón Cuero Premium',
        descripcion: 'Cinturón de cuero genuino con hebilla metálica.',
        precio: 29.99,
        categoryId: categoriaMap['Accesorios'],
        stock: 80,
        tallas: ['85', '90', '95', '100', '105'],
        colores: ['Negro', 'Marrón'],
        genero: 'hombre',
        destacado: false,
        sku: 'ACC-CIN-001'
      },
      {
        nombre: 'Bufanda Lana Invierno',
        descripcion: 'Bufanda de lana suave para mantener el calor.',
        precio: 24.99,
        categoryId: categoriaMap['Accesorios'],
        stock: 50,
        tallas: ['Única'],
        colores: ['Gris', 'Beige', 'Rojo', 'Azul'],
        genero: 'unisex',
        destacado: false,
        sku: 'ACC-BUF-001'
      },
      {
        nombre: 'Zapatillas Deportivas Runner',
        descripcion: 'Zapatillas cómodas para running y uso diario.',
        precio: 79.99,
        precioOferta: 64.99,
        categoryId: categoriaMap['Calzado'],
        stock: 45,
        tallas: ['38', '39', '40', '41', '42', '43', '44'],
        colores: ['Blanco/Negro', 'Negro/Rojo', 'Gris'],
        genero: 'unisex',
        destacado: true,
        sku: 'CAL-RUN-001'
      },
      {
        nombre: 'Botines Chelsea',
        descripcion: 'Botines elegantes estilo Chelsea para un look sofisticado.',
        precio: 99.99,
        categoryId: categoriaMap['Calzado'],
        stock: 30,
        tallas: ['38', '39', '40', '41', '42', '43'],
        colores: ['Negro', 'Marrón'],
        genero: 'hombre',
        destacado: false,
        sku: 'CAL-CHE-001'
      }
    ];
    
    for (const prodData of productosData) {
      const [producto, created] = await Product.findOrCreate({
        where: { sku: prodData.sku },
        defaults: prodData
      });
      if (created) {
        console.log(`✅ Producto "${prodData.nombre}" creado`);
      }
    }
    
    console.log('🎉 Seeding completado exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Admin: admin@tiendaropa.com / admin123');
    console.log('Cliente: cliente@test.com / cliente123');
    
  } catch (error) {
    console.error('❌ Error en seeding:', error);
  }
};

module.exports = seedDatabase;
