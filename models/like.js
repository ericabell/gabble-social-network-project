'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        like.belongsTo(models.user, {foreignKey: 'user_id'});
        like.belongsTo(models.message, {foreignKey: 'message_id'});
      }
    }
  });
  return like;
};
