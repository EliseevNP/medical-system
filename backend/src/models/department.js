export default (sequelize, DataTypes) => {
  var department = sequelize.define('department', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  department.associate = function(models) {
    department.belongsTo(models.organization, {
      foreignKey: 'organizationId',
      onDelete: 'cascade'
    });
  };

  return department;
};
