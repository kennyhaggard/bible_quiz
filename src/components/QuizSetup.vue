<template>
  <div class="setup-container">
    <header class = 'quiz-header'>
	<h1>Pyetje Biblike</h1>
    </header>
	<h2>Vendos Parametrat e Quiz-it</h2>
    <div class="setup-content">
      <label class="label" for="numQuestions">Zgjidh numrin e pyetjeve:</label>
      <select v-model="selectedNumber" id="numQuestions" class="select">
        <option v-for="option in questionOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <button class="start-btn" @click="startQuiz">Fillo Quiz-in</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuizStore } from '../store/quizStore';

const quizStore = useQuizStore();

// Default or previously selected number of questions
const selectedNumber = ref(quizStore.selectedNumber);

// Options for number of questions
const questionOptions = [5, 10, 20];

function startQuiz() {
  quizStore.setSelectedNumber(selectedNumber.value);
  quizStore.startQuiz();
}
</script>

<style scoped>
.setup-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  padding: 1rem;
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


.setup-container h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  /* If you want a bold, gradient header similar to the quiz page: */
  /* background: linear-gradient(135deg, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
}

.setup-content {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}

.label {
  font-size: 1.1rem;
  font-weight: 600;
}

.select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ccc;
  background: #fff;
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #ff7e5f;
}

.start-btn {
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #43cea2, #185a9d);
  color: white;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.start-btn:hover {
  background: linear-gradient(135deg, #2ecc71, #3498db);
  transform: scale(1.02);
}
</style>