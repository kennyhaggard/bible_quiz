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
const copySuccess = ref(false);

// Assuming these properties exist in your store
const score = computed(() => quizStore.score);
const totalQuestions = computed(() => quizStore.selectedQuestions.length);
const seed = computed(() => quizStore.seed); // make sure you save the seed when starting the quiz
const selectedNum = computed(() => quizStore.selectedNumber);

// Build the share URL using the current origin and query parameters
const shareURL = computed(() => {
  return `${window.location.origin}/quiz?seed=${seed.value}&num=${selectedNum.value}`;
});

function copyLink() {
  navigator.clipboard.writeText(shareURL.value).then(() => {
    copySuccess.value = true;
    // Hide the success message after 3 seconds
    setTimeout(() => copySuccess.value = false, 3000);
  });
}

const quizFinished = computed(() => quizStore.isQuizFinished);
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