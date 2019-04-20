export default (sequelize, DataTypes) => {
  var doctor = sequelize.define('doctor', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('second', 'first', 'higher'),
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  doctor.associate = function(models) {
    doctor.belongsTo(models.organization, {
      foreignKey: 'organizationId',
      onDelete: 'cascade'
    });
    doctor.belongsTo(models.department, {
      foreignKey: 'departmentId',
      onDelete: 'cascade'
    });
    doctor.hasMany(models.event, {
      foreignKey: 'doctorId',
      onDelete: 'cascade'
    });
  };

  return doctor;
};
