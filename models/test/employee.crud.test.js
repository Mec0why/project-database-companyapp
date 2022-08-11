const Employee = require('../employee.model');
const expect = require('chai').expect;

describe('Employee', () => {
  
  after(() => {
    mongoose.models = {};
  });
});
