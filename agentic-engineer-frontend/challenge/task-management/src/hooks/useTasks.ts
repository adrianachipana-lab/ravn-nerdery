import { useState, useCallback, useMemo } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput, FilterInput } from '../types/task';
import { mockTasks, mockUsers } from '../mocks/data';

/*
  REACT CONCEPT: Custom Hooks
  ------------------------------
  Un custom hook es una función que empieza con "use" y puede
  usar otros hooks dentro. Nos permite extraer lógica de estado
  reutilizable fuera de los componentes.

  useTasks encapsula toda la lógica CRUD de tareas.
  Cualquier componente que lo use obtiene las mismas funciones.

  REACT CONCEPT: useCallback
  ----------------------------
  useCallback memoriza una función para que no se re-cree
  en cada render. Útil cuando pasamos funciones como props
  a componentes hijo (evita re-renders innecesarios).

  REACT CONCEPT: useMemo
  ------------------------
  useMemo memoriza un valor computado. Solo se recalcula
  cuando cambian sus dependencias. Aquí lo usamos para
  filtrar tareas sin recalcular en cada render.
*/

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<FilterInput>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar tareas según los filtros activos
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.name && !task.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) => task.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      if (filters.pointEstimate && task.pointEstimate !== filters.pointEstimate) {
        return false;
      }
      if (filters.ownerId && task.assignee?.id !== filters.ownerId) {
        return false;
      }
      if (filters.dueDate) {
        const filterDate = new Date(filters.dueDate).toDateString();
        const taskDate = new Date(task.dueDate).toDateString();
        if (filterDate !== taskDate) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const createTask = useCallback((input: CreateTaskInput) => {
    setLoading(true);
    setError(null);
    try {
      const assignee = mockUsers.find((u) => u.id === input.assigneeId) ?? null;
      const newTask: Task = {
        id: String(Date.now()),
        name: input.name,
        status: input.status,
        dueDate: input.dueDate,
        pointEstimate: input.pointEstimate,
        tags: input.tags,
        assignee,
        position: 1,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      return { success: true as const };
    } catch {
      setError('Failed to create task');
      return { success: false as const, error: 'Failed to create task' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback((input: UpdateTaskInput) => {
    setLoading(true);
    setError(null);
    try {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== input.id) return task;
          const assignee = input.assigneeId
            ? mockUsers.find((u) => u.id === input.assigneeId) ?? task.assignee
            : task.assignee;
          return {
            ...task,
            ...(input.name !== undefined && { name: input.name }),
            ...(input.status !== undefined && { status: input.status }),
            ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
            ...(input.pointEstimate !== undefined && { pointEstimate: input.pointEstimate }),
            ...(input.tags !== undefined && { tags: input.tags }),
            ...(input.position !== undefined && { position: input.position }),
            assignee,
          };
        }),
      );
      return { success: true as const };
    } catch {
      setError('Failed to update task');
      return { success: false as const, error: 'Failed to update task' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return { success: true as const };
    } catch {
      setError('Failed to delete task');
      return { success: false as const, error: 'Failed to delete task' };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    setFilters,
    clearFilters,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
