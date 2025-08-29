import type { RootState } from "@/app/store"
import type { TasksState } from "./tasksSlice.ts"

export const selectTasks = (state: RootState): TasksState => state.tasks
