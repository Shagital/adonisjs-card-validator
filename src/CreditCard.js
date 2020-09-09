class CreditCard {
    constructor() {
        this.cards = {
            // Debit cards must come first, since they have more specific patterns than their credit-card equivalents.

            visaelectron: {
                type: 'visaelectron',
                pattern: /^4(026|17500|405|508|844|91[37])/,
                length: [16],
                cvcLength: [3],
                'luhn': true,
            },
            maestro: {
                type: 'maestro',
                pattern: /^(5(018|0[23]|[68])|6(39|7))/,
                length: [12, 13, 14, 15, 16, 17, 18, 19],
                cvcLength: [3],
                luhn: true,
            },
            forbrugsforeningen: {
                type: 'forbrugsforeningen',
                pattern: /^600/,
                length: [16],
                cvcLength: [3],
                luhn: true,
            },
            dankort: {
                type: 'dankort',
                pattern: /^5019/,
                length: [16],
                cvcLength: [3],
                luhn: true,
            },
            // Credit cards
            visa: {
                type: 'visa',
                pattern: /^4/,
                length: [13, 16],
                cvcLength: [3],
                luhn: true,
            },
            mastercard: {
                type: 'mastercard',
                pattern: /^(5[0-5]|2[2-7])/,
                length: [16],
                cvcLength: [3],
                luhn: true,
            },
            amex: {
                type: 'amex',
                pattern: /^3[47]/,
                format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                length: [15],
                cvcLength: [3, 4],
                luhn: true,
            },
            dinersclub: {
                type: 'dinersclub',
                pattern: /^3[0689]/,
                length: [14],
                cvcLength: [3],
                luhn: true,
            },
            discover: {
                type: 'discover',
                pattern: /^6([045]|22)/,
                length: [16],
                cvcLength: [3],
                luhn: true,
            },
            unionpay: {
                type: 'unionpay',
                pattern: /^(62|88)/,
                length: [16, 17, 18, 19],
                cvcLength: [3],
                luhn: false,
            },
            jcb: {
                type: 'jcb',
                pattern: /^35/,
                length: [16],
                cvcLength: [3],
                luhn: true,
            },
        };
    }


    validCreditCard(number, type = null) {
        let ret = {
            valid: false,
            number: '',
            type: '',
        };

        // Strip non-numeric characters
        number = number.replace('/[^0-9]/g', '');

        if (!type || !type.length) {
            type = this.creditCardType(number);
        }

        if (this.cards[type] && this.validCard(number, type)) {
            return {
                valid: true,
                number: number,
                type: type,
            };
        }

        return ret;
    }

    validCvc(cvc, type) {
        return (!isNaN(cvc) && this.cards[type] && this.validCvcLength(cvc, type));
    }

    validDate(year, month) {

        if (month < 10 && month.length == 1) {
            month = `0${month}`
        }
        if (!year.toString().match(/^20\d\d$/)) {
            return false;
        }

        if (!month.toString().match(/^(0[1-9]|1[0-2])$/)) {
            return false;
        }

        // past date
        let fullYear = new Date().getUTCFullYear();
        let fullMonth = new Date().getUTCMonth();

        return !(year < fullYear || year == fullYear && month < fullMonth);

    }

    // PROTECTED
    // ---------------------------------------------------------

    creditCardType(number) {
        let type = '';
        for (let key in this.cards) {
            let card = this.cards[key];
            type = card.type;
            if (number.toString().match(card['pattern'])) {
                break;
            }
        }
        return type;
    }

    validCard(number, type) {
        return (this.validPattern(number, type) && this.validLength(number, type) && this.validLuhn(number, type));
    }

    validPattern(number, type) {
        return number.match(this.cards[type]['pattern']);
    }

    validLength(number, type) {
        for (let length of this.cards[type]['length']) {
            if (number.length == length) {
                return true;
            }
        }
        return false;
    }

    validCvcLength(cvc, type) {
        for (let length of this.cards[type]['cvcLength']) {
            if (cvc.length == length) {
                return true;
            }
        }

        return false;
    }

    validLuhn(number, type) {
        if (!this.cards[type]['luhn']) {
            return true;
        } else {
            return this.luhnCheck(number);
        }
    }

    luhnCheck(number) {
        let checksum = 0;
        for (let i = (2 - (number.length % 2)); i <= number.length; i += 2) {
            checksum += parseInt(number[i - 1]);
        }

        // Analyze odd digits in even length strings or even digits in odd length strings.
        for (let i = (number.length % 2) + 1; i < number.length; i += 2) {
            let digit = parseInt(number[i - 1]) * 2;
            if (digit < 10) {
                checksum += digit;
            } else {
                checksum += (digit - 9);
            }
        }

        return ((checksum % 10) == 0)

    }
}

module.exports = CreditCard;
