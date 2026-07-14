import type { Task } from '../../types/task';
import { TaskStatus } from '../../types/task';
import { TaskCard } from '../TaskCard';
import styles from './TaskColumn.module.css';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; colorVar: string }> = {
  [TaskStatus.BACKLOG]: { label: 'Backlog', colorVar: 'var(--color-col-backlog)' },
  [TaskStatus.TODO]: { label: 'To Do', colorVar: 'var(--color-col-todo)' },
  [TaskStatus.IN_PROGRESS]: { label: 'In Progress', colorVar: 'var(--color-col-inprogress)' },
  [TaskStatus.DONE]: { label: 'Done', colorVar: 'var(--color-col-done)' },
  [TaskStatus.CANCELLED]: { label: 'Cancelled', colorVar: 'var(--color-col-cancelled)' },
};

export function TaskColumn({ status, tasks, onEdit, onDelete }: TaskColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);
  const config = STATUS_CONFIG[status];

  return (
    <section className={styles.column}>
      <div className={styles.columnHeader}>
        <div
          className={styles.statusDot}
          style={{ backgroundColor: config.colorVar }}
        />
        <h2 className={styles.columnTitle}>{config.label}</h2>
        <span className={styles.count}>{columnTasks.length}</span>
      </div>

      <div className={styles.taskList}>
        {columnTasks.length === 0 ? (
          <div className={styles.empty}>
            <p>No tasks</p>
          </div>
        ) : (
          columnTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
