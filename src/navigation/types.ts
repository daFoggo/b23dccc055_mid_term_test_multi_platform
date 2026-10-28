// Tham so cua cac man hinh trong root stack
export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string } | undefined;
  TaskDetail: { taskId: string };
};
