import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    accidentes: '',
    valor: '',
    modelo: 'A'
  })

  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const response = await axios.post('/api/poliza/calcular', {
        nombre: formData.nombre,
        edad: parseInt(formData.edad),
        accidentes: parseInt(formData.accidentes),
        valor: parseFloat(formData.valor),
        modelo: formData.modelo
      })

      setResultado(response.data)
    } catch (err) {
      setError('Error al calcular la póliza. Verifica que el servidor esté ejecutándose.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      edad: '',
      accidentes: '',
      valor: '',
      modelo: 'A'
    })
    setResultado(null)
    setError(null)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>🚗 Calculadora de Pólizas</h1>
          <p>Calcula el costo de tu seguro de automóvil</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Propietario</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edad">Edad</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                required
                min="0"
                placeholder="18"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accidentes">Nº de Accidentes</label>
              <input
                type="number"
                id="accidentes"
                name="accidentes"
                value={formData.accidentes}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="valor">Valor del Vehículo ($)</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="15000.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <select
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
              >
                <option value="A">Modelo A</option>
                <option value="B">Modelo B</option>
                <option value="C">Modelo C</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular Póliza'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Limpiar
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {resultado && (
          <div className={`result ${resultado.exitoso ? 'success' : 'error'}`}>
            <div className="result-header">
              <span className="result-icon">
                {resultado.exitoso ? '✅' : '❌'}
              </span>
              <h2>{resultado.exitoso ? 'Póliza Calculada' : 'Error en el Cálculo'}</h2>
            </div>

            <div className="result-content">
              {resultado.exitoso ? (
                <>
                  <div className="result-item">
                    <span className="label">Propietario:</span>
                    <span className="value">{resultado.propietarioNombre}</span>
                  </div>
                  <div className="result-item">
                    <span className="label">Categoría de Edad:</span>
                    <span className="value">{resultado.categoriaEdad}</span>
                  </div>
                  <div className="result-item highlight">
                    <span className="label">Costo Total:</span>
                    <span className="value price">
                      ${resultado.costoTotal.toLocaleString('es-ES', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="result-item">
                  <span className="error-message">{resultado.mensaje}</span>
                </div>
              )}
            </div>

            {resultado.mensaje && resultado.exitoso && (
              <div className="result-footer">
                <p>{resultado.mensaje}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Sistema de Cálculo de Pólizas • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
