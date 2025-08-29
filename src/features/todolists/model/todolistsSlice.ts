import { createSlice, current, nanoid } from "@reduxjs/toolkit"


// const initialState: Todolist[] = []

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as Todolist[],
  reducers: (creators) => ({
    deleteTodolistAC: creators.reducer<{id: string}>((state, action) =>{
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)}
    }),
    changeTodolistTitleAC: creators.reducer<{id: string, title: string}>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: creators.reducer<{id: string, filter: FilterValues}>((state, action) => {
      debugger
      const a = current(state)
      console.log (a)
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    createTodolistAC: creators.preparedReducer((title: string) => {
      return {
        payload: {
          id: nanoid(),
          title: title,
          filter: 'all'
        } as const
      }
    }, (state, action) => {
      state.push(action.payload)
    }),



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
    selectTodolists : state => state
  }

})


export const {deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, createTodolistAC} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors
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

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
