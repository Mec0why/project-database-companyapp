const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');

const employeesSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: ObjectId, required: true, ref: 'Department' },
});

module.exports = mongoose.model('Employee', employeesSchema);
