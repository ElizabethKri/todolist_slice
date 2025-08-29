import { useAppDispatch, useAppSelector } from "@/common/hooks"

import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import {  fetchtodolistsTC, selectTodolists } from "@/features/todolists/model/todolistsSlice.ts"
import { useEffect } from "react"



export const Todolists = () => {

  // 5

  const todolists = useAppSelector(selectTodolists)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchtodolistsTC())
    // 1
    // todolistsApi.getTodolists().then((res) => {
    //   // 3
    //   dispatch(fetchTodolistAC({todolists: res.data}))
    // })


  }, [])

  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
