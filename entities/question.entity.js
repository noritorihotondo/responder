const { v4 } = require('uuid')

class Question {
  constructor(author, summary) {
    this.id = v4()
    this.author = author
    this.summary = summary
    this.answers = []
  }
}



module.exports = { Question }
