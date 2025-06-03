export interface Plan {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string; 
  taskIds: string[];
  createdAt?: string;
  userId?: string;  
}