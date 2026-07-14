import { useState } from 'react';
import type { Task, CreateTaskInput } from '../../types/task';
import { TaskStatus, TaskTag } from '../../types/task';
import { mockUsers } from '../../mocks/data';
import styles from './TaskForm.module.css';

/*
  REACT CONCEPT: Controlled Components (Forms)
  -----------------------------------------------
  En React, los inputs del formulario son "controlados":
  su valor viene del estado de React, no del DOM.
  Cada input tiene un value={state} y un onChange={setState}.
  Esto nos da control total sobre los datos del form.

  REACT CONCEPT: Form Handling
  ------------------------------
  onSubmit previene el comportamiento default del browser
  (recargar la página) y maneja el envío con JavaScript.

  TYPESCRIPT CONCEPT: Generics en useState
  -------------------------------------------
  useState<TaskTag[]>([]) le dice a TypeScript que el estado
  es un array de TaskTag. Esto nos da type safety en todo
  el manejo de tags.
*/

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskInput) => void;
  onCancel: () => void;
}

const POINT_OPTIONS = [
  { value: 'ZERO', label: '0 Points' },
  { value: 'ONE', label: '1 Point' },
  { value: 'TWO', label: '2 Points' },
  { value: 'FOUR', label: '4 Points' },
  { value: 'EIGHT', label: '8 Points' },
];

export function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status ?? TaskStatus.BACKLOG,
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : '',
  );
  const [pointEstimate, setPointEstimate] = useState(
    initialData?.pointEstimate ?? 'ZERO',
  );
  const [tags, setTags] = useState<TaskTag[]>(initialData?.tags ?? []);
  const [assigneeId, setAssigneeId] = useState(
    initialData?.assignee?.id ?? '',
  );

  const handleTagToggle = (tag: TaskTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      status,
      dueDate: new Date(dueDate).toISOString(),
      pointEstimate,
      tags,
      assigneeId,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="task-name">
          Task Name
        </label>
        <input
          id="task-name"
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-status">
            Status
          </label>
          <select
            id="task-status"
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {Object.values(TaskStatus).map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-points">
            Points
          </label>
          <select
            id="task-points"
            className={styles.select}
            value={pointEstimate}
            onChange={(e) => setPointEstimate(e.target.value)}
          >
            {POINT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="task-date">
          Due Date
        </label>
        <input
          id="task-date"
          className={styles.input}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="task-assignee">
          Assignee
        </label>
        <select
          id="task-assignee"
          className={styles.select}
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {mockUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tags</label>
        <div className={styles.tagGroup}>
          {Object.values(TaskTag).map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${styles.tagButton} ${tags.includes(tag) ? styles.tagActive : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
