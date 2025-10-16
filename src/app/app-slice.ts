import {  createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export type ThemeMode = "dark" | "light"

export const  appSlice  = createSlice(({
  name: 'app',
  initialState: {
    themeMode: "light" as ThemeMode,
    status: 'idle' as RequestStatus,
    error: null as null | string
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
       state.themeMode = action.payload.themeMode
    }),

    changeAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),

    setErrorAC: create.reducer<{ error: null | string }>((state, action) => {
      state.error = action.payload.error
    }),

  }),
  selectors: {
    selectThemeMode: (state): ThemeMode => state.themeMode,
    selectAppStatus: (state): RequestStatus => state.status,
    selectAppError: (state): null | string => state.error,

}}))

export const {changeThemeModeAC, changeAppStatusAC, setErrorAC} = appSlice.actions
export const {selectThemeMode, selectAppStatus, selectAppError} = appSlice.selectors
export const appReducer = appSlice.reducer

// export const _changeThemeModeAC = createAction<{ themeMode: ThemeMode }>("app/changeThemeMode")

// const initialState = {
//   themeMode: "light" as ThemeMode,
// }

// export const _appReducer = createReducer(initialState, (builder) => {
//   builder.addCase(changeThemeModeAC, (state, action) => {
//     state.themeMode = action.payload.themeMode
//   })
// })


