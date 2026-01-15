import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { Trash2, Plus, Loader, AlertCircle, Edit2 } from "lucide-react";
import { usePreferences } from '../context/usePreferences';
import { tagsService } from "../services/tagsService";
import "../styles/Tags.css";

const TAG_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function TagsPage() {
  const temperatureC = 7;
  const containerColor = getTemperatureColor(temperatureC);

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // modal state: { open: boolean, mode: 'create'|'edit'|'delete', tag: object|null }
  const [modal, setModal] = useState({ open: false, mode: null, tag: null });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const { preferences } = usePreferences();
  const theme = preferences?.theme || 'dark';

  const loadTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagsService.getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar etiquetas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) loadTags();
    else setError("No estás autenticado. Por favor, inicia sesión.");
  }, [loadTags]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const createTag = useCallback(
    async (payload) => {
      if (!payload.name.trim()) {
        setError("El nombre de la etiqueta no puede estar vacío");
        return false;
      }
      setError(null);
      try {
        await tagsService.createTag(payload.name.trim(), payload.color);
        await loadTags();
        setToast("Etiqueta creada");
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [loadTags]
  );


  const startEdit = useCallback((tag) => {
    // open inline editor for this tag
    setEditingId(tag.id);
  }, []);

  const saveEdit = useCallback(
    async (payload) => {
      if (!payload.name.trim()) {
        setError("El nombre de la etiqueta no puede estar vacío");
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        await tagsService.updateTag(payload.id, payload.name.trim(), payload.color);
        await loadTags();
        setToast("Etiqueta actualizada");
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadTags]
  );

  const cancelEdit = useCallback(() => {
  setModal({ open: false, mode: null, tag: null });
  setEditingId(null);
  }, []);

  const deleteTag = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await tagsService.deleteTag(id);
        await loadTags();
        setToast("Etiqueta eliminada");
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadTags]
  );

  const openModal = useCallback((mode, tag = null) => setModal({ open: true, mode, tag }), []);
  const closeModal = useCallback(() => setModal({ open: false, mode: null, tag: null }), []);

  const startDelete = useCallback((tag) => {
    setDeletingId(tag.id);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeletingId(null);
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((s) => {
      const copy = new Set(s);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }, []);

  const batchDeleteSelected = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) {
      setError('No hay etiquetas seleccionadas');
      return false;
    }
    setLoading(true);
    setError(null);
    let deleted = 0;
    const errors = [];
    try {
      await Promise.all(
        ids.map(async (id) => {
          try {
            await tagsService.deleteTag(id);
            deleted += 1;
          } catch (e) {
            errors.push({ id, message: e.message });
          }
        })
      );
      await loadTags();
      setSelectedIds(new Set());
      setToast(`${deleted} etiqueta${deleted !== 1 ? 's' : ''} eliminada${deleted !== 1 ? 's' : ''}`);
      return true;
    } finally {
      setLoading(false);
      if (errors.length) setError(`${errors.length} eliminación(es) fallida(s)`);
    }
  }, [selectedIds, loadTags]);

  const sorted = useMemo(() => [...tags].sort((a, b) => a.name.localeCompare(b.name)), [tags]);

  // add/remove a class on body when modal opens so fixed-level modals can be
  // targeted reliably. Also add a dark variant when theme is dark.
  useEffect(() => {
    try {
      const body = document?.body;
      if (!body) return;
      const rootCls = 'modal-root';
      const darkCls = 'modal-root-dark';
      if (modal.open) {
        body.classList.add(rootCls);
        if (theme === 'dark') body.classList.add(darkCls);
        else body.classList.remove(darkCls);
      } else {
        body.classList.remove(rootCls);
        body.classList.remove(darkCls);
      }
      return () => {
        body.classList.remove(rootCls);
        body.classList.remove(darkCls);
      };
    } catch (e) {
      // ignore in non-DOM environments
    }
  }, [modal.open, theme]);

  return (
    <BasePageLayout title="Mis etiquetas" description="Gestiona tus etiquetas" containerColor={containerColor}>
      <section className="dashboard-center">
        {/* Banner showing currently editing/selected tag (subtle) */}
        {modal.open && modal.mode === 'edit' && modal.tag && (
          <div className={`tag-editing-banner ${theme === 'dark' ? 'dark' : 'light'}`}>Editando: {modal.tag.name}</div>
        )}

        <section className={`center-card center-card-full ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
          <h2 className="center-card-title">Mis etiquetas</h2>
          <p className="center-card-text">Crea, edita y elimina tus etiquetas personalizadas</p>

          <div className="history-main-viewport">
            <div className="tag-manager-container">
              {error && (
                <div className="tag-manager-alert tag-manager-alert-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="tag-manager-alert-close">×</button>
                </div>
              )}

              <div className="tag-create-bar">
                <button className="tag-create-action" onClick={() => setCreating(true)} aria-label="Crear etiqueta">
                  <Plus size={16} /> Crear etiqueta
                </button>
                <div style={{ flex: 1 }} />
                <button className="tag-manager-button" onClick={() => openModal('select')}>Seleccionar etiquetas</button>
              </div>

              {/* Inline create form (replaces popup) */}
              {creating && (
                <div className="tag-create-inline">
                  <TagForm theme={theme} initial={{ name: '', color: TAG_COLORS[0] }} onCancel={() => setCreating(false)} onConfirm={async (payload) => { const ok = await createTag(payload); if (ok) setCreating(false); }} />
                </div>
              )}

              <div className="tag-manager-list">
                {loading && !sorted.length ? (
                  <div className="tag-manager-loading"><Loader size={28} /></div>
                ) : sorted.length === 0 ? (
                  <div className="tag-manager-empty"><p>No hay etiquetas todavía.</p></div>
                ) : (
                  <div className="tag-manager-grid">
                    {sorted.map((tag) => (
                      <article key={tag.id} className={`tag-manager-item ${selectedIds.has(tag.id) ? 'selected' : ''}`} aria-label={`Etiqueta ${tag.name}`}>
                        <div className="tag-manager-tag-display" onClick={() => toggleSelect(tag.id)} style={{ cursor: 'pointer' }}>
                          <input type="checkbox" checked={selectedIds.has(tag.id)} readOnly />
                          <span className="tag-manager-tag-badge" style={{ backgroundColor: tag.color, marginLeft: 8 }}>{tag.name}</span>
                        </div>

                        {/* Inline editor area: if this tag is being edited, render TagForm here */}
                        {editingId === tag.id ? (
                          <div className="tag-inline-editor">
                            <TagForm
                              theme={theme}
                              initial={{ id: tag.id, name: tag.name, color: tag.color }}
                              onCancel={() => setEditingId(null)}
                              onConfirm={async (payload) => {
                                const ok = await saveEdit(payload);
                                if (ok) setEditingId(null);
                              }}
                            />
                          </div>
                        ) : null}

                        <div className="tag-manager-tag-actions">
                          <button className="tag-manager-button tag-manager-button-small tag-manager-button-secondary" onClick={() => startEdit(tag)} aria-label={`Editar ${tag.name}`}><Edit2 size={14} />
                          </button>
                          <button className="tag-manager-button tag-manager-button-small tag-manager-button-danger" onClick={() => startDelete(tag)} aria-label={`Eliminar ${tag.name}`}><Trash2 size={14} /></button>
                        </div>

                        {/* Inline delete confirm: if this tag is pending delete, show ConfirmBox */}
                        {deletingId === tag.id ? (
                          <div className="tag-inline-delete">
                            <ConfirmBox
                              message={`¿Eliminar etiqueta "${tag.name}"?`}
                              onCancel={() => setDeletingId(null)}
                              onConfirm={async () => {
                                const ok = await deleteTag(tag.id);
                                if (ok) setDeletingId(null);
                              }}
                            />
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="toast-root" aria-live="polite">
                {toast && (
                  <div className="toast toast-success">
                    <div className="toast-body"><strong>Éxito</strong><div className="toast-message">{toast}</div></div>
                    <button className="toast-close" onClick={() => setToast(null)}>×</button>
                  </div>
                )}
              </div>

              {/* Inline edit/delete handling. Keep the select modal for batch actions. */}

              {modal.open && modal.mode === 'select' && (
                <Modal onClose={closeModal} title={`Seleccionar etiquetas (${selectedIds.size})`} theme={theme} embedded={true}>
                  <ConfirmApply count={selectedIds.size} onCancel={closeModal} onConfirm={async () => { const ok = await batchDeleteSelected(); if (ok) closeModal(); }} />
                </Modal>
              )}
            </div>
          </div>
  </section>
      </section>
    </BasePageLayout>
  );
}

export default TagsPage;

/* Small local UI components */
function Modal({ children, onClose, title, theme, embedded = false }) {
  let dark = theme === 'dark';
  try {
    // also detect document/body classes in case theme prop is stale
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;
      if (root && root.classList.contains('theme-dark')) dark = true;
      if (body && body.classList.contains('modal-root-dark')) dark = true;
    }
  } catch (e) {
    // ignore
  }

  const modalStyle = dark
    ? { background: '#071328', color: '#e6eef6', boxShadow: '0 30px 80px rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.04)' }
    : undefined;
  const backdropStyle = dark ? { background: 'linear-gradient(180deg, rgba(2,6,23,0.72), rgba(2,6,23,0.84))' } : undefined;

  const headerStyle = dark ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : undefined;

  if (embedded) {
    // render inline (no fixed backdrop) so the modal inherits parent theme/styles
    return (
      <div className="modal-embedded" style={{ padding: '0.6rem' }}>
        <div className="modal modal-embedded-inner" style={modalStyle} role="dialog" aria-modal="true">
          <div className="modal-header" style={headerStyle}>
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose} style={backdropStyle}>
      <div className="modal" style={modalStyle} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header" style={headerStyle}>
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function TagForm({ theme, initial = { name: '', color: TAG_COLORS[0], id: null }, onCancel, onConfirm }) {
  const [state, setState] = useState({ ...initial });
  let dark = theme === 'dark';
  try {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;
      if (root && root.classList.contains('theme-dark')) dark = true;
      if (body && body.classList.contains('modal-root-dark')) dark = true;
    }
  } catch (e) {}

  const inputStyle = dark ? { background: 'rgba(255,255,255,0.03)', color: '#e6eef6', borderColor: 'rgba(255,255,255,0.06)' } : undefined;
  const labelStyle = dark ? { color: '#cbd5e1' } : undefined;

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onConfirm(state); }} className="tag-form">
      <label style={labelStyle}>Nombre</label>
      <input style={inputStyle} className="tag-create-input" value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} />
      <label style={labelStyle}>Color</label>
      <div className="tag-create-colors">
        {TAG_COLORS.map((c) => (
          <button key={c} type="button" className={`tag-create-color ${state.color === c ? 'selected' : ''}`} style={{ backgroundColor: c }} onClick={() => setState((s) => ({ ...s, color: c }))} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" className="tag-manager-button tag-manager-button-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="tag-manager-button tag-manager-button-success">Confirmar</button>
      </div>
    </form>
  );
}

function ConfirmBox({ message, onCancel, onConfirm }) {
  return (
    <div className="confirm-box">
      <p>{message}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="tag-manager-button tag-manager-button-secondary" onClick={onCancel}>Cancelar</button>
        <button className="tag-manager-button tag-manager-button-danger" onClick={onConfirm}>Eliminar</button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};
Modal.defaultProps = { theme: 'dark' };
Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  theme: PropTypes.string,
};

TagForm.propTypes = {
  theme: PropTypes.string,
  initial: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmBox.propTypes = {
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

function ConfirmApply({ count, onCancel, onConfirm }) {
  return (
    <div>
      <p>Acción por lotes sobre {count} etiqueta{count !== 1 ? 's' : ''} seleccionada{count !== 1 ? 's' : ''}.</p>
      <p>¿Deseas eliminar todas las etiquetas seleccionadas?</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="tag-manager-button tag-manager-button-secondary" onClick={onCancel}>Cancelar</button>
        <button className="tag-manager-button tag-manager-button-danger" onClick={onConfirm}>Eliminar seleccionadas</button>
      </div>
    </div>
  );
}

ConfirmApply.propTypes = {
  count: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
