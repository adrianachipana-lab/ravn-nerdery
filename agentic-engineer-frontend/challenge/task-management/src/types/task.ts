export const TaskStatus = {
  BACKLOG: 'BACKLOG',
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskTag = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  NODE_JS: 'NODE_JS',
  RAILS: 'RAILS',
  REACT: 'REACT',
} as const;

export type TaskTag = (typeof TaskTag)[keyof typeof TaskTag];

export interface User {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  dueDate: string;
  pointEstimate: string;
  tags: TaskTag[];
  assignee: User | null;
  position: number;
  createdAt: string;
}

export interface CreateTaskInput {
  name: string;
  status: TaskStatus;
  dueDate: string;
  pointEstimate: string;
  tags: TaskTag[];
  assigneeId: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  position?: number;
}

export type FilterInput = {
  name?: string;
  dueDate?: string;
  ownerId?: string;
  status?: TaskStatus;
  tags?: TaskTag[];
  pointEstimate?: string;
};
