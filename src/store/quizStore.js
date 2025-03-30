// src/store/quizStore.js
import { defineStore } from 'pinia';
import questionsData from '../data/questions.json';

// src/store/quizStore.js
export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: questionsData,
    selectedQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    miniLessons: [],
    selectedNumber: 10,
  }),
  actions: {
    setSelectedNumber(num) {
      this.selectedNumber = num;
    },
    startQuiz() {
      const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
      this.selectedQuestions = shuffled.slice(0, this.selectedNumber);
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.miniLessons = [];
    },
    // Updated action: just update the result, without advancing the question.
    answerQuestion(isCorrect, miniLesson) {
      if (isCorrect) {
        this.score++;
      }
      this.miniLessons.push(miniLesson);
    },
    // This action is called only when the user clicks "Next Question"
    nextQuestion() {
      this.currentQuestionIndex++;
    },
    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.miniLessons = [];
      this.selectedQuestions = [];
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