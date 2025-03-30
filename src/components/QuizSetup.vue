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
const questionOptions = [5, 10, 20];

function startQuiz() {
  quizStore.setSelectedNumber(selectedNumber.value);
  quizStore.startQuiz();
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