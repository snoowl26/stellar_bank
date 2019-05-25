const express = require('express')
const helmet = require('helmet')

const config = require('./config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use('/api/validate', async (req, res, next) => {
  const { email } = req.body

  console.log("Validate KYC");

  if (!email) {
    return res.status(400).send('Email data not sent')
  }

  const notCompliant = config.KYCrules.some(rule => email.includes(rule))
  if (notCompliant) {
    return res.status(201).send('KYC not compliant');
  }

  return res.status(200).send('OK') 
})

const port = config.uS_port || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));