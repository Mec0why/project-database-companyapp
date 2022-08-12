const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });
  describe('Reading data', () => {
    before(async () => {
      const cases = [
        {
          firstName: 'John',
          lastName: 'Doe',
          department: '62dd9723a3569272a44c2812',
        },
        {
          firstName: 'Mark',
          lastName: 'Bernt',
          department: '62dd9734a3569272a44c2813',
        },
        {
          firstName: 'July',
          lastName: 'May',
          department: '62dd973ea3569272a44c2814',
        },
      ];

      for (let test of cases) {
        const emp = new Employee(test);
        await emp.save();
      }

      const dep = new Department({ _id: '62dd9723a3569272a44c2812', name: 'Finance' });
      await dep.save();

    });
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 3;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return department object from the data with "find.populate("department")" method', async () => {
      const employees = await Employee.find().populate('department');

      expect(employees[0].department).to.be.an('object');
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'Mark',
        lastName: 'Bernt',
        department: '62dd9734a3569272a44c2813',
      });
      expect(employee).to.exist;
    });
    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: '62dd9734a3569272a44c2813',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const cases = [
        {
          firstName: 'John',
          lastName: 'Doe',
          department: '62dd9723a3569272a44c2812',
        },
        {
          firstName: 'Mark',
          lastName: 'Bernt',
          department: '62dd9734a3569272a44c2813',
        },
        {
          firstName: 'July',
          lastName: 'May',
          department: '62dd973ea3569272a44c2814',
        },
      ];

      for (let test of cases) {
        const emp = new Employee(test);
        await emp.save();
      }
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'July' },
        { $set: { firstName: '=July=' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=July=',
      });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'July' });
      employee.firstName = '=July=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=July=',
      });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'Updated!' } });

      const employees = await Employee.find({ lastName: 'Updated!' });

      expect(employees.length).to.be.equal(3);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Deleting data', () => {
    beforeEach(async () => {
      const cases = [
        {
          firstName: 'John',
          lastName: 'Doe',
          department: '62dd9723a3569272a44c2812',
        },
        {
          firstName: 'Mark',
          lastName: 'Bernt',
          department: '62dd9734a3569272a44c2813',
        },
        {
          firstName: 'July',
          lastName: 'May',
          department: '62dd973ea3569272a44c2814',
        },
      ];

      for (let test of cases) {
        const emp = new Employee(test);
        await emp.save();
      }
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Mark' });
      const removedEmployee = await Employee.findOne({
        firstName: 'Mark',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'May' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        name: 'May',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();

      const removedEmployee = await Employee.find();

      expect(removedEmployee.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
