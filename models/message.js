'use strict';
module.exports = function(sequelize, DataTypes) {
  var message = sequelize.define('message', {
    body: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.INTEGER
    }
    }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        message.belongsTo(models.user, {foreignKey: 'user_id'});
      }
    }
  });
  return message;
};
