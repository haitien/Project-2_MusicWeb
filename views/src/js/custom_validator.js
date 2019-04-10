class CustomValidator {

    constructor(validations) {
        this.validations = validations;
        this.message = {};
        Object.keys(validations)
            .filter(item => (!validations[item].expectResults))
            .forEach(key => {
                const size = validations[key].methods.length;
                this.validations[key].expectResults = new Array(size).fill(true)
            });
    }

    validate(key, value) {
        value = value || '';
        const validation = this.validations[key];
        const args = validation.args || [];
        const {methods, messages, expectResults} = validation;
        let message = null;
        methods.every((method, index) => {
            const result = method(value, args[index]);
            if (result === expectResults[index]) {
                return true;
            } else {
                message = messages[index];
                return false;
            }
        });
        this.message[key] = message;
        return message;
    }

    /*
    * khi validate all, form sẽ gửi các field cần validate kèm theo value
    * cần gửi lại KQ tổng thể là có hợp lệ hay không, nếu không hợp lệ, gửi lỗi đầu tiên gặp phải
    * lưu ý nếu field mà đã validate rồi không cần validate lại
    * nhưng do khi password thay đổi thì password confirm sẽ lỗi theo nên cần valiate lại hết
    */
    validateAll(state) {
        let result = null;
        Object.keys(this.validations).filter(item => {
            return state.hasOwnProperty(item)
        }).every(field => {
            const message = this.validate(field, state[field]);
            if (message) {
                result = {key: field, message: message}
            }
            return !message;
        });
        return result;
    }

}

export default CustomValidator;