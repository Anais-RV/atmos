/**
 * Componente: TagManager
 * Propósito: Gestionar etiquetas personalizadas del usuario (CRUD)
 * Dependencias:
 *  - tagsService.js (para llamadas a API)
 *  - tags.css (estilos)
 */

import { useState, useEffect } from 'react'
import { Trash2, Plus, Loader, AlertCircle } from 'lucide-react'
import { tagsService } from '../../../services/tagsService'
import './tags.css'

const TAG_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
]

function TagManager() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form state
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  // Cargar etiquetas al montar
  useEffect(() => {
    loadTags()
  }, [])

  /**
   * Cargar etiquetas del backend
   */
  const loadTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tagsService.getTags()
      setTags(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Error al cargar etiquetas')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Crear nueva etiqueta
   */
  const handleCreateTag = async (e) => {
    e.preventDefault()

    if (!newTagName.trim()) {
      setError('El nombre de la etiqueta no puede estar vacío')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await tagsService.createTag(newTagName.trim(), newTagColor)
      setSuccess('Etiqueta creada exitosamente')
      setNewTagName('')
      setNewTagColor(TAG_COLORS[0])
      await loadTags()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Iniciar edición de etiqueta
   */
  const handleStartEdit = (tag) => {
    setEditingId(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color)
  }

  /**
   * Guardar cambios de etiqueta
   */
  const handleSaveEdit = async (tagId) => {
    if (!editName.trim()) {
      setError('El nombre de la etiqueta no puede estar vacío')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await tagsService.updateTag(tagId, editName.trim(), editColor)
      setSuccess('Etiqueta actualizada exitosamente')
      setEditingId(null)
      await loadTags()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cancelar edición
   */
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditColor('')
  }

  /**
   * Eliminar etiqueta
   */
  const handleDeleteTag = async (tagId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta etiqueta?')) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      await tagsService.deleteTag(tagId)
      setSuccess('Etiqueta eliminada exitosamente')
      await loadTags()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tag-manager-container">
      <div className="tag-manager-header">
        <h2>Mis Etiquetas</h2>
        <p className="tag-manager-subtitle">Gestiona tus etiquetas personalizadas</p>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="tag-manager-alert tag-manager-alert-error" role="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="tag-manager-alert-close">×</button>
        </div>
      )}

      {success && (
        <div className="tag-manager-alert tag-manager-alert-success" role="alert">
          <span>✓ {success}</span>
          <button onClick={() => setSuccess(null)} className="tag-manager-alert-close">×</button>
        </div>
      )}

      {/* Formulario crear etiqueta */}
      <form className="tag-manager-form" onSubmit={handleCreateTag}>
        <div className="tag-manager-form-group">
          <label className="tag-manager-label">Nombre de la etiqueta</label>
          <input
            type="text"
            className="tag-manager-input"
            placeholder="Ej: Importante, Urgente, Personal..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            disabled={loading}
            maxLength="50"
          />
        </div>

        <div className="tag-manager-form-group">
          <label className="tag-manager-label">Color</label>
          <div className="tag-manager-color-picker">
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`tag-manager-color-option ${newTagColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTagColor(color)}
                title={`Seleccionar color ${color}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="tag-manager-button tag-manager-button-primary"
          disabled={loading || !newTagName.trim()}
        >
          {loading ? (
            <>
              <Loader size={18} className="tag-manager-spinner" />
              Creando...
            </>
          ) : (
            <>
              <Plus size={18} />
              Crear Etiqueta
            </>
          )}
        </button>
      </form>

      {/* Lista de etiquetas */}
      <div className="tag-manager-list">
        {loading && !tags.length ? (
          <div className="tag-manager-loading">
            <Loader className="tag-manager-spinner" size={32} />
            <p>Cargando etiquetas...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="tag-manager-empty">
            <p>No tienes etiquetas aún. ¡Crea una para empezar!</p>
          </div>
        ) : (
          <div className="tag-manager-grid">
            {tags.map((tag) => (
              <div key={tag.id} className="tag-manager-item">
                {editingId === tag.id ? (
                  // Modo edición
                  <div className="tag-manager-edit-form">
                    <input
                      type="text"
                      className="tag-manager-input tag-manager-input-small"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength="50"
                    />
                    <div className="tag-manager-color-picker-small">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`tag-manager-color-option-small ${editColor === color ? 'selected' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditColor(color)}
                        />
                      ))}
                    </div>
                    <div className="tag-manager-edit-actions">
                      <button
                        className="tag-manager-button tag-manager-button-small tag-manager-button-success"
                        onClick={() => handleSaveEdit(tag.id)}
                        disabled={loading}
                      >
                        Guardar
                      </button>
                      <button
                        className="tag-manager-button tag-manager-button-small tag-manager-button-secondary"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <>
                    <div className="tag-manager-tag-display">
                      <span
                        className="tag-manager-tag-badge"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </div>
                    <div className="tag-manager-tag-actions">
                      <button
                        className="tag-manager-button tag-manager-button-small tag-manager-button-secondary"
                        onClick={() => handleStartEdit(tag)}
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        className="tag-manager-button tag-manager-button-small tag-manager-button-danger"
                        onClick={() => handleDeleteTag(tag.id)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TagManager
