const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const nodeData = sequelizeClient.define('node_data', {
    time: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    node_id: {
      type: DataTypes.INTEGER
    },
    data: {
      type: DataTypes.JSONB
    }
  },
  {
    timestamps: true,
    createdAt: 'time',
    updatedAt: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
      beforeFind(params) {
        if (params.where.hasOwnProperty('attribute')) {
          delete params.where.attribute
        }
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  nodeData.associate = function (models) {
    nodeData.belongsTo(models.node, {foreignKey: 'node_id', sourceKey: 'id'})
  };

  return nodeData;
};
