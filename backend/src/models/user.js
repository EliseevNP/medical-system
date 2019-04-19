export default (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secondName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patronymic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('patient', 'doctor'),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  user.associate = function(models) {
    user.hasMany(models.authorization, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });
    user.hasMany(models.event, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    });
  };

  return user;
};
