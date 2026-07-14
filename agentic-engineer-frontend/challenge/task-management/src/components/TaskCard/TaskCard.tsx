import { memo, useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Clock, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../types/task';
import { formatDate, getDateColor, getPointLabel } from '../../utils/date';
import { getTagLabel, getTagClassName } from '../../utils/tags';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

/*
  React.memo previene re-renders innecesarios.
  Si las props no cambiaron, React reutiliza el render anterior.
  Importante en listas: sin memo, cambiar UNA tarea re-renderiza TODAS las cards.
*/
export const TaskCard = memo(function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dateColor = getDateColor(task.dueDate);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <article
      className={styles.card}
      style={{ '--stagger-delay': `${index * 50}ms` } as React.CSSProperties}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{task.name}</h3>
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={`${styles.optionsButton} ${menuOpen ? styles.menuVisible : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Options for ${task.name}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className={styles.menu}>
              <button
                className={styles.menuItem}
                onClick={() => { setMenuOpen(false); onEdit(task); }}
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                onClick={() => { setMenuOpen(false); onDelete(task.id); }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tags}>
        {task.tags.map((tag) => (
          <span key={tag} className={`${styles.tag} ${styles[getTagClassName(tag)]}`}>
            {getTagLabel(tag)}
          </span>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.meta}>
          <span className={`${styles.dueDate} ${styles[dateColor]}`}>
            <Clock size={14} />
            {formatDate(task.dueDate)}
          </span>
          <span className={styles.points}>
            <MessageSquare size={14} />
            {getPointLabel(task.pointEstimate)}
          </span>
        </div>

        {task.assignee && (
          <img
            className={styles.assigneeAvatar}
            src={task.assignee.avatar}
            alt={task.assignee.fullName}
            title={task.assignee.fullName}
          />
        )}
      </div>
    </article>
  );
});
