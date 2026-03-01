export interface Task {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  totalSteps: number;
  currentStep: number;
  nextAction: string;
  nextActionDate: string;
  category: string;
  tasks: Task[];
}

export interface UserState {
  name: string;
  activeGoalCount: number;
  overallProgress: number;
}
