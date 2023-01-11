import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  InterruptCountdownButton,
  StartCountdownButton,
} from './styles'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../contexts/CyclesContext'
import { useContext } from 'react'

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

export function Home() {
  const { activeCycle, handleInterruptActiveCycle, handleCreateNewCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch } = newCycleForm

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <InterruptCountdownButton
            onClick={handleInterruptActiveCycle}
            type="button"
          >
            <HandPalm size={24} /> Interromper
          </InterruptCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
