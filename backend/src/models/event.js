export default (sequelize, DataTypes) => {
  var event = sequelize.define('event', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
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
      foreignKey: 'doctorId',
      onDelete: 'cascade'
    });
    event.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });
  };

  return event;
};
