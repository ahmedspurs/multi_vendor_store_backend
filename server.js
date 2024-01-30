const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env` });
const cors = require("cors");
// const cookieParser = require("cookie-parser");
// global.loadLocaleMessages = require("locnode");

const fileEasyUpload = require("express-easy-fileuploader");
const file_upload = require("./middleware/media_middleware");
const ads = require("./routes/Ads");
const attributes = require("./routes/Attributes");

const categories = require("./routes/Categories");
const cities = require("./routes/Cities");
const countries = require("./routes/Countries");

const sub_categories = require("./routes/SubCategories");
const order_details = require("./routes/OrderDetails");
const orders = require("./routes/Orders");
const product_images = require("./routes/ProductImages");
const product_attributes = require("./routes/ProductAttributes");
const product_variations = require("./routes/ProductVariations");
const products = require("./routes/Products");
const success_partners = require("./routes/SuccessPartners");
const users = require("./routes/Users");
const vendor_payments_details = require("./routes/VendorPaymentsDetails");
const variation_attributes = require("./routes/VariationAttributes");

const port = process.env.PORT || 3030;
const app = express();
const bodyParser = require("body-parser");
const { authenticate } = require("./middleware/authenticate.js");
app.use(bodyParser.json());
app.use(cors());
app.use(
    fileEasyUpload({
        app,
        fileUploadOptions: {
            limits: { fileSize: 50 * 1024 * 1024 },
        },
    })
);
//app.use(express.static(__dirname + "/public/"));
// app.use(cookieParser());
app.use("/api/static", express.static("public"));
app.use(file_upload);
//app.use(authenticate);
app.use("/api/ads", ads);
app.use("/api/attributes", attributes);
app.use("/api/categories", categories);
app.use("/api/cities", cities);
app.use("/api/countries", countries);
app.use("/api/sub-categories", sub_categories);
app.use("/api/order-details", order_details);
app.use("/api/orders", orders);
app.use("/api/product-images", product_images);
app.use("/api/product-attributes", product_attributes);
app.use("/api/product-variations", product_variations);
app.use("/api/products", products);
app.use("/api/success-partners", success_partners);
app.use("/api/users", users);
app.use("/api/vendor-payments-details", vendor_payments_details);
app.use("/api/variation-attributes", variation_attributes);

app.listen(port, () => console.log(`server is running on ,port is  ${port} `));
module.exports = app;
