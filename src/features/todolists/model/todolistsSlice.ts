import { current } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils"
import { changeAppStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"

// const initialState: Todolist[] = []

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],

  reducers: (create) => ({
    // 4

    // fetchTodolistAC: creators.reducer<{todolists: Todolist[]}>((_state, action) =>{
    //   return action.payload.todolists.map((todolist) => ({...todolist, filter: 'all'}))
    //
    // }),

    // deleteTodolistAC: creators.reducer<{ id: string }>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state.splice(index, 1)
    //   }
    // }),
    // changeTodolistTitleAC: creators.reducer<{id: string, title: string}>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state[index].title = action.payload.title
    //   }
    // }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      debugger
      const a = current(state)
      console.log(a)
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    changeTodolistEntityStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      debugger
      const a = current(state)
      console.log(a)
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    }),

    fetchtodolistsTC: create.asyncThunk(
      async (_arg, thunkAPI) => {
        const { rejectWithValue } = thunkAPI

        try {
          // async logic
          thunkAPI.dispatch(changeAppStatusAC({ status: "loading" }))
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const res = await todolistsApi.getTodolists()
          thunkAPI.dispatch(changeAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (e) {
          return rejectWithValue(e)
        }
      },
      {
        pending: () => {},
        fulfilled: (_state, action) => {
          return action.payload.todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: 'idle' }))
        },
        rejected: () => {},
        settled: () => {},
      },
    ),

    createTodolistsTC: create.asyncThunk(
      async (title: string, thunkAPI) => {
        const { rejectWithValue } = thunkAPI

        try {
          // async logic
          thunkAPI.dispatch(changeAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          thunkAPI.dispatch(changeAppStatusAC({ status: "succeeded" }))
          return res.data.data.item
        } catch (e) {
          return rejectWithValue(e)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload, filter: "all", entityStatus: 'idle' })
        },
      },
    ),

    deleteTodolistTC: create.asyncThunk(
      async (id: string, thunkAPI) => {
        const { rejectWithValue } = thunkAPI

        try {
          // async logic
          thunkAPI.dispatch(changeAppStatusAC({ status: "loading" }))
          thunkAPI.dispatch(changeTodolistEntityStatusAC({entityStatus: 'loading', id}))
          await todolistsApi.deleteTodolist(id)
          thunkAPI.dispatch(changeAppStatusAC({ status: "succeeded" }))
          return { id }
        } catch (e) {
          thunkAPI.dispatch(changeTodolistEntityStatusAC({entityStatus: 'idle', id}))
          thunkAPI.dispatch(changeAppStatusAC({status: 'failed'}))
          return rejectWithValue(e)
        }
      },
      {
        fulfilled: (state, action) => {
          return state.filter((el) => el.id !== action.payload.id)
        },
      },
    ),

    changeTodolistTitleTC: create.asyncThunk(
      async (args: { id: string; title: string }, thunkAPI) => {
        const { rejectWithValue } = thunkAPI

        try {
          // async logic
          thunkAPI.dispatch(changeAppStatusAC({ status: "loading" }))
          await todolistsApi.changeTodolistTitle(args)
          thunkAPI.dispatch(changeAppStatusAC({ status: "succeeded" }))
          return args
        } catch (e) {
          return rejectWithValue(e)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),



    // createTodolistAC: creators.preparedReducer((title: string) => {
    //   const newTodolist: DomainTodolist = {
    //     id: nanoid(),
    //     title: title,
    //     filter: 'all',
    //     addedDate: '',
    //     order: 1
    //   }
    //   return {
    //     payload: newTodolist
    //   }
    // }, (state, action) => {
    //   state.push(action.payload)
    // }),

    // createTodolistAC: creators.reducer<{title: string, id: string}>((state, action) => {
    //   const newTodolist: Todolist = {
    //     title: action.payload.title,
    //     filter: "all",
    //     id: action.payload.title
    //   }
    //   state.push(newTodolist)
    // })
  }),

  selectors: {
    selectTodolists: (state) => state,
  },

  // extraReducers: (builder) => {
  //   builder
  //     // .addCase(fetchtodolistsTC.fulfilled, (_state, action) => {
  //   return action.payload.todolists.map((todolist) => ({ ...todolist, filter: "all" }))
  // })
  // .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
  //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
  //   if (index !== -1) {
  //     state[index].title = action.payload.title
  //   }
  // })

  // .addCase(createTodolistTC.fulfilled, (state, action) => {
  //   state.unshift({ ...action.payload.todolist, filter: "all" })
  // })

  // .addCase(deleteTodolistTC.fulfilled, (state, action) => {
  //   return state.filter((el) => el.id !== action.payload.id)
  // })

  // .addCase(fetchtodolistsTC.rejected, (_state, _action) => {})
  // },
})

// export const _fetchtodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchtodolistsTC`, async (_arg, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI
//
//   try {
//     // async logic
//     const res = await todolistsApi.getTodolists()
//     return { todolists: res.data }
//   } catch (e) {
//     return rejectWithValue(e)
//   }
// })

// export const changeTodolistTitleTC = createAsyncThunk(
//   `${todolistsSlice.name}/updateTodolistTitleTC`,
//   async (args: { id: string; title: string }, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI
//
//     try {
//       // async logic
//       await todolistsApi.changeTodolistTitle(args)
//       return args
//     } catch (e) {
//       return rejectWithValue(e)
//     }
//   },
// )

// export const createTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/createTodolistTC`,
//   async (title: string, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI
//
//     try {
//       // async logic
//
//       const result = await todolistsApi.createTodolist(title)
//       console.log(result.data.data.item)
//
//       return { todolist: result.data.data.item }
//     } catch (e) {
//       return rejectWithValue(e)
//     }
//   },
// )

// export const deleteTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/deleteTodolistTC`,
//   async (id: string, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI
//     try {
//       await todolistsApi.deleteTodolist(id)
//       return { id }
//     } catch (e) {
//       return rejectWithValue(e)
//     }
//   },
// )

export const { changeTodolistFilterAC, fetchtodolistsTC, createTodolistsTC, deleteTodolistTC, changeTodolistTitleTC, changeTodolistEntityStatusAC } =
  todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

// export const deleteTodolistAC = createAction<{ id: string }>("todolists/deleteTodolist")
// export const createTodolistAC = createAction("todolists/createTodolist", (title: string) => {
//   return { payload: { title, id: nanoid() } }
// })
// export const changeTodolistTitleAC = createAction<{ id: string; title: string }>("todolists/changeTodolistTitle")
// export const changeTodolistFilterAC = createAction<{ id: string; filter: FilterValues }>(
//   "todolists/changeTodolistFilter",
// )

// export const _todolistsReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(deleteTodolistAC, (state, action) => {
//       const index = state.findIndex((todolist) => todolist.id === action.payload.id)
//       if (index !== -1) {
//         state.splice(index, 1)
//       }
//     })
//     .addCase(createTodolistAC, (state, action) => {
//       state.push({ ...action.payload, filter: "all" })
//     })
//     .addCase(changeTodolistTitleAC, (state, action) => {
//       const index = state.findIndex((todolist) => todolist.id === action.payload.id)
//       if (index !== -1) {
//         state[index].title = action.payload.title
//       }
//     })
//     .addCase(changeTodolistFilterAC, (state, action) => {
//       const todolist = state.find((todolist) => todolist.id === action.payload.id)
//       if (todolist) {
//         todolist.filter = action.payload.filter
//       }
//     })
// })

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
