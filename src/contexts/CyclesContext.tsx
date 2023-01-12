import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJson = localStorage.getItem(
        '@ntn-timer:cycles-state-1.0.0',
      )
      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      }
    },
  )

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ntn-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  const { activeCycleId, cycles } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSeccondsPassed, setAmountSeccondsPassed] = useState<number>(
    () => {
      if (activeCycle) {
        return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
      }
      return 0
    },
  )

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
