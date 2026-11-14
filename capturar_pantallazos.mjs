// ============================================================================
// Capturador automático de pantallazos — Cafeta TiPum (Fase 3)
// ----------------------------------------------------------------------------
// Genera las capturas de pantalla del Manual de Usuario y del documento de
// Integración, probando los tres roles (ADMIN, VENDEDOR, CLIENTE).
//
// REQUISITOS PREVIOS:
//   1) Backend corriendo en http://localhost:8080
//      (docker compose up --build   o   java -jar target/tipum-backend-1.0.0.jar --spring.profiles.active=h2)
//   2) Frontend corriendo en http://localhost:5173  (npm run dev)
//   3) Playwright instalado UNA sola vez:
//        npm i -D playwright
//        npx playwright install chromium
//
// EJECUCIÓN:
//   node capturar_pantallazos.mjs
//
// Las imágenes se guardan en la carpeta "pantallazos/" (junto a este script).
// ============================================================================

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'pantallazos')
const FRONT = 'http://localhost:5173'
const BACK = 'http://localhost:8080'

mkdirSync(OUT, { recursive: true })

const USUARIOS = {
  admin: { correo: 'admin@duoc.cl', password: 'admin123', ruta: '/admin' },
  vendedor: { correo: 'vendedor@duoc.cl', password: 'vendedor123', ruta: '/vendedor' },
  cliente: { correo: 'juan.perez@duoc.cl', password: 'cliente123', ruta: '/productos' },
}

async function shot(page, nombre) {
  await page.waitForTimeout(900) // deja que terminen de cargar imágenes/fuentes
  await page.screenshot({ path: path.join(OUT, nombre), fullPage: true })
  console.log('  ✔', nombre)
}

async function login(page, rol) {
  const u = USUARIOS[rol]
  await page.evaluate(() => localStorage.clear())
  await page.goto(`${FRONT}/login`)
  await page.fill('#email', u.correo)
  await page.fill('#password', u.password)
  await Promise.all([
    page.waitForURL((url) => url.pathname === u.ruta, { timeout: 10000 }),
    page.click('button[type="submit"]'),
  ])
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })

  console.log('Capturando pantallazos de Cafeta TiPum...\n')

  // ---- Páginas públicas (tienda) ----
  await page.goto(`${FRONT}/`)
  await shot(page, '01_home.png')

  await page.goto(`${FRONT}/productos`)
  await shot(page, '02_productos.png')

  await page.goto(`${FRONT}/producto/1`)
  await shot(page, '03_detalle_producto.png')

  await page.goto(`${FRONT}/categorias`)
  await shot(page, '04_categorias.png')

  await page.goto(`${FRONT}/ofertas`)
  await shot(page, '05_ofertas.png')

  await page.goto(`${FRONT}/login`)
  await shot(page, '06_login.png')

  // ---- Rol ADMIN ----
  console.log('\n[Rol ADMIN]')
  await login(page, 'admin')
  await page.goto(`${FRONT}/admin`)
  await shot(page, '07_admin_dashboard.png')

  await page.goto(`${FRONT}/admin/productos`)
  await shot(page, '08_admin_productos.png')

  await page.goto(`${FRONT}/admin/ordenes`)
  await shot(page, '09_admin_ordenes.png')

  await page.goto(`${FRONT}/admin/usuarios`)
  await shot(page, '10_admin_usuarios.png')
  // ---- Rol VENDEDOR ----
  console.log('\n[Rol VENDEDOR]')
  await login(page, 'vendedor')
  await page.goto(`${FRONT}/vendedor`)
  await shot(page, '11_vendedor.png')

  // ---- Rol CLIENTE ----
  console.log('\n[Rol CLIENTE]')
  await login(page, 'cliente')
  await page.goto(`${FRONT}/productos`)
  await shot(page, '12_cliente_productos.png')

  await page.goto(`${FRONT}/mis-pedidos`)
  await shot(page, '13_mis_pedidos.png')

  // Restricción de acceso: cliente intenta entrar al panel admin
  await page.goto(`${FRONT}/admin`)
  await shot(page, '14_acceso_denegado.png')

  // ---- Swagger (backend) ----
  console.log('\n[Swagger]')
  await page.goto(`${BACK}/swagger-ui.html`)
  await page.waitForTimeout(2500)
  await page.screenshot({ path: path.join(OUT, '15_swagger.png'), fullPage: true })
  console.log('  ✔', '15_swagger.png')

  await browser.close()
  console.log('\n¡Listo! Las imágenes quedaron en la carpeta "pantallazos/".')
}

main().catch((err) => {
  console.error('\nERROR:', err.message)
  console.error('Verifica que el backend (:8080) y el frontend (:5173) estén corriendo.')
  process.exit(1)
})
