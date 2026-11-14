// 1. Datos geográficos de Chile (Regiones y Comunas)
export const DATOS_GEOGRAFICOS = {
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "Providencia", "Cerrillos"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
  "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"]
};

// 2. Catálogo inicial de Cafeta TiPum (con categorías, stock, stock crítico y ofertas para la Evaluación 2)
export const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: "Café Latte Pumita",
    categoria: "cafe",
    precio: 2500,
    stock: 15,
    stockCritico: 5,
    enOferta: true,
    precioOferta: 2000,
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80",
    descripcion: "El favorito de la casa. Un exquisito café de especialidad preparado con granos arábicos seleccionados, leche texturizada y un toque de amor inspirado en nuestro querido Pumita."
  },
  {
    id: 2,
    nombre: "Espresso Titi",
    categoria: "cafe",
    precio: 1800,
    stock: 4, // En nivel crítico para demostrar listado de productos críticos
    stockCritico: 5,
    enOferta: false,
    precioOferta: 1800,
    imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80",
    descripcion: "Fuerte, intenso y con mucho carácter. Nuestro Espresso Titi es un shot de pura energía extraído a la perfección con notas achocolatadas."
  },
  {
    id: 3,
    nombre: "Muffin de Arándanos",
    categoria: "pasteleria",
    precio: 2200,
    stock: 12,
    stockCritico: 4,
    enOferta: true,
    precioOferta: 1800,
    imagen: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80",
    descripcion: "Esponjoso por dentro, doradito por fuera. Horneamos nuestros muffins a diario utilizando arándanos frescos de temporada y una receta artesanal."
  },
  {
    id: 4,
    nombre: "Cheesecake de Frambuesa",
    categoria: "pasteleria",
    precio: 3500,
    stock: 3, // Stock crítico
    stockCritico: 5,
    enOferta: false,
    precioOferta: 3500,
    imagen: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80",
    descripcion: "Nuestra joya de la pastelería. Una base crujiente de galleta, un relleno cremoso de queso premium y un coulis casero de frambuesas frescas."
  },
  {
    id: 5,
    nombre: "Tazón Oficial Cafeta TiPum",
    categoria: "merchandising",
    precio: 4990,
    stock: 20,
    stockCritico: 5,
    enOferta: true,
    precioOferta: 3990,
    imagen: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80",
    descripcion: "Tazón de cerámica de alta resistencia con el logo de Cafeta TiPum para que disfrutes tu café en casa o en clases."
  }
];

export const USUARIOS_INICIALES = [
  { run: "19011022K", nombre: "Juan", apellidos: "Pérez", correo: "juan.perez@duoc.cl", region: "Región Metropolitana", comuna: "Santiago", direccion: "Av. España 123", rol: "Cliente" },
  { run: "182345678", nombre: "María", apellidos: "González", correo: "m.gonzalez@gmail.com", region: "Región de Valparaíso", comuna: "Quilpué", direccion: "Los Carrera 450", rol: "Cliente" },
  { run: "159876543", nombre: "Admin", apellidos: "Master", correo: "admin@duoc.cl", region: "Región de Valparaíso", comuna: "Viña del Mar", direccion: "Álvarez 2336", rol: "Administrador" }
];

export const ORDENES_INICIALES = [
  { id: 1001, codigo: "ORDER1001", cliente: "Juan Pérez", correo: "juan.perez@duoc.cl", fecha: "12/09/2026", monto: 8990, estado: "Completado", direccion: "Av. España 123, Santiago", items: [{ nombre: "Café Latte Pumita", cantidad: 2, precio: 2500 }, { nombre: "Tazón Oficial Cafeta TiPum", cantidad: 1, precio: 3990 }] },
  { id: 1002, codigo: "ORDER1002", cliente: "María González", correo: "m.gonzalez@gmail.com", fecha: "12/09/2026", monto: 5700, estado: "Completado", direccion: "Los Carrera 450, Quilpué", items: [{ nombre: "Cheesecake de Frambuesa", cantidad: 1, precio: 3500 }, { nombre: "Muffin de Arándanos", cantidad: 1, precio: 2200 }] }
];

// ================= CRUD DE PRODUCTOS =================
export const obtenerProductos = () => {
  const guardados = localStorage.getItem("productosTipum");
  if (!guardados) {
    localStorage.setItem("productosTipum", JSON.stringify(PRODUCTOS_INICIALES));
    return PRODUCTOS_INICIALES;
  }
  return JSON.parse(guardados);
};

export const obtenerProductoPorId = (id) => {
  const productos = obtenerProductos();
  return productos.find((p) => p.id === Number(id));
};

export const crearProducto = (nuevoProd) => {
  const productos = obtenerProductos();
  const prodConId = {
    ...nuevoProd,
    id: Date.now(),
    precio: Number(nuevoProd.precio),
    stock: Number(nuevoProd.stock),
    stockCritico: Number(nuevoProd.stockCritico || 5),
    enOferta: Boolean(nuevoProd.enOferta),
    imagen: nuevoProd.imagen || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80"
  };
  const actualizados = [...productos, prodConId];
  localStorage.setItem("productosTipum", JSON.stringify(actualizados));
  return actualizados;
};

export const actualizarProducto = (id, datosActualizados) => {
  const productos = obtenerProductos();
  const actualizados = productos.map((p) =>
    p.id === Number(id)
      ? {
          ...p,
          ...datosActualizados,
          precio: Number(datosActualizados.precio ?? p.precio),
          stock: Number(datosActualizados.stock ?? p.stock),
          stockCritico: Number(datosActualizados.stockCritico ?? p.stockCritico)
        }
      : p
  );
  localStorage.setItem("productosTipum", JSON.stringify(actualizados));
  return actualizados;
};

export const eliminarProductoDB = (id) => {
  const productos = obtenerProductos();
  const actualizados = productos.filter((p) => p.id !== Number(id));
  localStorage.setItem("productosTipum", JSON.stringify(actualizados));
  return actualizados;
};

// ================= CRUD DE USUARIOS =================
export const obtenerUsuarios = () => {
  const guardados = localStorage.getItem("usuariosTipum");
  if (!guardados) {
    localStorage.setItem("usuariosTipum", JSON.stringify(USUARIOS_INICIALES));
    return USUARIOS_INICIALES;
  }
  return JSON.parse(guardados);
};

export const guardarUsuarioDB = (usuario, indexEdicion = null) => {
  const usuarios = obtenerUsuarios();
  if (indexEdicion !== null && indexEdicion !== "") {
    usuarios[indexEdicion] = usuario;
  } else {
    usuarios.push(usuario);
  }
  localStorage.setItem("usuariosTipum", JSON.stringify(usuarios));
  return usuarios;
};

export const eliminarUsuarioDB = (run) => {
  const usuarios = obtenerUsuarios();
  const actualizados = usuarios.filter((u) => u.run !== run);
  localStorage.setItem("usuariosTipum", JSON.stringify(actualizados));
  return actualizados;
};

// ================= CARRITO Y ÓRDENES =================
export const obtenerCarrito = () => {
  return JSON.parse(localStorage.getItem("carritoMarket")) || [];
};

export const guardarCarrito = (carrito) => {
  localStorage.setItem("carritoMarket", JSON.stringify(carrito));
  window.dispatchEvent(new Event("carritoActualizado"));
};

export const agregarItemAlCarrito = (producto, cantidad = 1) => {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex((item) => item.id === Number(producto.id));
  const precioFinal = producto.enOferta && producto.precioOferta ? Number(producto.precioOferta) : Number(producto.precio);

  if (index !== -1) {
    carrito[index].cantidad += Number(cantidad);
  } else {
    carrito.push({
      id: Number(producto.id),
      nombre: producto.nombre,
      precio: precioFinal,
      imagen: producto.imagen,
      cantidad: Number(cantidad)
    });
  }
  guardarCarrito(carrito);
  return carrito;
};

export const actualizarCantidadItemCarrito = (producto, nuevaCantidad) => {
  let carrito = obtenerCarrito();
  const idNum = Number(producto.id);
  const index = carrito.findIndex((item) => item.id === idNum);
  const precioFinal = producto.enOferta && producto.precioOferta ? Number(producto.precioOferta) : Number(producto.precio);

  if (nuevaCantidad <= 0) {
    carrito = carrito.filter((item) => item.id !== idNum);
  } else if (index !== -1) {
    carrito[index].cantidad = Number(nuevaCantidad);
  } else {
    carrito.push({
      id: idNum,
      nombre: producto.nombre,
      precio: precioFinal,
      imagen: producto.imagen,
      cantidad: Number(nuevaCantidad)
    });
  }
  guardarCarrito(carrito);
  return carrito;
};

// ================= VALIDADORES DE REGLAS DE NEGOCIO =================
export const validaRutChileno = (rut) => {
  if (!rut) return false;
  const limpio = rut.trim().toUpperCase();
  if (limpio.length < 7 || limpio.length > 9 || !/^[0-9]+[0-9K]$/.test(limpio)) return false;
  let cuerpo = limpio.slice(0, -1);
  let dv = limpio.slice(-1);
  let suma = 0;
  let multiplo = 2;
  for (let i = 1; i <= cuerpo.length; i++) {
    let index = multiplo * cuerpo.charAt(cuerpo.length - i);
    suma = suma + index;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
  return dvEsperado === dv;
};

export const validaDominioCorreo = (correo) => {
  if (!correo || correo.length > 100) return false;
  const c = correo.trim().toLowerCase();
  return c.endsWith("@duoc.cl") || c.endsWith("@profesor.duoc.cl") || c.endsWith("@gmail.com");
};

export const registrarOrden = (nuevaOrden) => {
  const ordenes = JSON.parse(localStorage.getItem("ordenesMarket")) || [];
  ordenes.push(nuevaOrden);
  localStorage.setItem("ordenesMarket", JSON.stringify(ordenes));
};

export const obtenerOrdenes = () => {
  return JSON.parse(localStorage.getItem("ordenesMarket")) || [];
};