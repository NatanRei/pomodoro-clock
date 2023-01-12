import { createContext, ReactNode, useReducer, useState } from 'react'
import {
  createCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducers'

interface NewCycleFormData {
  task: string
  minutesAmount: number
}
interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSeccondsPassed: number
  cycles: Cycle[]
  markCurrentCycleAsFinished: () => void
  handleSetAmountSeccondsPassed: (seconds: number) => void
  handleInterruptActiveCycle: () => void
  createNewCycle: (data: NewCycleFormData) => void
}

interface CycleContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const { activeCycleId, cycles } = cyclesState

  const [amountSeccondsPassed, setAmountSeccondsPassed] = useState<number>(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function handleSetAmountSeccondsPassed(amountSeconds: number) {
    setAmountSeccondsPassed(amountSeconds)
  }

  function handleInterruptActiveCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  const createNewCycle = (data: NewCycleFormData) => {
    const id: string = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(createCycleAction(newCycle))
    setAmountSeccondsPassed(0)
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSeccondsPassed,
        handleSetAmountSeccondsPassed,
        handleInterruptActiveCycle,
        createNewCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
