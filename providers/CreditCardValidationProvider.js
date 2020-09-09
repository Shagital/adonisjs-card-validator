'use strict';


/** .type {typeof import('@adonisjs/fold')} */
const {ServiceProvider} = require('@adonisjs/fold');
const Validator = use('@adonisjs/validator/src/Validator');
const CreditCard = require(`${__dirname}/../src/CreditCard`);

class CreditCardValidationProvider extends ServiceProvider {

    boot() {
        let cc = new CreditCard();

        this.validateCardNumber(cc);
        this.validateCvv(cc);
        this.validateCardExpiryDate(cc);
    }

    validateCvv(cc) {
        let existsFn = async (data, field, message, args, get) => {
            const value = get(data, field);
            if (!value) {
                /**
                 * skip validation if value is not defined. `required` rule
                 * should take care of it.
                 */
                return
            }

            if (!args[0]) {
                //try to grab the content of request param `card`, assuming it's the card number
                let validateCard = cc.validCreditCard(data['card'], args[0]);
                args[0] = validateCard.type;
            }
            let cvv2 = cc.validCvc(value, args[0]);
            if (!cvv2) {
                throw `${value} is not a valid ${field}`
            }
        };

        Validator.extend('cvv', existsFn);
    }

    validateCardNumber(cc) {
        let existsFn = async (data, field, message, args, get) => {
            const value = get(data, field);
            if (!value) {
                /**
                 * skip validation if value is not defined. `required` rule
                 * should take care of it.
                 */
                return
            }

            let validateCard = cc.validCreditCard(value, args[0]);
            if (!validateCard.valid) {
                throw `${value} is not a valid card number`
            }
        };

        Validator.extend('card', existsFn);
    }

    validateCardExpiryDate(cc) {
        let existsFn = async (data, field, message, args, get) => {
            const value = get(data, field);
            if (!value) {
                /**
                 * skip validation if value is not defined. `required` rule
                 * should take care of it.
                 */
                return
            }

            let date = value.split('-');

            if (!cc.validDate(date[0], date[1])) {
                throw `${value} is not a valid card expiry date. ${field} should be in format YYYY-MM e.g 2020-08`
            }
        };

        Validator.extend('cardExp', existsFn);
    }
}


module.exports = CreditCardValidationProvider;
