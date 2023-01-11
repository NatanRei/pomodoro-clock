import { createContext, ReactNode, useState } from 'react'

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSeccondsPassed: number
  cycles: Cycle[]
  markCurrentCycleAsFinished: () => void
  setActiveCycleHowNull: () => void
  handleSetAmountSeccondsPassed: (seconds: number) => void
  handleInterruptActiveCycle: () => void
  handleCreateNewCycle: (data: NewCycleFormData) => void
}

interface CycleContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSeccondsPassed, setAmountSeccondsPassed] = useState<number>(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function setActiveCycleHowNull() {
    setActiveCycleId(null)
  }

  function handleSetAmountSeccondsPassed(amountSeconds: number) {
    setAmountSeccondsPassed(amountSeconds)
  }

  function handleInterruptActiveCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleHowNull()
  }

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const id: string = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSeccondsPassed(0)
    // reset()
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        setActiveCycleHowNull,
        amountSeccondsPassed,
        handleSetAmountSeccondsPassed,
        handleInterruptActiveCycle,
        handleCreateNewCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
