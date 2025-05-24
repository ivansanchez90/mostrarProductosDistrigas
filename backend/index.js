const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const app = express()
app.use(cors())
app.use(express.json())

// Ruta al archivo CSV con los datos de los artículos (manejo de acentos y símbolos extraños)
const CSV_PATH = path.join(__dirname, 'Artículos.csv')

app.get('/producto/:codigo', (req, res) => {
  // Normalizamos el código buscado a minúsculas y sin espacios extras
  const codigoBuscado = req.params.codigo.trim().toLowerCase()
  const resultados = []

  fs.createReadStream(CSV_PATH)
    .pipe(
      csv({
        separator: ';',
        // Normalizamos encabezados: eliminamos acentos, símbolos extraños y pasamos a minúsculas
        mapHeaders: ({ header }) =>
          header
            .normalize('NFD') // descompone acentos
            .replace(/[\u0300-\u036f]/g, '') // elimina marcas de acento
            .toLowerCase() // pasa a minúsculas
            .replace(/[^a-z0-9]/g, '') // elimina caracteres no alfanuméricos
            .trim(), // quita espacios extras
      })
    )
    .on('data', (fila) => resultados.push(fila))
    .on('end', () => {
      // resultados.map((p) => {
      //   console.log(`Producto: ${JSON.stringify(p)}`)
      //   console.log(`Producto: ${p.cdigobarras}`)
      // })
      // Tras normalizar encabezados, la columna 'códigobarras' o 'código barras' se convierte en 'codigobarras'
      const producto = resultados.find(
        (p) =>
          String(p.cdigobarras || '')
            .trim()
            .toLowerCase() === codigoBuscado
      )
      if (producto) {
        // Convertir precio (string) a numérico y agregar 21% de IVA
        const priceKey = Object.keys(producto).find(
          (key) =>
            key.toLowerCase().includes('precioventa') ||
            key.toLowerCase().includes('precio')
        )
        if (priceKey && typeof producto[priceKey] === 'string') {
          // Elimina símbolos no numéricos y reemplaza coma decimal
          const cleaned = producto[priceKey]
            .replace(/[^0-9.,-]/g, '')
            .replace(/,/g, '.')
          const basePrice = parseFloat(cleaned)
          const priceWithIVA = parseFloat((basePrice * 1.21).toFixed(2))
          // Sobrescribimos el precio con IVA incluido
          producto[priceKey] = priceWithIVA
        }
        return res.json(producto)
      }
      return res.status(404).json({ error: 'Producto no encontrado' })
    })
    .on('error', (err) => {
      console.error('Error al leer CSV:', err)
      return res.status(500).json({ error: 'Error interno al leer datos' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`)
})
