<template>
  <div class="quiz">
    <!-- Final Results with Share Section -->
    <div v-if="quizStore.isQuizFinished" class="final-results">
      <h2>Quiz-i përfundoi</h2>
      <p>Pikët: {{ score }} / {{ totalQuestions }}</p>
      <div class="share">
        <h3>Shpërndaje Quiz-in:</h3>
        <input type="text" :value="shareURL" readonly />
        <button @click="copyLink">Kopjo Lidhjen</button>
        <p v-if="copySuccess" class="copy-success">Lidhja u kopjua!</p>
      </div>
    </div>

    <!-- Quiz in Progress -->
    <div v-else>
      <h2>Pyetja {{ quizStore.currentQuestionIndex + 1 }} nga {{ totalQuestions }}</h2>
      
      <!-- Feedback Panel: shows if the answer is correct or second attempt is made -->
      <div v-if="showFeedback" class="feedback-panel">
        <p>{{ feedbackMessage }}</p>
        <div class="mini-lesson">
          <p><strong>Leksion:</strong> {{ currentQuestion.miniLesson }}</p>
        </div>
        <button @click="nextQuestion">Pyetje tjetër</button>
      </div>
      
      <!-- Question Card -->
      <div v-else class="question-card">

        <p>{{ currentQuestion.question }}</p>
        <div v-if="currentQuestion.type === 'multiple_choice'">
          <ul>
            <li v-for="option in currentQuestion.options" :key="option">
              <button @click="submitAnswer(option)">{{ option }}</button>
            </li>
          </ul>
        </div>
        <div v-else-if="currentQuestion.type === 'fill_in_blank'">
          <input v-model="userAnswer" placeholder="Shkruani përgjigjen këtu" />
          <button @click="submitAnswer(userAnswer)">Dërgo</button>
        </div>
        <div v-if="feedbackMessage && attemptCount < 2">
          <p class="error-message">{{ feedbackMessage }}</p>
        </div>
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
const showFeedback = ref(false);

const currentQuestion = computed(() => quizStore.currentQuestion);
const totalQuestions = computed(() => quizStore.selectedQuestions.length);
const score = computed(() => quizStore.score);

// Build the share URL based on the quiz store state.
const shareURL = computed(() => {
  return `${window.location.origin}/quiz?seed=${quizStore.seed}&num=${quizStore.selectedNumber}`;
});

const copySuccess = ref(false);

function copyLink() {
  navigator.clipboard.writeText(shareURL.value).then(() => {
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  });
}

function submitAnswer(answer) {
  if (showFeedback.value) return;

  const normalizedAnswer = typeof answer === 'string' ? answer.trim().toLowerCase() : answer;
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

function nextQuestion() {
  feedbackMessage.value = '';
  userAnswer.value = '';
  attemptCount.value = 0;
  showFeedback.value = false;
  quizStore.nextQuestion();
}
</script>

<style scoped>
.quiz {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}
.question-card,
.feedback-panel,
.final-results {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-right: 1rem;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
.mini-lesson {
  margin: 1rem 0;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
}
.copy-success {
  color: green;
  margin-top: 0.5rem;
}
</style>