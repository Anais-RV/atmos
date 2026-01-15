/**
 * Componente: CitySelector
 * Propósito: Selector desplegable de ciudades con filtro por comunidad autónoma.
 * Usa: Primero mostrar comunidades, luego ciudades filtradas por comunidad.
 * Uso:
 *  - WeatherInfo.jsx (usado internamente para cambiar de ciudad)
 * Dependencias:
 *  - weather.css (.city-*, .search-icon)
 *  - lucide-react (icono Search)
 */

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import './weather.css'

function CitySelector({ onCitySelect }) {
  const [cities, setCities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
<<<<<<< HEAD
  const [selectedCommunidad, setSelectedCommunidad] = useState(null)
=======
  const [selectedRegion, setSelectedRegion] = useState('')
>>>>>>> beta
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/weather/cities/')
        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }
        const data = await response.json()
        // La API devuelve un array de todas las ciudades
        setCities(Array.isArray(data) ? data : (data.results || []))
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

  // Cerrar el dropdown cuando se hace click fuera del componente
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  /**
   * Obtiene comunidades autónomas únicas ordenadas alfabéticamente
   */
<<<<<<< HEAD
  const getComunidades = () => {
    const comunidades = new Set()
    cities.forEach(city => {
      if (city.comunidad_autonoma) {
        comunidades.add(city.comunidad_autonoma)
      }
    })
    return Array.from(comunidades).sort()
  }

  /**
   * Filtra ciudades por comunidad autónoma y término de búsqueda
   */
  const getFilteredCities = () => {
    let filtered = cities

    // Filtrar por comunidad autónoma si está seleccionada
    if (selectedCommunidad) {
      filtered = filtered.filter(city => city.comunidad_autonoma === selectedCommunidad)
    }

    // Filtrar por término de búsqueda
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (normalizedSearch) {
      filtered = filtered.filter(city =>
        ((city && city.name) || '').toLowerCase().includes(normalizedSearch)
      )
    }

    return filtered
  }

  /**
   * Maneja la selección de una comunidad autónoma
   */
  const handleSelectCommunidad = (comunidad) => {
    setSelectedCommunidad(comunidad)
    setSearchTerm('')
  }
=======
  const filteredCities = (() => {
    const q = searchTerm.trim().toLowerCase()
    // Si hay filtro por región activo, devolver ciudades solo de esa región
    if (selectedRegion) {
      return cities
        .filter(c => (c.comunidad_autonoma || '').toLowerCase() === selectedRegion.toLowerCase())
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    if (!q) return cities.sort((a, b) => a.name.localeCompare(b.name))

    // 1) Si el término coincide con alguna comunidad (parcial), mostrar todas las ciudades de esas comunidades
    const matchedRegions = Array.from(new Set(
      cities
        .map(c => c.comunidad_autonoma)
        .filter(Boolean)
        .filter(r => r.toLowerCase().includes(q))
    ))

    if (matchedRegions.length > 0) {
      return cities
        .filter(c => matchedRegions.includes(c.comunidad_autonoma))
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    // 2) si no hay regiones coincidentes, buscar por nombre o por comunidad en modo libre
    return cities.filter(city => {
      const matchesName = city.name.toLowerCase().includes(q)
      const matchesRegion = (city.comunidad_autonoma || '').toLowerCase().includes(q)
      return matchesName || matchesRegion
    }).sort((a, b) => a.name.localeCompare(b.name))
  })()
>>>>>>> beta

  /**
   * Maneja la selección de una ciudad
   */
  const handleSelectCity = (city) => {
    if (selectedCity) {
      setSelectedCity(null)
      setSearchTerm('')
    }
    
    setTimeout(() => {
      setSelectedCity(city)
<<<<<<< HEAD
      setSearchTerm('')
      setSelectedCommunidad(null)
=======
      // Mantener el texto de la comunidad si hay un filtro por región activo
      if (selectedRegion) {
        setSearchTerm(selectedRegion)
      } else {
        setSearchTerm('')
      }
>>>>>>> beta
      setIsOpen(false)
      onCitySelect(city.id)
    }, 0)
  }

  const comunidades = getComunidades()
  const filteredCities = getFilteredCities()

  return (
    <div className="city-selector-wrapper" ref={wrapperRef}>
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
            readOnly={!!selectedRegion}
            title={selectedRegion ? 'Filtrado por comunidad: ' + selectedRegion + ' — pulsa "Todas" para editar' : 'Buscar ciudad'}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown: Comunidades o Ciudades filtradas */}
        {isOpen && (
          <div className="city-dropdown">
<<<<<<< HEAD
            {loading ? (
              <div className="city-loading">Cargando ciudades…</div>
            ) : error ? (
              <div className="city-error">{error}</div>
            ) : !selectedCommunidad ? (
              // Mostrar comunidades autónomas
              comunidades.length > 0 ? (
                <>
                  <div className="city-section-title">Comunidades Autónomas</div>
                  <ul className="city-list">
                    {comunidades.map(comunidad => (
                      <li key={comunidad} className="city-item">
                        <button
                          className="city-button"
                          onClick={() => handleSelectCommunidad(comunidad)}
                        >
                          {comunidad}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="city-no-results">No hay comunidades disponibles</div>
              )
=======
            {/* Chips de regiones (filtrado) */}
            <div className="region-chips">
              <button
                className={`region-chip ${selectedRegion === '' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRegion('')
                  setSearchTerm('')
                  setIsOpen(true)
                }}
                type="button"
              >
                Todas
              </button>
              {/* Si hay región seleccionada, mostrar solo ese chip. Si no, mostrar todos */}
              {selectedRegion ? (
                <button
                  key={selectedRegion}
                  type="button"
                  className="region-chip active"
                  onClick={() => {
                    setSelectedRegion('')
                    setSearchTerm('')
                    setIsOpen(true)
                  }}
                >
                  {selectedRegion} ✕
                </button>
              ) : (
                Array.from(new Set(cities.map(c => c.comunidad_autonoma).filter(Boolean))).map(r => (
                  <button
                    key={r}
                    type="button"
                    className="region-chip"
                    onClick={() => {
                      setSelectedRegion(r)
                      setSearchTerm(r)
                      setIsOpen(true)
                    }}
                  >
                    {r}
                  </button>
                ))
              )}
            </div>
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
>>>>>>> beta
            ) : (
              // Mostrar ciudades de la comunidad seleccionada
              <>
                <div className="city-section-header">
                  <button
                    className="city-back-button"
                    onClick={() => {
                      setSelectedCommunidad(null)
                      setSearchTerm('')
                    }}
                  >
                    ← Volver
                  </button>
                  <span className="city-section-title">{selectedCommunidad}</span>
                </div>
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
                  <div className="city-no-results">No se encontraron ciudades</div>
                )}
              </>
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
              setIsOpen(false)
              if (typeof onCitySelect === 'function') onCitySelect(null)
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
