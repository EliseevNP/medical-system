export default (sequelize, DataTypes) => {
  var organization = sequelize.define('organization', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    site: {
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

  organization.associate = function(models) {
    organization.hasMany(models.doctor, {
      foreignKey: 'organization_id',
      onDelete: 'cascade'
    });
  };

  return organization;
};
