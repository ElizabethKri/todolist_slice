import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useAppDispatch } from "@/common/hooks"
import { deleteTaskTC, updateTaskTC } from "@/features/todolists/model/tasksSlice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { TaskStatus } from "@/common/enums"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { DomainTodolist } from "@/features/todolists/model/todolistsSlice.ts"

type Props = {
  todolist: DomainTodolist
  task: DomainTask
  todolistId: string
  disabled: boolean
}

export const TaskItem = ({ task, todolistId, todolist, disabled }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    console.log(newStatusValue, e.currentTarget.checked)
    const newTask = { ...task, status: newStatusValue }
    console.log(newTask)

    dispatch(updateTaskTC(newTask))
    //dispatch(changeTaskStatusTC({ todolistId, taskId: task.id, status: newStatusValue }))
  }

  const changeTaskTitle = (title: string) => {
    if (disabled) return
    const newTask = { ...task, title }
    dispatch(updateTaskTC(newTask))
  }

  const checked = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(checked)}>
      <div>
        <Checkbox checked={checked} onChange={changeTaskStatus} disabled={todolist.entityStatus === 'loading'}/>
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={todolist.entityStatus === 'loading'} />
      </div>
      <IconButton onClick={deleteTask} disabled={todolist.entityStatus === 'loading'}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
