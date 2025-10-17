import TextField from "@mui/material/TextField"
import { type ChangeEvent, useState } from "react"

type Props = {
  value: string
  onChange: (title: string) => void
  disabled?: boolean
}

export const EditableSpan = ({ value, onChange, disabled }: Props) => {
  const [title, setTitle] = useState(value)
  const [isEditMode, setIsEditMode] = useState(false)

  const turnOnEditMode = () => {
    if(disabled){
      return
    }
    setIsEditMode(true)
  }

  const turnOffEditMode = () => {
    setIsEditMode(false)
    onChange(title)
  }

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  return (
    <>
      {isEditMode ? (
        <TextField
          variant={"outlined"}
          value={title}
          size={"small"}
          onChange={changeTitle}
          onBlur={turnOffEditMode}
          autoFocus
          disabled={disabled}
        />
      ) : (
        <span onDoubleClick={turnOnEditMode} style={{color: disabled ? 'lightgray' : 'rgba(0, 0, 0, 0.87)'}}>{value}</span>
      )}
    </>
  )
}
