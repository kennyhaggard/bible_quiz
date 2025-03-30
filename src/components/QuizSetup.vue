<template>
  <div class="quiz-setup">
    <h1>Vendos Parametrat e Quiz-it</h1>
    <label for="numQuestions">Zgjidh numrin e pyetjeve:</label>
    <select v-model="selectedNumber" id="numQuestions">
      <option v-for="option in questionOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <button @click="startQuiz">Fillo Quiz-in</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuizStore } from '../store/quizStore';

const quizStore = useQuizStore();
const selectedNumber = ref(quizStore.selectedNumber);

// Define the options for number of questions. Feel free to adjust these.
const questionOptions = [5, 10, 20];

function startQuiz() {
  // Update the store with the selected number of questions
  quizStore.setSelectedNumber(selectedNumber.value);
  // Initialize the quiz by shuffling and selecting the questions
  quizStore.startQuiz();
  // Here, you might navigate to the Quiz component
  // For now, you can log to the console to confirm:
  console.log('Quiz started with', selectedNumber.value, 'questions');
}
</script>

<style scoped>
.quiz-setup {
  max-width: 500px;
  margin: 2rem auto;
  text-align: center;
}

select {
  margin: 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>