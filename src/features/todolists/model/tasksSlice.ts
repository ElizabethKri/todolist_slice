import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { changeAppStatusAC } from "@/app/app-slice.ts"
import { createTodolistsTC, deleteTodolistTC } from "@/features/todolists/model/todolistsSlice.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),

    // createTaskAC: create.reducer<{ title: string; todolistId: string }>((state, action) => {
    //   const newTask: DomainTask = {
    //     title: action.payload.title,
    //     id: nanoid(),
    //     addedDate: "",
    //     order: 1,
    //     todoListId: action.payload.todolistId,
    //     status: TaskStatus.New,
    //     description: "",
    //     priority: TaskPriority.Low,
    //     startDate: '',
    //     deadline: '',
    //   }
    //   state[action.payload.todolistId].unshift(newTask)
    // }),

    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; status: TaskStatus }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.status = action.payload.status
      }
    }),

    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),

    fetchTaskTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeAppStatusAC({status: 'loading'}))
          const res = await tasksApi.getTasks(todolistId)
          thunkAPI.dispatch(changeAppStatusAC({status: 'succeeded'}))
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),

    createTaskTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeAppStatusAC({status: 'loading'}))
          const res = await tasksApi.createTask(args)
          thunkAPI.dispatch(changeAppStatusAC({status: 'succeeded'}))
          return res.data.data.item
        } catch (error) {
          thunkAPI.dispatch(changeAppStatusAC({status: 'failed'}))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          // const newTask: DomainTask = {
          //   title: action.payload.title,
          //   id: nanoid(),
          //   addedDate: "",
          //   order: 1,
          //   todoListId: action.payload.todolistId,
          //   status: TaskStatus.New,
          //   description: "",
          //   priority: TaskPriority.Low,
          //   startDate: '',
          //   deadline: '',
          // }
          state[action.payload.todoListId].unshift(action.payload)
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeAppStatusAC({status: 'loading'}))
          await tasksApi.deleteTask(args)
          thunkAPI.dispatch(changeAppStatusAC({status: 'succeeded'}))
          return args
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),

    // changeTaskStatusTC: create.asyncThunk(
    //   async (task: DomainTask, thunkAPI) => {
    //     // const {dispatch, rejectWithValue, getState} = thunkAPI
    //
    //     try {
    //       // const allTask = (getState() as RootState).tasks
    //       // const tasksForTodolist = allTask[args.todolistId]
    //       //
    //       // const task = tasksForTodolist.find((task) => task.id === args.taskId)
    //       //
    //       // if (!task) return thunkAPI.rejectWithValue(null)
    //
    //       const model: UpdateTaskModel = {
    //         status: task.status,
    //         description: task.description,
    //         startDate: task.startDate,
    //         title: task.title,
    //         priority: task.priority,
    //         deadline: task.deadline,
    //       }
    //
    //       const res = await tasksApi.updateTask({ taskId: task.id, todolistId: task.todoListId, model })
    //       return { task: res.data.data.item }
    //     } catch (error) {
    //       return thunkAPI.rejectWithValue(null)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const resTask = action.payload.task
    //       const task = state[resTask.todoListId].find((task) => task.id === resTask.id)
    //       if (task) {
    //         task.status = resTask.status
    //       }
    //     },
    //   },
    // ),

    updateTaskTC: create.asyncThunk(
      async (
        task: DomainTask, thunkAPI
      ) => {
        try {

          const model: UpdateTaskModel = {
                    status: task.status,
                    description: task.description,
                    startDate: task.startDate,
                    title: task.title,
                    priority: task.priority,
                    deadline: task.deadline,
                  }
          thunkAPI.dispatch(changeAppStatusAC({status: 'loading'}))
          const res = await tasksApi.updateTask({ taskId: task.id, todolistId: task.todoListId, model })
          thunkAPI.dispatch(changeAppStatusAC({status: 'succeeded'}))
          return { task: res.data.data.item }
        }
        catch {
          return thunkAPI.rejectWithValue(null)
        }

      },

      { fulfilled: (state, action) => {
          const resTask = action.payload.task
                const task = state[resTask.todoListId].find((task) => task.id === resTask.id)
                if (task) {
                  task.status = resTask.status
                  task.title = resTask.title
                }
        } }
    ),
  }),

  selectors: { selectTasks: (state) => state },

  extraReducers: (builder) => {
    builder
      .addCase(createTodolistsTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { deleteTaskTC, updateTaskTC, changeTaskTitleAC, fetchTaskTC, createTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

// export const deleteTaskAC = createAction<{ todolistId: string; taskId: string }>("tasks/deleteTask")
// export const createTaskAC = createAction<{ todolistId: string; title: string }>("tasks/createTask")
// export const changeTaskStatusAC = createAction<{ todolistId: string; taskId: string; isDone: boolean }>(
//   "tasks/changeTaskStatus",
// )
// export const changeTaskTitleAC = createAction<{ todolistId: string; taskId: string; title: string }>(
//   "tasks/changeTaskTitle",
// )

// const initialState: TasksState = {}

// export const _tasksReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(deleteTaskAC, (state, action) => {
//       const tasks = state[action.payload.todolistId]
//       const index = tasks.findIndex((task) => task.id === action.payload.taskId)
//       if (index !== -1) {
//         tasks.splice(index, 1)
//       }
//     })
//     .addCase(createTaskAC, (state, action) => {
//       const newTask: Task = { title: action.payload.title, isDone: false, id: nanoid() }
//       state[action.payload.todolistId].unshift(newTask)
//     })
//     .addCase(changeTaskStatusAC, (state, action) => {
//       const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
//       if (task) {
//         task.isDone = action.payload.isDone
//       }
//     })
//     .addCase(changeTaskTitleAC, (state, action) => {
//       const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
//       if (task) {
//         task.title = action.payload.title
//       }
//     })
//     .addCase(createTodolistAC, (state, action) => {
//       state[action.payload.id] = []
//     })
//     .addCase(deleteTodolistAC, (state, action) => {
//       delete state[action.payload.id]
//     })
// })

export type TasksState = Record<string, DomainTask[]>
