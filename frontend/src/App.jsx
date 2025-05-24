import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { formatCurrency } from './helpers'

function App() {
  const [codigo, setCodigo] = useState('')
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState(null)

  const buscarProducto = async () => {
    if (!codigo) return

    // Codificar el código para la URL (importante para las barras)
    const codigoCodificado = encodeURIComponent(codigo)
    console.log(`Buscando código: ${codigo} (codificado: ${codigoCodificado})`)

    try {
      const res = await axios.get(
        `http://localhost:3001/producto/${codigoCodificado}`
      )
      setProducto(res.data)
      setError(null)
    } catch (err) {
      setProducto(null)
      setError('Producto no encontrado')
      console.error('Error en la búsqueda:', err.response?.data || err.message)
    }
  }

  const handleInput = (e) => {
    setCodigo(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      buscarProducto()
    }
  }

  return (
    <div className='App'>
      <h1>Buscador de Productos</h1>
      <div className='buscador'>
        <div className='input-buscador'>
          <input
            type='text'
            value={codigo}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder='Escanea o ingresa el código de barras'
            autoFocus
          />

          <button onClick={buscarProducto}>Buscar</button>
        </div>

        {producto && (
          <div className='resultado'>
            <h2>Producto encontrado:</h2>
            <p>
              <strong className='underline'>Nombre:</strong> {producto.Nombre}
            </p>
            <p>
              <strong className='underline'>Descripción:</strong>{' '}
              {producto.Descripción}
            </p>
            <p>
              <strong className='underline'>Precio Lista:</strong>{' '}
              {formatCurrency(producto.Precio)}
            </p>
            <p className='metodos-pago resaltar'>
              <img src='/visa.svg' alt='visa' />
              <img src='/mastercard.svg' alt='mastercard' />
              <div style={{ marginRight: '5px' }}>6 cuotas sin interés de:</div>
              {formatCurrency((producto.Precio * 1.15) / 6)}
            </p>
            <p className='metodos-pago'>
              <img src='/visa.svg' alt='visa' />
              <img src='/mastercard.svg' alt='mastercard' />
              <img src='/tuya.jpg' alt='tuya' />
              <strong>3 cuotas sin interés de:</strong>
              {formatCurrency((producto.Precio * 1.15) / 3)}
            </p>

            <p className='metodos-pago'>
              <img src='/efectivo.png' alt='efectivo' />
              <strong>10% de descuento:</strong>
              {formatCurrency(producto.Precio * 0.9)}
            </p>
          </div>
        )}

        {error && <p className='error'>{error}</p>}
      </div>
    </div>
  )
}

export default App
