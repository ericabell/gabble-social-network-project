'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    google_profile_image_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  user.associate = function(models) {
    user.hasMany(models.message, {as: 'messages', foreignKey: 'authorId'});
    user.hasMany(models.like, {as: 'likes', foreignKey: 'userId'});
  };

  return user;
};
