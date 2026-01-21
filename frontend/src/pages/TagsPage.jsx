import { useState, useEffect, useReducer, useCallback } from "react";
import PropTypes from 'prop-types';
import { Trash2, Plus, Loader, AlertCircle, Edit2, X } from "lucide-react";
import BasePageLayout from "../components/layout/BasePageLayout";
import { getTemperatureColor } from "../styles/temperatureColors";
import { usePreferences } from '../context/usePreferences';
import { useLanguage } from "../context/useLanguage";
import { tagsService } from "../services/tagsService";
import "../styles/tags.css";

// ============================================================================
// Constants
// ============================================================================

const TAG_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

const ACTIONS = {
  LOAD_TAGS: 'LOAD_TAGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TOAST: 'SET_TOAST',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_TOAST: 'CLEAR_TOAST',
  START_CREATE: 'START_CREATE',
  CANCEL_CREATE: 'CANCEL_CREATE',
  START_EDIT: 'START_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  START_DELETE: 'START_DELETE',
  CANCEL_DELETE: 'CANCEL_DELETE',
  TOGGLE_SELECT: 'TOGGLE_SELECT',
  CLEAR_SELECTED: 'CLEAR_SELECTED',
};

const initialState = {
  tags: [],
  loading: false,
  error: null,
  toast: null,
  creating: false,
  editingId: null,
  deletingId: null,
  selectedIds: new Set(),
};

// styles moved to ../styles/tags.css

// ============================================================================
// Reducer
// ============================================================================

function tagReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_TAGS:
      return { ...state, tags: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_TOAST:
      return { ...state, toast: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.CLEAR_TOAST:
      return { ...state, toast: null };
    case ACTIONS.START_CREATE:
      return { ...state, creating: true };
    case ACTIONS.CANCEL_CREATE:
      return { ...state, creating: false };
    case ACTIONS.START_EDIT:
      return { ...state, editingId: action.payload };
    case ACTIONS.CANCEL_EDIT:
      return { ...state, editingId: null };
    case ACTIONS.START_DELETE:
      return { ...state, deletingId: action.payload };
    case ACTIONS.CANCEL_DELETE:
      return { ...state, deletingId: null };
    case ACTIONS.TOGGLE_SELECT: {
      const newSelected = new Set(state.selectedIds);
      newSelected.has(action.payload) 
        ? newSelected.delete(action.payload)
        : newSelected.add(action.payload);
      return { ...state, selectedIds: newSelected };
    }
    case ACTIONS.CLEAR_SELECTED:
      return { ...state, selectedIds: new Set() };
    default:
      return state;
  }
}

// ============================================================================
// Main Component
// ============================================================================

export default function TagsPage() {
  const [state, dispatch] = useReducer(tagReducer, initialState);
  const { preferences } = usePreferences();
  const { t } = useLanguage();
  const theme = preferences?.theme || 'dark';
  const containerColor = getTemperatureColor(7);

  const sortedTags = [...state.tags].sort((a, b) => a.name.localeCompare(b.name));

  // Load tags on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('tags.notAuthenticated') });
      return;
    }

    let mounted = true;
    const load = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const data = await tagsService.getTags();
        if (mounted) {
          dispatch({ type: ACTIONS.LOAD_TAGS, payload: Array.isArray(data) ? data : [] });
        }
      } catch (err) {
        if (mounted) {
          dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || t('tags.errorLoading') });
        }
      } finally {
        if (mounted) {
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [t]);

  // Toast timeout
  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: ACTIONS.CLEAR_TOAST }), 3500);
    return () => clearTimeout(timer);
  }, [state.toast]);

  // Operations
  const createTag = useCallback(async (name, color) => {
    if (!name || !name.trim()) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('tags.errorEmpty') });
      return false;
    }
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await tagsService.createTag(name.trim(), color);
      const data = await tagsService.getTags();
      dispatch({ type: ACTIONS.LOAD_TAGS, payload: Array.isArray(data) ? data : [] });
      dispatch({ type: ACTIONS.SET_TOAST, payload: t('tags.tagCreated') });
      dispatch({ type: ACTIONS.CANCEL_CREATE });
      return true;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      return false;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [t]);

  const updateTag = useCallback(async (id, name, color) => {
    if (!name || !name.trim()) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: t('tags.errorEmpty') });
      return false;
    }
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await tagsService.updateTag(id, name.trim(), color);
      const data = await tagsService.getTags();
      dispatch({ type: ACTIONS.LOAD_TAGS, payload: Array.isArray(data) ? data : [] });
      dispatch({ type: ACTIONS.SET_TOAST, payload: t('tags.tagUpdated') });
      dispatch({ type: ACTIONS.CANCEL_EDIT });
      return true;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      return false;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [t]);

  const deleteTag = useCallback(async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await tagsService.deleteTag(id);
      const data = await tagsService.getTags();
      dispatch({ type: ACTIONS.LOAD_TAGS, payload: Array.isArray(data) ? data : [] });
      dispatch({ type: ACTIONS.SET_TOAST, payload: t('tags.tagDeleted') });
      dispatch({ type: ACTIONS.CANCEL_DELETE });
      return true;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      return false;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [t]);

  const batchDelete = useCallback(async () => {
    const ids = Array.from(state.selectedIds);
    if (!ids.length) return false;
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    let deleted = 0;
    const errors = [];
    try {
      await Promise.all(ids.map(async (id) => {
        try {
          await tagsService.deleteTag(id);
          deleted++;
        } catch {
          errors.push(id);
        }
      }));
      const data = await tagsService.getTags();
      dispatch({ type: ACTIONS.LOAD_TAGS, payload: Array.isArray(data) ? data : [] });
      dispatch({ type: ACTIONS.SET_TOAST, payload: `${deleted} ${t('tags.tagDeleted')}` });
      dispatch({ type: ACTIONS.CLEAR_SELECTED });
      if (errors.length) dispatch({ type: ACTIONS.SET_ERROR, payload: `${errors.length} ${t('tags.errorDeleting')}` });
      return true;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      return false;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.selectedIds, t]);

  return (
    <BasePageLayout 
      title={t('tags.title')} 
      description={t('tags.title')} 
      containerColor={containerColor}
    >
      <section className="dashboard-center">
        <section className={`center-card center-card-full ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
          <h2 className="center-card-title">{t('tags.title')}</h2>
          <p className="center-card-text">{t('tags.title')}</p>

          <div className="history-main-viewport">
            <div className="tag-manager-container">
              {state.error && (
                <Alert type="error" message={state.error} onClose={() => dispatch({ type: ACTIONS.CLEAR_ERROR })} />
              )}

              <div className="tag-create-bar">
                <button className="btn btn-primary" onClick={() => dispatch({ type: ACTIONS.START_CREATE })}><Plus size={14} /> {t('tags.newTag')}</button>
              </div>

              {state.selectedIds.size > 0 && (
                <BatchBar count={state.selectedIds.size} onDelete={batchDelete} disabled={state.loading} t={t} />
              )}

              {state.creating && (
                <TagFormCard onCancel={() => dispatch({ type: ACTIONS.CANCEL_CREATE })} onSubmit={createTag} t={t} />
              )}

              <TagGrid
                isLoading={state.loading && sortedTags.length === 0}
                tags={sortedTags}
                selectedIds={state.selectedIds}
                editingId={state.editingId}
                deletingId={state.deletingId}
                onToggleSelect={(id) => dispatch({ type: ACTIONS.TOGGLE_SELECT, payload: id })}
                onEdit={(id) => dispatch({ type: ACTIONS.START_EDIT, payload: id })}
                onCancelEdit={() => dispatch({ type: ACTIONS.CANCEL_EDIT })}
                onSaveEdit={updateTag}
                onDelete={(id) => dispatch({ type: ACTIONS.START_DELETE, payload: id })}
                onCancelDelete={() => dispatch({ type: ACTIONS.CANCEL_DELETE })}
                onConfirmDelete={deleteTag}
                t={t}
              />

              {state.toast && (
                <Toast message={state.toast} onClose={() => dispatch({ type: ACTIONS.CLEAR_TOAST })} />
              )}
            </div>
          </div>
        </section>
      </section>
    </BasePageLayout>
  );
}

// ============================================================================
// Sub Components
// ============================================================================

function Alert({ type, message, onClose }) {
  return (
    <div className={`tag-manager-alert tag-manager-alert-${type}`}>
      <AlertCircle size={18} />
      <span>{message}</span>
      <button onClick={onClose} className="tag-manager-alert-close">×</button>
    </div>
  );
}

function BatchBar({ count, onDelete, disabled, t }) {
  return (
    <div className="tag-batch-actions">
      <span className="tag-batch-count">
        {count} {t('tags.deleteTag')}
      </span>
      <button 
        className="tag-batch-delete-btn" 
        onClick={onDelete}
        disabled={disabled}
      >
        <Trash2 size={16} /> {t('common.delete')}
      </button>
    </div>
  );
}

function TagFormCard({ onCancel, onSubmit, t }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(TAG_COLORS[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(name, color);
    setName('');
    setColor(TAG_COLORS[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="tag-form-card">
      <div className="form-group">
        <label>{t('tags.tagName')}</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('tags.tagName')}
          autoFocus
          required
        />
      </div>

      <div className="form-group">
        <label>Color</label>
        <div className="color-picker">
          {TAG_COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${color === c ? 'active' : ''} tag-color-${TAG_COLORS.indexOf(c)+1}`}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-primary"
        >{t('common.cancel')}</button>
        <button type="submit" className="btn btn-primary">{t('tags.create')}</button>
      </div>
    </form>
  );
}

function TagGrid({
  isLoading,
  tags,
  selectedIds,
  editingId,
  deletingId,
  onToggleSelect,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
  t,
}) {
  if (isLoading) {
    return <div className="loading-center"><Loader size={32} /></div>;
  }

  if (tags.length === 0) {
    return <div className="empty-state"><p>{t('tags.noTags')}</p></div>;
  }

  return (
    <div className="tag-manager-grid">
      {tags.map(tag => (
        <TagCard
          key={tag.id}
          tag={tag}
          isSelected={selectedIds.has(tag.id)}
          isEditing={editingId === tag.id}
          isDeleting={deletingId === tag.id}
          onToggleSelect={() => onToggleSelect(tag.id)}
          onEdit={() => onEdit(tag.id)}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDelete={() => onDelete(tag.id)}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={() => onConfirmDelete(tag.id)}
          t={t}
        />
      ))}
    </div>
  );
}

function TagCard({
  tag,
  isSelected,
  isEditing,
  isDeleting,
  onToggleSelect,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
  t,
}) {
  const [editName, setEditName] = useState(tag.name);
  const [editColor, setEditColor] = useState(tag.color);

  if (isEditing) {
    return (
      <div className="tag-card tag-card-editing">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="tag-edit-input"
          autoFocus
        />
        <div className="color-picker">
          {TAG_COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${editColor === c ? 'active' : ''} tag-color-${TAG_COLORS.indexOf(c)+1}`}
              onClick={() => setEditColor(c)}
            />
          ))}
        </div>
        <div className="tag-card-actions">
          <button
            onClick={onCancelEdit}
            className="btn btn-sm btn-primary"
          >{t('common.cancel')}</button>
          <button 
            onClick={() => onSaveEdit(tag.id, editName, editColor)} 
            className="btn btn-sm btn-primary"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="tag-card tag-card-deleting">
        <p>{t('tags.confirmDelete')} {tag.name}?</p>
        <div className="form-actions">
          <button
            onClick={onCancelDelete}
            className="btn btn-primary"
          >{t('common.cancel')}</button>
          <button onClick={onConfirmDelete} className="btn btn-danger">{t('common.delete')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`tag-card ${isSelected ? 'selected' : ''}`}>
      <label className="tag-checkbox">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={onToggleSelect}
        />
      </label>
      <span className={`tag-badge tag-color-${TAG_COLORS.indexOf(tag.color)+1}`}>
        {tag.name}
      </span>
      <div className="tag-card-actions">
        <button onClick={onEdit} className="btn btn-sm" title={t('common.edit')}>
          <Edit2 size={16} />
        </button>
        <button onClick={onDelete} className="btn btn-sm btn-danger" title={t('common.delete')}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  return (
    <div className="toast-root">
      <div className="toast">
        <div className="toast-content">{message}</div>
        <button onClick={onClose} className="toast-close">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

// PropTypes
Alert.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
BatchBar.propTypes = {
  count: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  t: PropTypes.func.isRequired,
};
TagFormCard.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
TagGrid.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired,
  selectedIds: PropTypes.instanceOf(Set).isRequired,
  editingId: PropTypes.number,
  deletingId: PropTypes.number,
  onToggleSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancelDelete: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
TagCard.propTypes = {
  tag: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancelDelete: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
