"use strict";

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        "Message",
        {
            fromId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            toId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: "messages",
            timestamps: true,
        }
    );

    Message.associate = (models) => {

        Message.belongsTo(models.User, {
            as: "sender",
            foreignKey: "fromId",
        });


        Message.belongsTo(models.User, {
            as: "receiver",
            foreignKey: "toId",
        });
    };

    return Message;
};
