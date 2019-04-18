export default (sequelize, DataTypes) => {
  var doctor = sequelize.define('doctor', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    department_id: {
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
    doctor.belongsTo(models.user, {
      foreignKey: 'user_id',
      onDelete: 'cascade'
    });
    doctor.belongsTo(models.organization, {
      foreignKey: 'organization_id',
      onDelete: 'cascade'
    });
    doctor.belongsTo(models.department, {
      foreignKey: 'department_id',
      onDelete: 'cascade'
    });
    doctor.hasMany(models.event, {
      foreignKey: 'doctor_id',
      onDelete: 'cascade'
    });
  };

  return doctor;
};
