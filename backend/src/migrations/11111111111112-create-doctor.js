'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('doctor', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      organizationId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      departmentId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('second', 'first', 'higher'),
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('doctor');
  }
};