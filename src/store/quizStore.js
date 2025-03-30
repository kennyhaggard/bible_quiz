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
    seed: null, // will store the seed if provided
  }),
  actions: {
    setSelectedNumber(num) {
      this.selectedNumber = num;
    },
    // Start quiz with a given seed and number of questions.
    startQuizWithSeed(seed, num) {
      this.seed = seed;
      // A simple seeded random generator; consider using a library like seedrandom for robust use.
      const seededRandom = () => {
        const x = Math.sin(parseInt(seed)) * 10000;
        return x - Math.floor(x);
      };
      // Deterministic shuffle using the seeded random function.
      const shuffled = [...this.questions].sort(() => seededRandom() - 0.5);
      this.selectedQuestions = shuffled.slice(0, num);
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.miniLessons = [];
    },
    // Default startQuiz: generates a random seed if none is provided.
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