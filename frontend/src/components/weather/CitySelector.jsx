import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import '../styles/weather.css'

/**
 * Componente para seleccionar una ciudad
 * Puede conectarse a un endpoint que devuelva las ciudades disponibles
 */
function CitySelector({ onCitySelect }) {
  const [cities, setCities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Ciudades de demostración (reemplazar con datos de la API)
  const demoCities = [
    { id: 1, name: 'Madrid' },
    { id: 2, name: 'Barcelona' },
    { id: 3, name: 'Valencia' },
    { id: 4, name: 'Sevilla' },
    { id: 5, name: 'Bilbao' },
    { id: 6, name: 'Málaga' },
    { id: 7, name: 'Alicante' },
    { id: 8, name: 'Zaragoza' },
  ]

  useEffect(() => {
    // TODO: Reemplazar con llamada a API para obtener ciudades
    setCities(demoCities)
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
