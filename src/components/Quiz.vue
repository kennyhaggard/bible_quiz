<template>
  <div v-if="quizFinished" class="final-results">
    <h2>Quiz-i përfundoi!</h2>
    <p>Pikët: {{ score }} / {{ totalQuestions }}</p>
    <!-- Display Mini Lessons as needed -->
    
    <!-- Share Section -->
    <div class="share">
      <h3>Shpërndaje Quiz-in:</h3>
      <input type="text" :value="shareURL" readonly />
      <button @click="copyLink">Kopjo Lidhjen</button>
      <p v-if="copySuccess" class="copy-success">Lidhja u kopjua!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuizStore } from '../store/quizStore';

const quizStore = useQuizStore();

// This computed property should be true when the quiz is finished
const quizFinished = computed(() => quizStore.isQuizFinished);

// Score and totalQuestions
const score = computed(() => quizStore.score);
const totalQuestions = computed(() => quizStore.selectedQuestions.length);

// Share URL computed using the seed and selected number stored in your quizStore
const shareURL = computed(() => {
  return `${window.location.origin}/quiz?seed=${quizStore.seed}&num=${quizStore.selectedNumber}`;
});

// For the "copy success" message
const copySuccess = ref(false);

function copyLink() {
  navigator.clipboard.writeText(shareURL.value).then(() => {
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 3000);
  });
}
</script>

<style scoped>
.final-results {
  text-align: center;
  margin-top: 2rem;
}

.share {
  margin-top: 2rem;
}

input[type="text"] {
  width: 80%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.copy-success {
  color: green;
  margin-top: 0.5rem;
}
</style>