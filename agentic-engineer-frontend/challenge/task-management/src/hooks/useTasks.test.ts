import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';

/*
  TESTING CUSTOM HOOKS
  =====================
  renderHook nos permite testear un hook fuera de un componente.
  act() wrappea cambios de estado para que React los procese.
*/

describe('useTasks', () => {
  it('initializes with mock tasks', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  it('creates a new task', () => {
    const { result } = renderHook(() => useTasks());
    const initialCount = result.current.tasks.length;

    act(() => {
      result.current.createTask({
        name: 'Test Task',
        status: 'BACKLOG',
        dueDate: '2026-08-01T00:00:00Z',
        pointEstimate: 'FOUR',
        tags: ['REACT'],
        assigneeId: '1',
      });
    });

    expect(result.current.tasks.length).toBe(initialCount + 1);
    expect(result.current.tasks[0].name).toBe('Test Task');
  });

  it('deletes a task', () => {
    const { result } = renderHook(() => useTasks());
    const initialCount = result.current.tasks.length;
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks.length).toBe(initialCount - 1);
    expect(result.current.tasks.find((t) => t.id === taskId)).toBeUndefined();
  });

  it('updates a task', () => {
    const { result } = renderHook(() => useTasks());
    const task = result.current.tasks[0];

    act(() => {
      result.current.updateTask({ id: task.id, name: 'Updated Name' });
    });

    const updated = result.current.tasks.find((t) => t.id === task.id);
    expect(updated?.name).toBe('Updated Name');
  });

  it('filters tasks by name', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.setFilters({ name: 'login' });
    });

    expect(result.current.tasks.every((t) => t.name.toLowerCase().includes('login'))).toBe(true);
  });

  it('filters tasks by status', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.setFilters({ status: 'DONE' });
    });

    expect(result.current.tasks.every((t) => t.status === 'DONE')).toBe(true);
  });

  it('clears filters', () => {
    const { result } = renderHook(() => useTasks());
    const totalTasks = result.current.tasks.length;

    act(() => {
      result.current.setFilters({ status: 'DONE' });
    });

    expect(result.current.tasks.length).toBeLessThan(totalTasks);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.tasks.length).toBe(totalTasks);
  });
});
