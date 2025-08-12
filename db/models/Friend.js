"use strict";

module.exports = (sequelize, DataTypes) => {
    const Frined = sequelize.define(
        "Frined",
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            friendId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending'
            },
        },
        {
            tableName: "friends",
            timestamps: true,
        }
    );

    Frined.associate = (models) => {

        Frined.belongsTo(models.User, {
            as: "senderFriend",
            foreignKey: "userId",
        });


        Frined.belongsTo(models.User, {
            as: "receiverFriend",
            foreignKey: "friendId",
        });
    };

    return Frined;
};
