const { v4 } = require('uuid')

class Answer {
  constructor(author, summary) {
    this.id = v4()
    this.author = author
    this.summary = summary
  }
}

module.exports = { Answer }
