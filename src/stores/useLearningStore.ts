import { create } from 'zustand';

interface Course {
  id: string;
  title: string;
  progress: number;
  completed: boolean;
}

interface LearningState {
  courses: Course[];
  completedCount: number;
  totalWatchTime: number;
  addCourse: (course: Course) => void;
  updateProgress: (courseId: string, progress: number) => void;
  markComplete: (courseId: string) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  courses: [],
  completedCount: 0,
  totalWatchTime: 0,
  
  addCourse: (course) => set((state) => ({
    courses: [...state.courses, course]
  })),
  
  updateProgress: (courseId, progress) => set((state) => ({
    courses: state.courses.map(course =>
      course.id === courseId ? { ...course, progress } : course
    )
  })),
  
  markComplete: (courseId) => set((state) => ({
    courses: state.courses.map(course =>
      course.id === courseId ? { ...course, completed: true, progress: 100 } : course
    ),
    completedCount: state.completedCount + 1
  }))
}));
