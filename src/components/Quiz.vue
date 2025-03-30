<template>
  <div class="quiz">
    <!-- Final Results -->
    <div v-if="quizStore.isQuizFinished">
      <h2>Quiz-i përfundoi!</h2>
      <p>Pikët: {{ quizStore.score }} / {{ quizStore.selectedQuestions.length }}</p>
      <div>
        <h3>Mini Leksione:</h3>
        <ul>
          <li v-for="(lesson, index) in quizStore.miniLessons" :key="index">
            {{ lesson }}
          </li>
        </ul>
      </div>
      <button @click="resetQuiz">Rifillo Quiz-in</button>
    </div>

    <!-- Quiz in Progress -->
    <div v-else>
      <h2>
        Pyetja {{ quizStore.currentQuestionIndex + 1 }} nga {{ quizStore.selectedQuestions.length }}
      </h2>
      
      <!-- Feedback Panel: Shown only after a correct answer or after two attempts -->
      <div v-if="showFeedback" class="feedback-panel">
        <p>{{ feedbackMessage }}</p>
        <div class="mini-lesson">
          <p><strong>Leksion:</strong> {{ currentQuestion.miniLesson }}</p>
        </div>
        <button @click="nextQuestion">Pyetje tjetër</button>
      </div>
      
      <!-- Question Card: Shown when not in feedback mode -->
      <div v-else class="question-card">
        <p>{{ currentQuestion.question }}</p>
        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple_choice'">
          <ul>
            <li v-for="option in currentQuestion.options" :key="option">
              <button @click="submitAnswer(option)">{{ option }}</button>
            </li>
          </ul>
        </div>
        <!-- Fill-in-the-Blank -->
        <div v-else-if="currentQuestion.type === 'fill_in_blank'">
          <input
            v-model="userAnswer"
            placeholder="Shkruani përgjigjen këtu"
          />
          <button @click="submitAnswer(userAnswer)">Dërgo</button>
        </div>
        <!-- Inline error for first wrong attempt -->
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
// "showFeedback" controls whether to display the dedicated feedback panel
const showFeedback = ref(false);

const currentQuestion = computed(() => quizStore.currentQuestion);

function submitAnswer(answer) {
  // Prevent processing if already showing the feedback panel
  if (showFeedback.value) return;

  const normalizedAnswer =
    typeof answer === 'string' ? answer.trim().toLowerCase() : answer;
  const normalizedCorrect = currentQuestion.value.answer.trim().toLowerCase();

  if (normalizedAnswer === normalizedCorrect) {
    // Correct answer: show full feedback view
    feedbackMessage.value = "Saktë!";
    showFeedback.value = true;
    quizStore.answerQuestion(true, currentQuestion.value.miniLesson);
  } else {
    attemptCount.value++;
    if (attemptCount.value < 2) {
      // First wrong attempt: show inline error, let user try again
      feedbackMessage.value = "Gabim, provo përsëri!";
    } else {
      // Second attempt: show full feedback with the correct answer
      feedbackMessage.value = `Gabim. Përgjigjja e saktë është: ${currentQuestion.value.answer}`;
      showFeedback.value = true;
      quizStore.answerQuestion(false, currentQuestion.value.miniLesson);
    }
  }
}

function nextQuestion() {
  // Reset local state for the next question
  feedbackMessage.value = '';
  userAnswer.value = '';
  attemptCount.value = 0;
  showFeedback.value = false;
  quizStore.nextQuestion();
}

function resetQuiz() {
  quizStore.resetQuiz();
  feedbackMessage.value = '';
  userAnswer.value = '';
  attemptCount.value = 0;
  showFeedback.value = false;
}
</script>

<style scoped>
.quiz {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

.question-card,
.feedback-panel {
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
</style>