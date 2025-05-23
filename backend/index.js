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
  { Código: '11622/2', Nombre: 'ANAFE INDUSTRIAL FOCO 2 HLLAS 20000 CAL/H CAÑO ROJO', Descripción: 'DESCRIPCION ANAFE INDUSTRIAL FOCO 2 HLLAS 20000 CAL/H CAÑO ROJO', Precio: 7938.016429 },
  { Código: '986297', Nombre: 'DISPENSER USUHAIA FRIO CALOR BIDON', Descripción: 'DESCRIPCION DISPENSER USUHAIA FRIO CALOR BIDON', Precio: 331528.925674 },
  { Código: '885794', Nombre: 'DISPENSER LH V53 DE PIE PARA BIDON', Descripción: 'DESCRIPCION DISPENSER LH V53 DE PIE PARA BIDON', Precio: 284367.7684911 },
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
