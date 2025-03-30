<script setup>
import { computed } from 'vue';
import { useQuizStore } from './store/quizStore';
import QuizSetup from './components/QuizSetup.vue';
import Quiz from './components/Quiz.vue';

const quizStore = useQuizStore();

const urlParams = new URLSearchParams(window.location.search);
const seedParam = urlParams.get('seed');
const numParam = urlParams.get('num');

console.log("URL seed:", seedParam, "and num:", numParam);

// Only auto-start if both parameters are provided and valid
if (seedParam && numParam && !isNaN(parseInt(numParam))) {
  const numQuestions = parseInt(numParam);
  quizStore.setSelectedNumber(numQuestions);
  quizStore.startQuizWithSeed(seedParam, numQuestions);
}

const quizStarted = computed(() => quizStore.selectedQuestions.length > 0);
</script>

<template>
  <div id="app">
    <QuizSetup v-if="!quizStarted" />
    <Quiz v-else />
  </div>
</template>