// src/store/quizStore.js
import { defineStore } from 'pinia';
import questionsData from '../data/questions.json';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: questionsData,
    selectedQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    miniLessons: [],
    selectedNumber: 10,
    seed: null,
  }),
  actions: {
    setSelectedNumber(num) {
      this.selectedNumber = num;
    },
    startQuizWithSeed(seed, num) {
      this.seed = seed;
      // Use parseFloat for safety, and fallback if invalid
      let numericSeed = parseFloat(seed);
      if (isNaN(numericSeed)) {
        numericSeed = Math.random(); // fallback to a random seed
        console.warn("Invalid seed provided. Falling back to random seed:", numericSeed);
      }
      
      // Simple seeded random function
      const seededRandom = () => {
        // This is a basic implementation – for more robust results, consider using seedrandom.
        const x = Math.sin(numericSeed++) * 10000;
        return x - Math.floor(x);
      };
      
      // Deterministic shuffle using the seeded random function.
      const shuffled = [...this.questions].sort(() => seededRandom() - 0.5);
      this.selectedQuestions = shuffled.slice(0, num);
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.miniLessons = [];
      console.log("Quiz started with seed:", this.seed, "and numQuestions:", num);
    },
    startQuiz() {
      // Generate a random seed as a string and use default selectedNumber.
      const generatedSeed = Math.floor(Math.random() * 1000000).toString();
      this.startQuizWithSeed(generatedSeed, this.selectedNumber);
    },
    answerQuestion(isCorrect, miniLesson) {
      if (isCorrect) this.score++;
      this.miniLessons.push(miniLesson);
    },
    nextQuestion() {
      this.currentQuestionIndex++;
    },
    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.miniLessons = [];
      this.selectedQuestions = [];
      this.seed = null;
    }
  },
  getters: {
    currentQuestion(state) {
      return state.selectedQuestions[state.currentQuestionIndex];
    },
    isQuizFinished(state) {
      return state.currentQuestionIndex >= state.selectedQuestions.length;
    }
  }
});