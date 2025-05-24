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

    try {
      const res = await axios.get(`http://localhost:3001/producto/${codigo}`)
      setProducto(res.data)
      setError(null)
    } catch (err) {
      setProducto(null)
      setError('Producto no encontrado')
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
              <strong>Nombre:</strong> {producto.Nombre}
            </p>
            <p>
              <strong>Descripción:</strong> {producto.Descripción}
            </p>
            <p>
              <strong>Precio Lista:</strong> {formatCurrency(producto.Precio)}
            </p>
            <p className='metodos-pago'>
              <img src='/visa.svg' alt='visa' />
              <img src='/mastercard.svg' alt='mastercard' />
              <strong>6 cuotas sin interés de: </strong>
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
