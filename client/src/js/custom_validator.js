class CustomValidator {

    constructor(validations) {
        this.validations = validations;
        this.result = true;
        Object.keys(validations)
            .filter(item=>(!validations[item].expectResults))
            .forEach(key=>{
                const length = validations[key].methods.length;
                this.validations[key].expectResults = new Array(length).fill(true)
            });
    }
    validateOne(state) {
        const key = Object.keys(state)[0];
        const value = state[key];
        return this.validate(value, this.validations[key])
    }

    validate(value, validation){
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
        return message;
    }

    validateAll(state) {
        const fields = Object.keys(this.validations);
        const result = {};
        fields.every(field => {
            this.isDirty[field] = true;
            result[field] = this.validateOne(state[field], this.validations[field]);
            return !result[field];
        });
        console.log('dirty', this.isDirty);
        console.log('Result', result);
        return result;
    }
}

export default CustomValidator;