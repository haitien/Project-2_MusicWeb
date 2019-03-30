class CustomValidator {

    constructor(validations) {
        this.validations = validations;
        let temp = {};
        Object.keys(validations).map(key => {
            if (!validations[key].expectResults) {
                const length = validations[key].methods.length;
                validations[key].expectResults = new Array(length).fill(true)
            }
            temp[key] = {isInvalid: false, message: ''};
            return true;
        });
        this.result = {isValid: false};
    }

    validate(state) {
        const key = Object.keys(state)[0];
        const value = state[key].toString();
        this.result[key] = this.validateOne(value, this.validations[key]);
        return this.result[key];
    }

    validateOne(value, validation){
        const args =  validation.args || [];
        const {methods, messages, expectResults} = validation;
        let message = '';
        const valid = methods.every((method, index) => {
            const result = method(value, args[index]);
            if (result === expectResults[index]) {
                return true;
            } else {
                message = messages[index];
                return false;
            }
        });
        return {isInvalid: !valid, message: message}
    }
    validateAll(state) {
        this.result = {isValid: false};
        const fields = Object.keys(this.validations);
        this.result.isValid = fields.every(field => {
            if (!state.hasOwnProperty(field)) return true;
            this.result[field] = this.validateOne(state[field], this.validations[field]);
            return !this.result[field].isInvalid;
        });
        return this.result;
    }
}

export default CustomValidator;