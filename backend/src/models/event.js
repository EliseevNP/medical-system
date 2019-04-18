export default (sequelize, DataTypes) => {
  var event = sequelize.define('event', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('busy', 'free', 'unavailable'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  event.associate = function(models) {
    event.belongsTo(models.doctor, {
      foreignKey: 'doctor_id',
      onDelete: 'cascade'
    });
    event.belongsTo(models.user, {
      foreignKey: 'user_id',
      onDelete: 'cascade'
    });
  };

  return event;
};
