export default (sequelize, DataTypes) => {
  var authorization = sequelize.define('authorization', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    last_usage: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  authorization.associate = function(models) {
    authorization.belongsTo(models.user, {
      foreignKey: 'user_id',
      onDelete: 'cascade'
    });
  };

  return authorization;
};
