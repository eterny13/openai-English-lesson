<script lang="ts">
  import { SpeechSettings, SpeechStore, speak } from 'talk2svelte'
  import { onMount } from 'svelte'
  import { filter } from 'rxjs'
  import { browser } from '$app/environment'
  import { Box, Button, Card, Flex, Group, NativeSelect, Stack, Switch, Text} from '@svelteuidev/core'
  import { type ChatRequestMessage } from '@azure/openai'
  import { createLesson, createAdvice } from '../api/callApi';

  let value = '' 
  let advice = ''
  let question = ''
  let userTalk = ''
  let situationPrompt: ChatRequestMessage
  let questionPrompt: ChatRequestMessage
  let recording = false

  onMount(() => {
    if (browser) {
      SpeechSettings.init()
    }

    const sub = SpeechStore.message
      .pipe(filter(() => recording === true))
      .subscribe((message) => (userTalk = message))

    return () => {
      sub.unsubscribe
    }
  })

  const getOpenAIAdvice = async(userTalk: string) => {
    SpeechSettings.init()
    recording = false
    const talkPrompt: ChatRequestMessage = { role: "user", content: userTalk }
    advice = await createAdvice(situationPrompt, questionPrompt, talkPrompt) ?? '' 
    speak(advice)
  }

  const getOpenAILesson = async(situation: string) => {
    userTalk = ''
    situationPrompt = { role: "system", content: `Situation is at ${situation}.` }

    question = await createLesson(situationPrompt) ?? ''
    questionPrompt = { role: "assistant", content: question }
  }

  function turnSpeechRecognition() {
    if (recording === false) {
      console.log(recording)
      SpeechSettings.init()
      SpeechSettings.start()
      recording = true
    } else {
      console.log(recording)
      SpeechSettings.init()
      SpeechSettings.stop()
      recording = false
    }
  }
</script>

<div>
  <Stack>
    <NativeSelect
      data={['Restaurant', 'Airport']} 
      bind:value
      placeholder="Pick one"
      label="Select situations you'd like to plactice"
    />
    <Button on:click={() => getOpenAILesson(value)}>
      show question
    </Button>
    <Card shadow='lg' padding='lg'>
      <Group position='apart'>
        <Text weight={600}>Question</Text>
      </Group>
      <Box
          css={{
              backgroundColor: '$gray50',
              textAlign: 'left',
              padding: '100px 100px 30px',
              borderRadius: '$md',
              cursor: 'pointer',

              '&:hover': {
                  backgroundColor: '$gray100',
              },
          }}
      >
        {question}
      </Box>
    </Card>
    <Card shadow='lg' padding='lg'>
      <Group position='apart'>
        <Text weight={600}>Your Talk</Text>
        <Flex gap="md" justify="right">
          <Switch size='sm' label="Recording ..." on:change={turnSpeechRecognition} />
        </Flex>
      </Group>
      <Box
          css={{
              backgroundColor: '$gray50',
              textAlign: 'left',
              padding: '100px 200px 30px',
              borderRadius: '$md',
              cursor: 'pointer',

              '&:hover': {
                  backgroundColor: '$gray100',
              },
          }}
      >
        {userTalk}
      </Box>
      <Button variant='light' color='blue' fullSize on:click={() => getOpenAIAdvice(userTalk)}>
        submit
      </Button>
    </Card>
    <Card shadow='lg' padding='lg'>
      <Group position='apart'>
        <Text weight={600}>GPT-4 Feedback</Text>
      </Group>
      <Box
          css={{
              backgroundColor: '$gray50',
              textAlign: 'left',
              padding: '100px 200px 80px',
              borderRadius: '$md',
              cursor: 'pointer',

              '&:hover': {
                  backgroundColor: '$gray100',
              },
          }}
      >
        {advice}
      </Box>
    </Card>
  </Stack>
</div>
