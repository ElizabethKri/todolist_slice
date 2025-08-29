import {  createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"

export const  appSlice  = createSlice(({
  name: 'app',
  initialState: {
    themeMode: "light" as ThemeMode,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
       state.themeMode = action.payload.themeMode
    })
  }),
  selectors: {
    selectThemeMode: (state): ThemeMode => state.themeMode}

}))

export const {changeThemeModeAC} = appSlice.actions
export const {selectThemeMode} = appSlice.selectors
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


