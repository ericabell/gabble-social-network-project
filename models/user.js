'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    display_name: DataTypes.STRING,
    google_profile_image_link: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    google_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};