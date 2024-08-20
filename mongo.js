const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length >= 5) {
  const name = process.argv.slice(3, -1).join(' ')
  const number = process.argv[process.argv.length - 1]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Please specify password or a new persons name and number')
  mongoose.connection.close()
}
