const { readFile, writeFile } = require('fs/promises')
const { Answer } = require('../entities/answer.entity')
const { Question } = require('../entities/question.entity')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const foundQuestion = questions.find(question => question.id === questionId)
    return foundQuestion
  }
  const addQuestion = async question => {
    if (!question.author) throw new Error('Provide author')
    if (!question.summary) throw new Error('Provide summary')

    const createdQuestion = new Question(question.author, question.summary)
    const questions = await getQuestions()
    const updatedQuestions = [...questions, createdQuestion]
    const stringifiedQuestion = JSON.stringify(updatedQuestions, null, 4)
    await writeFile(fileName, stringifiedQuestion)
    return createdQuestion
  }
  const getAnswers = async questionId => {
    const { answers } = await getQuestionById(questionId)
    return answers
  }
  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    const foundAnswer = await answers.find(answer => answer.id === answerId)
    return foundAnswer
  }
  const addAnswer = async (questionId, answer) => {
    if (!answer.author) throw new Error('Provide author')
    if (!answer.summary) throw new Error('Provide summary')

    const createdAnswer = new Answer(answer.author, answer.summary)
    let questions = await getQuestions(questionId)
    const questionIndex = questions.findIndex(
      question => question.id === questionId
    )
    console.log(questionIndex)
    if (questionIndex < 0) throw new Error("Can't find a question with this id")
    questions[questionIndex].answers = [
      ...questions[questionIndex].answers,
      createdAnswer
    ]
    const stringifiedQuestion = JSON.stringify(questions, null, 4)
    await writeFile(fileName, stringifiedQuestion)
    return questions[questionIndex].answers
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
