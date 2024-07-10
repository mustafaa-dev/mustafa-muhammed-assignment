export interface EmailDataInterface {
  to: string;
  data: AssignedTaskEmailData;
}

interface AssignedTaskEmailData {
  taskId: string;
  taskTitle: string;
}
