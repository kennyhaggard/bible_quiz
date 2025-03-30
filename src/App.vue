<template>
  <div id="app">
    <!-- Show QuizSetup if quiz not started; otherwise show Quiz -->
    <QuizSetup v-if="!quizStarted" />
    <Quiz v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from './store/quizStore';
import QuizSetup from './components/QuizSetup.vue';
import Quiz from './components/Quiz.vue';

const quizStore = useQuizStore();

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const seedParam = urlParams.get('seed');
const numParam = urlParams.get('num');

if (seedParam && numParam) {
  const numQuestions = parseInt(numParam);
  quizStore.setSelectedNumber(numQuestions);
  quizStore.startQuizWithSeed(seedParam, numQuestions);
}

// Determine if quiz has started by checking if selectedQuestions has items
const quizStarted = computed(() => quizStore.selectedQuestions.length > 0);
</script>