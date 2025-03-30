<template>
  <div id="app">
    <!-- If quiz hasn't started, show QuizSetup; otherwise show Quiz -->
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

// Check URL parameters for seed and num
const urlParams = new URLSearchParams(window.location.search);
const seedParam = urlParams.get('seed');
const numParam = urlParams.get('num');

if (seedParam && numParam) {
  // If both parameters are present, bypass the setup:
  const numQuestions = parseInt(numParam);
  quizStore.setSelectedNumber(numQuestions);
  quizStore.startQuizWithSeed(seedParam, numQuestions);
}

// Determine if the quiz has started by checking if selectedQuestions has items
const quizStarted = computed(() => quizStore.selectedQuestions.length > 0);
</script>