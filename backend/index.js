const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const EXCEL_PATH = path.join(__dirname, 'example.xlsx');

// Datos de ejemplo
const productos = [
  { Código: '1234567890123', Nombre: 'Lámpara LED', Descripción: 'Lámpara 15W blanca', Precio: 10.99 },
  { Código: '9876543210987', Nombre: 'Teclado Gamer', Descripción: 'Mecánico RGB', Precio: 49.99 },
  { Código: '5558883331112', Nombre: 'Auriculares', Descripción: 'Bluetooth inalámbricos', Precio: 25.50 },
];

// 🧾 Función que genera el Excel
function generarExcel() {
  const ws = XLSX.utils.json_to_sheet(productos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Productos');
  XLSX.writeFile(wb, EXCEL_PATH);
  console.log('📄 Archivo example.xlsx generado.');
}

// 🔎 Buscar producto por código
app.get('/producto/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const workbook = XLSX.readFile(EXCEL_PATH);
  const hoja = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(hoja);

  const producto = data.find(p => p.Código == codigo);

  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// 🟢 Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  generarExcel();
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
