import { useState } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { TaskColumn } from '../../components/TaskColumn';
import { Modal } from '../../components/Modal';
import { TaskForm } from '../../components/TaskForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SearchFilter } from '../../components/SearchFilter';
import { EmptyState } from '../../components/EmptyState';
import { ToastContainer } from '../../components/Toast';
import { useTasks } from '../../hooks/useTasks';
import { useToast } from '../../hooks/useToast';
import type { Task, CreateTaskInput } from '../../types/task';
import { TaskStatus } from '../../types/task';
import styles from './Dashboard.module.css';

/*
  REACT CONCEPT: State Management at Page Level
  -------------------------------------------------
  Dashboard es el "smart component" (o container).
  Maneja todo el estado y la lógica, y pasa data/callbacks
  a los componentes "presentacionales" (TaskColumn, Modal, etc.)

  Este patrón se llama "Container/Presentational" y es uno
  de los más importantes en React. Los componentes de UI
  no saben de dónde vienen los datos.

  Aquí usamos múltiples useState para diferentes piezas de UI:
  - showCreateModal / showEditModal / showDeleteConfirm
  - selectedTask (la tarea que se está editando/borrando)
  - searchOpen (barra de filtros visible/oculta)
  - viewMode (grid/list - solo UI por ahora)

  Todo el CRUD viene del custom hook useTasks.
  Las notificaciones vienen del custom hook useToast.
*/

const COLUMNS = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
];

export function Dashboard() {
  const {
    tasks,
    filters,
    setFilters,
    clearFilters,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const { toasts, showToast, removeToast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleCreate = (input: CreateTaskInput) => {
    const result = createTask(input);
    if (result.success) {
      showToast('Task created successfully', 'success');
      setShowCreateModal(false);
    } else {
      showToast('Failed to create task', 'error');
    }
  };

  const handleUpdate = (input: CreateTaskInput) => {
    if (!editingTask) return;
    const result = updateTask({ id: editingTask.id, ...input });
    if (result.success) {
      showToast('Task updated successfully', 'success');
      setEditingTask(null);
    } else {
      showToast('Failed to update task', 'error');
    }
  };

  const handleDelete = () => {
    if (!deletingTaskId) return;
    const result = deleteTask(deletingTaskId);
    if (result.success) {
      showToast('Task deleted successfully', 'success');
      setDeletingTaskId(null);
    } else {
      showToast('Failed to delete task', 'error');
    }
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0),
  );
  const noResults = hasFilters && tasks.length === 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.toolbar}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.activeView : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.activeView : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>

        <div className={styles.toolbarRight}>
          <button
            className={`${styles.viewButton} ${searchOpen ? styles.activeView : ''}`}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            Filter
          </button>
          <button className={styles.addButton} onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <SearchFilter
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
        />
      )}

      {noResults ? (
        <EmptyState message="No tasks match the current filters" />
      ) : (
        <div className={styles.board}>
          {COLUMNS.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={setDeletingTaskId}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
