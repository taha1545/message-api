"use strict";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "client",
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        IsVerify: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        otpCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        googleId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        }
    }, {
        tableName: "users",
        timestamps: true
    });

    User.associate = (models) => {
        // 
        User.hasMany(models.Message, {
            as: "sentMessages",
            foreignKey: "fromId",
        });

        //
        User.hasMany(models.Message, {
            as: "receivedMessages",
            foreignKey: "toId",
        });

        User.hasMany(models.Friend, {
            as: "sentFriends",
            foreignKey: "userId",
        });

        User.hasMany(models.Friend, {
            as: "receivedFriends",
            foreignKey: "friendId",
        });
    };

    return User;
};
