class Validator {
  constructor() {
    this.strategies = {};
    this.errors = {};
  }

  addStrategy(field, strategy) {
    if (!this.strategies[field]) {
      this.strategies[field] = [];
    }
    this.strategies[field].push(strategy);
    return this;
  }

  validateField(field, value) {
    if (!this.strategies[field]) return null;
    
    for (const strategy of this.strategies[field]) {
      const error = strategy(value);
      if (error) return error;
    }
    
    return null;
  }

  validateForm(formData) {
    this.errors = {};
    let isValid = true;

    for (const field in this.strategies) {
      const error = this.validateField(field, formData[field]);
      if (error) {
        this.errors[field] = error;
        isValid = false;
      }
    }

    return {
      isValid,
      errors: this.errors
    };
  }

  static required(message = 'This field is required') {
    return value => value.length === 0 ? message : null;
  }

  static minLength(min, message) {
    return value => value.length < min ? message : null;
  }

  static maxLength(max, message) {
    return value => value.length > max ? message : null;
  }

  static email(message = 'Please enter a valid email') {
    return value => !/\S+@\S+\.\S+/.test(value) ? message : null;
  }
}

export default Validator;