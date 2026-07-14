import type { FilterInput } from '../../types/task';
import { TaskStatus } from '../../types/task';
import { mockUsers } from '../../mocks/data';
import styles from './SearchFilter.module.css';

/*
  REACT CONCEPT: Controlled Inputs + Callbacks
  -----------------------------------------------
  Este componente recibe los filtros actuales como props
  y notifica cambios al padre via onChange.
  Es un patrón "controlled" donde el padre controla el estado.
*/

interface SearchFilterProps {
  filters: FilterInput;
  onChange: (filters: FilterInput) => void;
  onClear: () => void;
}

const POINT_OPTIONS = ['ZERO', 'ONE', 'TWO', 'FOUR', 'EIGHT'];

export function SearchFilter({ filters, onChange, onClear }: SearchFilterProps) {
  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0),
  );

  return (
    <div className={styles.filterBar}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search by name..."
        value={filters.name ?? ''}
        onChange={(e) => onChange({ ...filters, name: e.target.value || undefined })}
      />

      <select
        className={styles.select}
        value={filters.status ?? ''}
        onChange={(e) =>
          onChange({ ...filters, status: (e.target.value as TaskStatus) || undefined })
        }
      >
        <option value="">All Status</option>
        {Object.values(TaskStatus).map((s) => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.pointEstimate ?? ''}
        onChange={(e) =>
          onChange({ ...filters, pointEstimate: e.target.value || undefined })
        }
      >
        <option value="">All Points</option>
        {POINT_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.ownerId ?? ''}
        onChange={(e) =>
          onChange({ ...filters, ownerId: e.target.value || undefined })
        }
      >
        <option value="">All Assignees</option>
        {mockUsers.map((u) => (
          <option key={u.id} value={u.id}>{u.fullName}</option>
        ))}
      </select>

      <input
        className={styles.dateInput}
        type="date"
        value={filters.dueDate ?? ''}
        onChange={(e) =>
          onChange({ ...filters, dueDate: e.target.value || undefined })
        }
      />

      {hasFilters && (
        <button className={styles.clearButton} onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}
