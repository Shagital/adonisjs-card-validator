# Adonisjs Card Validator ▲
![npm](https://img.shields.io/npm/dt/@shagital/adonisjs-card-validator?style=plastic)
![npm (scoped)](https://img.shields.io/npm/v/@shagital/adonisjs-card-validator)
![NPM](https://img.shields.io/npm/l/@shagital/adonisjs-card-validator)

## Introduction
Adds credit/debit card validation functionality to [Adonisjs](https://github.com/adonisjs/core) using [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)

### Step One - Install
#### Via Adonis CLI
`adonis install @shagital/adonisjs-card-validator`

#### Via npm/yarn
- Install package
```shell
// via npm
npm require @shagital/adonisjs-card-validator

// via yarn
yarn add @shagital/adonisjs-card-validator
```


### Step Two - Register Provider
Open `start/app.js` and add `@shagital/adonisjs-card-validator/providers/CreditCardValidationProvider` to the `providers` array

## Usage
You use the `card`, `cvv` and `cardExp` validation syntax just like you'd normally do validation in Adonisjs. Examples below:
NOTE: The specified card type need to be supported. Currency supported card types are:
- visaelectron
- maestro
- forbrugsforeningen
- dankort
- visa
- mastercard
- amex
- dinersclub
- discover
- unionpay
- jcb

### controller method
```js
//app/Controllers/Http/UserController

const { validate } = use('Validator')

class UserController {

  async store ({ request, session, response }) {
    const rules = {
      card: 'required|card', // validate card number
      cvv: 'required|cvv', // validate cvv2
      expiry_date: 'required|cardExp', // validate card expiry date in the format YYYY-MM
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
     
      return response.redirect('back')
    }

    return 'Validation passed'
  }
}
```

### Validator
```js
//app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get rules () {
    return {
       card: 'required|card:mastercard', // validate mastercard card number
       cvv: 'required|cvv:mastercard', // validate mastercard cvv2
       expiry_date: 'required|cardExp', // validate card expiry date in the format YYYY-MM
    }
  }
}
```


## Contribution

Free for all, if you find an issue with the package or think of an improvement, please send in a PR.
