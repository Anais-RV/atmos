/**
 * Componente: CitySelector
 * Propósito: Selector desplegable de ciudades con campo de búsqueda y lista filtrable.
 * Uso:
 *  - WeatherInfo.jsx (usado internamente para cambiar de ciudad)
 * Dependencias:
 *  - weather.css (.city-*, .search-icon)
 *  - lucide-react (icono Search)
 */

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import apiClient from '../../../services/apiClient'
import './weather.css'

function CitySelector({ onCitySelect }) {
  const [cities, setCities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiClient('/api/weather/cities/')
        // La API devuelve un array de todas las ciudades
        setCities(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error al cargar ciudades:', err)
        setError('Error al cargar ciudades')
        setCities([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchCities()
  }, [])

  /**
   * Filtra las ciudades según el término de búsqueda
   */
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /**
   * Maneja la selección de una ciudad
   */
  const handleSelectCity = (city) => {
    // Si ya hay una ciudad seleccionada, primero la limpiamos
    if (selectedCity) {
      setSelectedCity(null)
      setSearchTerm('')
    }
    
    // Luego seleccionamos la nueva ciudad
    setTimeout(() => {
      setSelectedCity(city)
      setSearchTerm('')
      setIsOpen(false)
      onCitySelect(city.id)
    }, 0)
  }

  return (
    <div className="city-selector-wrapper">
      <div className="city-selector-container">
        {/* Input de búsqueda */}
        <div className="city-search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="city-search-input"
            placeholder="Buscar ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown de ciudades */}
        {isOpen && (
          <div className="city-dropdown">
            {filteredCities.length > 0 ? (
              <ul className="city-list">
                {filteredCities.map(city => (
                  <li key={city.id} className="city-item">
                    <button
                      className={`city-button ${selectedCity?.id === city.id ? 'active' : ''}`}
                      onClick={() => handleSelectCity(city)}
                    >
                      {city.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="city-no-results">
                No se encontraron ciudades
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ciudad seleccionada mostrada como tag */}
      {selectedCity && (
        <div className="selected-city-tag">
          {selectedCity.name}
          <button
            className="city-tag-close"
            onClick={() => {
              setSelectedCity(null)
              setSearchTerm('')
            }}
            title="Limpiar selección"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default CitySelector
