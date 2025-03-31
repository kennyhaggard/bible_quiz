<template>
  <div class="quiz-container">
    <!-- When quiz is in progress and not showing feedback -->
    <header class="quiz-header" v-if="!quizStore.isQuizFinished && !showFeedback">
      <h1>Pyetje Biblike</h1>
      <p class="progress">Pyetja {{ quizStore.currentQuestionIndex + 1 }} nga {{ totalQuestions }}</p>
    </header>

    <!-- Quiz Card: Display question or fill-in input when feedback panel is not active -->
    <div v-if="!quizStore.isQuizFinished && !showFeedback" class="quiz-card">
      <p class="question-text">{{ currentQuestion.question }}</p>
      
      <!-- Multiple Choice Options -->
      <ul v-if="currentQuestion.type === 'multiple_choice'" class="options-list">
        <li v-for="option in currentQuestion.options" :key="option">
          <button class="option-btn" @click="submitAnswer(option)">{{ option }}</button>
        </li>
      </ul>

      <!-- Fill in the Blank -->
      <div v-else-if="currentQuestion.type === 'fill_in_blank'" class="fill-blank">
        <input
          v-model="userAnswer"
          placeholder="Shkruani përgjigjen këtu"
          class="fill-input"
        />
        <button class="option-btn" @click="submitAnswer(userAnswer)">Dërgo</button>
      </div>

      <!-- Inline error message for first wrong attempt -->
      <div v-if="feedbackMessage && attemptCount < 2" class="inline-feedback">
        <p class="error-message">{{ feedbackMessage }}</p>
      </div>
    </div>

    <!-- Feedback Panel: Displayed after a correct answer or after second attempt -->
    <div v-if="!quizStore.isQuizFinished && showFeedback" class="feedback-panel">
      <p class="feedback-message">{{ feedbackMessage }}</p>
      <div class="mini-lesson">
        <p><strong>Leksion:</strong> {{ currentQuestion.miniLesson }}</p>
      </div>
      <button class="next-btn" @click="nextQuestion">Pyetje tjetër</button>
    </div>

    <!-- Final Results Screen -->
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

const userAnswer = ref('');
const attemptCount = ref(0);
const feedbackMessage = ref('');
// Control when to display the full feedback panel (hides question card)
const showFeedback = ref(false);

const totalQuestions = computed(() => quizStore.selectedQuestions.length);
const currentQuestion = computed(() => quizStore.currentQuestion);

// Submit answer function, handles both multiple choice and fill-in
function submitAnswer(answer) {
  // Prevent duplicate submission if feedback panel is active
  if (showFeedback.value) return;

  const normalizedAnswer = (typeof answer === 'string' ? answer.trim().toLowerCase() : answer);
  const normalizedCorrect = currentQuestion.value.answer.trim().toLowerCase();

  if (normalizedAnswer === normalizedCorrect) {
    feedbackMessage.value = "Saktë!";
    showFeedback.value = true;
    quizStore.answerQuestion(true, currentQuestion.value.miniLesson);
  } else {
    attemptCount.value++;
    if (attemptCount.value < 2) {
      feedbackMessage.value = "Gabim, provo përsëri!";
    } else {
      feedbackMessage.value = `Gabim. Përgjigjja e saktë është: ${currentQuestion.value.answer}`;
      showFeedback.value = true;
      quizStore.answerQuestion(false, currentQuestion.value.miniLesson);
    }
  }
}

// Move to the next question
function nextQuestion() {
  feedbackMessage.value = '';
  userAnswer.value = '';
  attemptCount.value = 0;
  showFeedback.value = false;
  quizStore.nextQuestion();
}

// Computed share URL using current seed and number of questions
const shareURL = computed(() => {
  return `${window.location.origin}/bible_quiz/?seed=${quizStore.seed}&num=${quizStore.selectedNumber}`;
});

// Clipboard copy logic
const copySuccess = ref(false);
function copyLink() {
  navigator.clipboard.writeText(shareURL.value).then(() => {
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 3000);
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

/* Fill-in-the-blank styling */
.fill-blank {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fill-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Inline feedback styling */
.inline-feedback {
  margin-top: 1rem;
}
.error-message {
  color: red;
  font-size: 1.1rem;
}

/* Feedback Panel styling */
.feedback-panel {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.feedback-message {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.mini-lesson {
  margin: 1rem 0;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
}
.next-btn {
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
.next-btn:hover {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
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