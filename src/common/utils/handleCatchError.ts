import { changeAppStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"

export const handleCatchError = (error: unknown, dispatch: Dispatch): void => {
  if(isAxiosError(error)){
    dispatch(setErrorAC({error: error.response?.data?.message || error.message}))
  } else if (error instanceof Error) {
    dispatch(setErrorAC({error: `Нативная ошибка ` + error.message}))
  } else {
    dispatch(setErrorAC({error: JSON.stringify((error as any).message || 'Some error occurred')}))
  }
  // нативная ошибка

  dispatch(changeAppStatusAC({status: 'failed'}))
}

