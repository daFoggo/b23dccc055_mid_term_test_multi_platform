// Kieu du lieu va hang so cua feature tasks
export const CATEGORIES = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'] as const;
export const PRIORITIES = ['Cao', 'Trung bình', 'Thấp'] as const;
export type Category = typeof CATEGORIES[number];
export type Priority = typeof PRIORITIES[number];
export const PRIORITY_RANK: Record<Priority, number> = {
  'Cao': 0,
  'Trung bình': 1,
  'Thấp': 2,
};
export interface Task {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  done: boolean;
}
export type TaskInput = Omit<Task, 'id' | 'done'>;
export type TaskFilter = 'all' | 'pending' | 'done' | 'overdue';
export const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'Tất cả',
  pending: 'Chưa xong',
  done: 'Đã xong',
  overdue: 'Quá hạn',
};
export type TaskSort = 'dueDate' | 'priority';
