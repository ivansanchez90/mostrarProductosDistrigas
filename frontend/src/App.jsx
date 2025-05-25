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
      // 1) Clonamos el objeto
      const prod = { ...res.data }

      // 2) Convertimos el precio (string) a number
      //    Si viene con coma decimal, normalizamos:
      const rawPrice = prod.precioventa
      const cleaned = String(rawPrice)
        .replace(/,/g, '.')
        .replace(/[^0-9.]/g, '')
      prod.precioventa = parseFloat(cleaned)

      setProducto(prod)
      setError(null)
    } catch (err) {
      setProducto(null)
      setError('Producto no encontrado')
      console.error('Error en la búsqueda:', err.response?.data || err.message)
    }
    setCodigo('')
  }

  const handleInput = (e) => {
    setCodigo(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      buscarProducto()
      setCodigo('')
    }
  }

  return (
    <div className='App'>
      <div className='header'>
        <div className='logo-section'>
          {/* <div className='logo-icon'>GD</div> */}
          {/* <div className='header-text'>
            <h1>Sistema de Consulta</h1>
            <div className='subtitle'>Grupo Distrigas</div>
          </div> */}
          <img src='/logo.png' alt='logo' />
        </div>
      </div>

      <div className='content'>
        <div className='search-section'>
          <h2 className='search-title'>Consulta de Productos</h2>

          <div className='input-container'>
            <input
              type='text'
              value={codigo}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder='Código de barras del producto'
              autoFocus
            />
          </div>

          <button className='search-button' onClick={buscarProducto}>
            Buscar Producto
          </button>

          {error && <div className='error'>{error}</div>}
        </div>

        <div className='results-section'>
          {!producto ? (
            <div className='empty-state'>
              <div className='search-icon'>🔍</div>
              <div>Ingrese un código para ver los detalles del producto</div>
            </div>
          ) : (
            <>
              <div className='producto-header'>
                <div className='producto-nombre'>{producto.nombre}</div>
                <div className='producto-codigo'>Código: {codigo}</div>
              </div>

              <div className='producto-content'>
                <div className='precio-section'>
                  <div className='precio-valor'>
                    {formatCurrency(producto.precioventa * 1.15)}
                  </div>
                  <div className='precio-label'>Precio de Lista</div>
                </div>

                <div className='metodos-pago'>
                  <div className='metodos-titulo'>Formas de Pago</div>

                  <div className='metodo-item destacado'>
                    <div className='metodo-left'>
                      <div className='metodo-iconos'>
                        <img src='/visa.svg' alt='Visa' />
                        <img src='/mastercard.svg' alt='Mastercard' />
                      </div>
                      <div className='metodo-texto'>6 cuotas sin interés</div>
                    </div>
                    <div className='metodo-precio'>
                      {formatCurrency((producto.precioventa * 1.15) / 6)}
                    </div>
                  </div>

                  <div className='metodo-item'>
                    <div className='metodo-left'>
                      <div className='metodo-iconos'>
                        <img src='/visa.svg' alt='Visa' />
                        <img src='/mastercard.svg' alt='Mastercard' />
                        <img src='/tuya.jpg' alt='Tuya' />
                      </div>
                      <div className='metodo-texto'>3 cuotas sin interés</div>
                    </div>
                    <div className='metodo-precio'>
                      {formatCurrency((producto.precioventa * 1.15) / 3)}
                    </div>
                  </div>

                  <div className='metodo-item'>
                    <div className='metodo-left'>
                      <div className='metodo-iconos'>
                        <img src='/efectivo.png' alt='Efectivo' />
                      </div>
                      <div className='metodo-texto'>
                        Efectivo / Transferencia
                        <span className='metodo-descuento'>15% OFF</span>
                      </div>
                    </div>
                    <div className='metodo-precio'>
                      {formatCurrency(producto.precioventa)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
