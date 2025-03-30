// src/store/quizStore.js
import { defineStore } from 'pinia';
import questionsData from '../data/questions.json';
// (Optional: import a seeded random library if you prefer more robust randomness)

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: questionsData,
    selectedQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    miniLessons: [],
    selectedNumber: 10,
    seed: null, // new: store the seed
  }),
  actions: {
    setSelectedNumber(num) {
      this.selectedNumber = num;
    },
    // New method that accepts a seed and number of questions
    startQuizWithSeed(seed, num) {
      this.seed = seed;
      // A simple seeded random generator (for demonstration purposes)
      // Note: For production, consider using a library like 'seedrandom'
      const seededRandom = () => {
        const x = Math.sin(parseInt(seed)) * 10000;
        return x - Math.floor(x);
      };
      // Deterministically shuffle the questions using the seeded random
      const shuffled = [...this.questions].sort(() => seededRandom() - 0.5);
      this.selectedQuestions = shuffled.slice(0, num);
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.miniLessons = [];
    },
    // Default startQuiz, which generates a seed automatically
    startQuiz() {
      const generatedSeed = Math.floor(Math.random() * 1000000).toString();
      this.startQuizWithSeed(generatedSeed, this.selectedNumber);
    },
    answerQuestion(isCorrect, miniLesson) {
      if (isCorrect) {
        this.score++;
      }
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