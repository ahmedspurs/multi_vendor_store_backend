var DataTypes = require("sequelize").DataTypes;
var _ads = require("./ads");
var _attributes = require("./attributes");
var _categories = require("./categories");
var _cities = require("./cities");
var _countries = require("./countries");
var _order_details = require("./order_details");
var _orders = require("./orders");
var _product_attributes = require("./product_attributes");
var _product_images = require("./product_images");
var _product_variations = require("./product_variations");
var _products = require("./products");
var _products_rate = require("./products_rate");
var _store_details = require("./store_details");
var _sub_categories = require("./sub_categories");
var _success_partners = require("./success_partners");
var _users = require("./users");
var _variation_attributes = require("./variation_attributes");
var _vendor_payments_details = require("./vendor_payments_details");

function initModels(sequelize) {
  var ads = _ads(sequelize, DataTypes);
  var attributes = _attributes(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var cities = _cities(sequelize, DataTypes);
  var countries = _countries(sequelize, DataTypes);
  var order_details = _order_details(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var product_attributes = _product_attributes(sequelize, DataTypes);
  var product_images = _product_images(sequelize, DataTypes);
  var product_variations = _product_variations(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var products_rate = _products_rate(sequelize, DataTypes);
  var store_details = _store_details(sequelize, DataTypes);
  var sub_categories = _sub_categories(sequelize, DataTypes);
  var success_partners = _success_partners(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var variation_attributes = _variation_attributes(sequelize, DataTypes);
  var vendor_payments_details = _vendor_payments_details(sequelize, DataTypes);

  product_attributes.belongsTo(attributes, { as: "attribute", foreignKey: "attribute_id"});
  attributes.hasMany(product_attributes, { as: "product_attributes", foreignKey: "attribute_id"});
  variation_attributes.belongsTo(attributes, { as: "attribute", foreignKey: "attribute_id"});
  attributes.hasMany(variation_attributes, { as: "variation_attributes", foreignKey: "attribute_id"});
  sub_categories.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(sub_categories, { as: "sub_categories", foreignKey: "category_id"});
  store_details.belongsTo(cities, { as: "city", foreignKey: "city_id"});
  cities.hasMany(store_details, { as: "store_details", foreignKey: "city_id"});
  cities.belongsTo(countries, { as: "country", foreignKey: "country_id"});
  countries.hasMany(cities, { as: "cities", foreignKey: "country_id"});
  vendor_payments_details.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(vendor_payments_details, { as: "vendor_payments_details", foreignKey: "order_id"});
  variation_attributes.belongsTo(product_variations, { as: "variation", foreignKey: "variation_id"});
  product_variations.hasMany(variation_attributes, { as: "variation_attributes", foreignKey: "variation_id"});
  product_attributes.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_attributes, { as: "product_attributes", foreignKey: "product_id"});
  product_images.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_images, { as: "product_images", foreignKey: "product_id"});
  product_variations.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_variations, { as: "product_variations", foreignKey: "product_id"});
  products_rate.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(products_rate, { as: "products_rates", foreignKey: "product_id"});
  products.belongsTo(sub_categories, { as: "sub_category", foreignKey: "sub_category_id"});
  sub_categories.hasMany(products, { as: "products", foreignKey: "sub_category_id"});
  orders.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(orders, { as: "orders", foreignKey: "user_id"});
  products.belongsTo(users, { as: "vendor", foreignKey: "vendor_id"});
  users.hasMany(products, { as: "products", foreignKey: "vendor_id"});
  products_rate.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(products_rate, { as: "products_rates", foreignKey: "user_id"});
  store_details.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(store_details, { as: "store_details", foreignKey: "user_id"});
  vendor_payments_details.belongsTo(users, { as: "vendor", foreignKey: "vendor_id"});
  users.hasMany(vendor_payments_details, { as: "vendor_payments_details", foreignKey: "vendor_id"});

  return {
    ads,
    attributes,
    categories,
    cities,
    countries,
    order_details,
    orders,
    product_attributes,
    product_images,
    product_variations,
    products,
    products_rate,
    store_details,
    sub_categories,
    success_partners,
    users,
    variation_attributes,
    vendor_payments_details,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
