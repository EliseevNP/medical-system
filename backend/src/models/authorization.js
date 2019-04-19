export default (sequelize, DataTypes) => {
  var authorization = sequelize.define('authorization', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    lastUsage: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false
  });

  authorization.associate = function(models) {
    authorization.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });
  };

  return authorization;
};
