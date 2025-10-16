import { changeAppStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "@/common/types"

// BaseResponse <{item: DomainTask}>
// BaseResponse <{item: Todolist}>

export const handleAppErrors = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  dispatch(changeAppStatusAC({status: 'failed'}))
  const error = data.messages.length ? data.messages[0] : 'Something went wrong'
  dispatch(setErrorAC({error}))
}