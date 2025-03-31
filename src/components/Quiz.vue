<template>
  <div class="quiz-container">
    <!-- Header and progress indicator (only when quiz is in progress) -->
    <header class="quiz-header" v-if="!quizStore.isQuizFinished">
      <h1>Pyetje Biblike</h1>
      <p class="progress">
        Pyetja {{ quizStore.currentQuestionIndex + 1 }} nga {{ totalQuestions }}
      </p>
    </header>

    <!-- Quiz Card: displays current question and options -->
    <div v-if="!quizStore.isQuizFinished" class="quiz-card">
      <p class="question-text">{{ currentQuestion.question }}</p>
      <ul class="options-list">
        <li v-for="option in currentQuestion.options" :key="option">
          <button class="option-btn" @click="submitAnswer(option)">
            {{ option }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Final Results: shows score and share link -->
    <div v-if="quizStore.isQuizFinished" class="final-results">
      <h2>Quiz-i Përfundoi!</h2>
      <p>Pikët: {{ quizStore.score }} / {{ totalQuestions }}</p>
      <div class="share">
        <h3>Shpërndaje Quiz-in:</h3>
        <input type="text" :value="shareURL" readonly />
        <button class="share-btn" @click="copyLink">Kopjo Lidhjen dhe Shpërndaje</button>
        <p v-if="copySuccess" class="copy-success">Lidhja u kopjua!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuizStore } from '../store/quizStore';

const quizStore = useQuizStore();
const copySuccess = ref(false);

// Total questions and current question from the store.
const totalQuestions = computed(() => quizStore.selectedQuestions.length);
const currentQuestion = computed(() => quizStore.currentQuestion);

// Function to submit an answer.
// For demonstration, we assume a simple check for correctness.
function submitAnswer(option) {
  const normalizedOption = option.trim().toLowerCase();
  const normalizedAnswer = currentQuestion.value.answer.trim().toLowerCase();

  // Update score and mini lesson based on correctness.
  if (normalizedOption === normalizedAnswer) {
    quizStore.answerQuestion(true, currentQuestion.value.miniLesson);
  } else {
    quizStore.answerQuestion(false, currentQuestion.value.miniLesson);
  }

  // Advance to the next question after a short delay.
  setTimeout(() => {
    quizStore.nextQuestion();
  }, 500);
}

// Computed property for generating the share URL.
// It uses the current seed and selected number from the quiz store.
const shareURL = computed(() => {
  return `${window.location.origin}/bible_quiz/?seed=${quizStore.seed}&num=${quizStore.selectedNumber}`;
});

// Copy share URL to clipboard.
function copyLink() {
  navigator.clipboard.writeText(shareURL.value).then(() => {
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  });
}
</script>

<style scoped>
/* Container styling */
.quiz-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

/* Header with gradient background */
.quiz-header {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  padding: 1rem;
  border-radius: 8px;
  color: white;
  margin-bottom: 1.5rem;
}
.quiz-header h1 {
  margin: 0;
  font-size: 2rem;
}
.progress {
  margin-top: 0.5rem;
  font-size: 1rem;
}

/* Quiz card styling */
.quiz-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}
.quiz-card:hover {
  transform: scale(1.02);
}
.question-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

/* Options list: remove bullets and set spacing */
.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.options-list li {
  margin: 0.75rem 0;
}
.option-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #43cea2, #185a9d);
  color: white;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.option-btn:hover {
  background: linear-gradient(135deg, #2ecc71, #3498db);
  transform: scale(1.02);
}

/* Final results styling */
.final-results {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.share {
  margin-top: 1.5rem;
}
.share input[type="text"] {
  width: 80%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.share-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.share-btn:hover {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  transform: scale(1.02);
}
.copy-success {
  color: green;
  margin-top: 0.5rem;
}
</style>