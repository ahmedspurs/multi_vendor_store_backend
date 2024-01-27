const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descr: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    product_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    buy_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    sale_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sub_categories',
        key: 'id'
      }
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "sub_category_id",
        using: "BTREE",
        fields: [
          { name: "sub_category_id" },
        ]
      },
      {
        name: "vendor_id",
        using: "BTREE",
        fields: [
          { name: "vendor_id" },
        ]
      },
    ]
  });
};
