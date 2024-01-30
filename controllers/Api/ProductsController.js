const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");

exports.selectProductsByFilter = async (req, res, next) => {
    var params = {
        limit: 10,
        page: 1,
        constrains: { name: "" },
        relations: [{ model: conn.order_details }],
    };
    const result = await filter.filter("products", params);
    if (result) {
        res.status(200).json({ status: true, data: result });
    } else {
        console.log(e);

        res.status(200).json({ status: false, msg: "No data founded" });
    }
};
exports.chartData = async (req, res, next) => {
    try {
        let regMonth = [];
        var tab = req.body.tab;
        let type = req.body.type;
        const sevenDaysAgo = new Date(
            new Date().setDate(new Date().getDate() - 7)
        );
        if (type == 1) {
            //day
            sequelize
                .query(
                    `select DATE_FORMAT(selected_date,"%Y-%m-%d") label,(SELECT COUNT(*) FROM ${tab} WHERE  date(${tab}.createdAt) =selected_date GROUP BY DATE_FORMAT(${tab}.createdAt,"%Y-%m-%d")) y from (select selected_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where selected_date between date(date_sub(now(),INTERVAL 1 month)) and CURRENT_DATE()) tmp;
      `
                )
                .then(function (response) {
                    res.status(200).json({ status: true, data: response[0] });
                })
                .error(function (err) {
                    // res.json(err);
                });
        }
        if (type == 2) {
            //month
            sequelize
                .query(
                    `select v label,(SELECT COUNT(*) FROM ${tab} WHERE  DATE_FORMAT(${tab}.createdAt,"%Y-%m") =v GROUP BY DATE_FORMAT(${tab}.createdAt,"%Y-%m")) y  from(select DISTINCT DATE_FORMAT(selected_date,"%Y-%m") v from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where DATE_FORMAT(selected_date,"%Y-%m") between DATE_FORMAT((date_sub(now(),interval 1 year)),"%Y-%m") and DATE_FORMAT(now(),"%Y-%m")) tmp2;
        `
                )
                .then(function (response) {
                    res.status(200).json({ status: true, data: response[0] });
                })
                .error(function (err) {
                    res.json(err);
                });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.search = async (req, res, next) => {
    var searchCol = req.body.col;
    var offset = (req.body.page - 1) * req.body.limit;
    var search = req.body.search;
    await conn.products
        .findAll({
            limit: req.body.limit,
            offset: offset,
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                        },
                    ],
                },
            ],
            where: {
                [searchCol]: {
                    [Op.like]: "%" + search + "%",
                },
            },
        })
        .then(async function (assets) {
            var count = conn.products.findAll({
                where: {
                    [searchCol]: {
                        [Op.like]: "%" + search + "%",
                    },
                },
            });
            res.status(200).json({
                status: true,
                data: assets,
                tot: count.length,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};
exports.searchByCategoryId = async (req, res, next) => {
    var searchCol = req.body.col;
    var offset = (req.body.page - 1) * req.body.limit;
    var search = req.body.search;
    await conn.products
        .findAll({
            limit: req.body.limit,
            offset: offset,
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                        },
                    ],
                },
            ],
            where: {
                [Op.and]: [
                    {
                        [searchCol]: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        sub_category_id: req.body.sub_category_id,
                    },
                ],
            },
        })
        .then(async function (assets) {
            var count = conn.products.findAll({
                where: {
                    [Op.and]: [
                        {
                            [searchCol]: {
                                [Op.like]: "%" + search + "%",
                            },
                        },
                        {
                            sub_category_id: req.body.sub_category_id,
                        },
                    ],
                },
            });
            res.status(200).json({
                status: true,
                data: assets,
                tot: count.length,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};
exports.searchByVendorId = async (req, res, next) => {
    var searchCol = req.body.col;
    var offset = (req.body.page - 1) * req.body.limit;
    var search = req.body.search;
    await conn.products
        .findAll({
            limit: req.body.limit,
            offset: offset,
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                        },
                    ],
                },
            ],
            where: {
                [Op.and]: [
                    {
                        [searchCol]: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        vendor_id: req.body.vendor_id,
                    },
                ],
            },
        })
        .then(async function (assets) {
            var count = conn.products.findAll({
                where: {
                    [Op.and]: [
                        {
                            [searchCol]: {
                                [Op.like]: "%" + search + "%",
                            },
                        },
                        {
                            vendor_id: req.body.vendor_id,
                        },
                    ],
                },
            });
            res.status(200).json({
                status: true,
                data: assets,
                tot: count.length,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};
//@decs   Get All
//@route  GET
//@access Public
exports.getProducts = async (req, res, next) => {
    try {
        const result = await conn.products.findAll({
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                        },
                    ],
                },
            ],
        });
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false });
    }
};
exports.createProducts = async (req, res, next) => {
    let transaction;
    let product_data = req.body.product_data;
    let images_data = req.body.images_data;
    let variation_data = req.body.variation_data;
    let variation_attributes_data = req.body.variation_attributes_data;
    try {
        transaction = await sequelize.transaction();
        console.log(req.body);
        const product = await conn.products.create(product_data, {
            transaction,
        });

        for (let i = 0; i < images_data.length; i++) {
            images_data[i] = { ...images_data[i], product_id: product.id };
        }
        const images = await conn.product_images.bulkCreate(images_data, {
            transaction,
        });
        if (product_data.type == "basic") {
            for (let i = 0; i < variation_attributes_data.length; i++) {
                variation_attributes_data[i] = {
                    ...variation_attributes_data[i],
                    product_id: product.id,
                };
            }
            const product_attributes = await conn.product_attributes.bulkCreate(
                variation_attributes_data,
                { transaction }
            );
        } else {
            for (let i = 0; i < variation_data.length; i++) {
                variation_data[i] = {
                    ...variation_data[i],
                    product_id: product.id,
                };
                const variations = await conn.product_variations.create(
                    variation_data[i],
                    { transaction }
                );
                for (
                    let j = 0;
                    j < variation_data[i].variation_attributes.length;
                    j++
                ) {
                    variation_data[i].variation_attributes[j] = {
                        ...variation_data[i].variation_attributes[j],
                        variation_id: variations.id,
                    };
                    const variation_attributes =
                        await conn.variation_attributes.create(
                            variation_data[i].variation_attributes[j],
                            { transaction }
                        );
                }
            }
        }

        console.log({ images_data, variation_data });

        await transaction.commit();

        res.status(200).json({
            status: true,
            data: { product, images },
        });
    } catch (e) {
        console.log(e);
        if (transaction) await transaction.rollback();

        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

exports.paginate = async (req, res, next) => {
    try {
        var offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        var result = await conn.products.findAll({
            order: [["id", "DESC"]],
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                        },
                    ],
                },
            ],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
        });
        var count = await conn.products.findAll();
        res.status(200).json({ status: true, data: result, tot: count.length });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

exports.paginateByCategoryId = async (req, res, next) => {
    try {
        console.log({ cat_id: req?.body?.sub_category_id });
        const offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        const result = await conn.products.findAll({
            order: [["id", "DESC"]],
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                            where: {
                                city_id: req.body.city_id,
                            },
                        },
                    ],
                },
            ],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
            where: {
                sub_category_id: req.body.sub_category_id,
            },
        });
        const count = await conn.products.findAll({
            where: {
                sub_category_id: req.body?.sub_category_id,
            },
        });
        const sub_category = await conn.sub_categories.findOne({
            where: {
                id: req.body?.sub_category_id,
            },
            attributes: ["name"],
        });
        res.status(200).json({
            status: true,
            data: result,
            tot: count.length,
            sub_category_name: sub_category?.name,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};
exports.paginateByVendorId = async (req, res, next) => {
    try {
        console.log({ cat_id: req?.body?.sub_category_id });
        const offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        const result = await conn.products.findAll({
            order: [["id", "DESC"]],
            include: [
                {
                    model: conn.sub_categories,
                    as: "sub_category",
                },
                {
                    model: conn.users,
                    as: "vendor",
                    include: [
                        {
                            model: conn.store_details,
                            as: "store_details",
                            where: {
                                city_id: req.body.city_id,
                            },
                        },
                    ],
                },
            ],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
            where: {
                vendor_id: req.body.vendor_id,
            },
        });
        const count = await conn.products.findAll({
            where: {
                vendor_id: req.body?.vendor_id,
            },
        });

        res.status(200).json({
            status: true,
            data: result,
            tot: count.length,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};
//@decs   Get All
//@route  GET
//@access Public
exports.getProductsById = async (req, res, next) => {
    try {
        const result = await conn.products.findOne({
            where: { id: req.params.id },
        });
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);

        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

//@decs   Get All
//@route  Put
//@access Public
exports.updateProducts = async (req, res, next) => {
    console.log({ body: JSON.stringify(req.body) });
    try {
        const product = await conn.products.findOne({
            where: {
                id: req.params.id,
            },
        });
        console.log({
            old: product.image,
            new: req.body.image,
        });
        if (req.body.image) {
            if (product?.image) {
                fs.unlink(product.image, (err) => {
                    if (err) console.log(err);
                    else {
                        console.log("\nDeleted file successfuly");

                        // Get the files in current directory
                        // after deletion
                    }
                });
            }
        }
        await conn.products.update(req.body, {
            where: { id: req.params.id },
        });
        res.status(200).json({ status: true, data: req.body });
    } catch (e) {
        console.log(e);

        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteProducts = async (req, res, next) => {
    try {
        const product = await conn.products.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (product?.image)
            fs.unlink(product.image, (err) => {
                if (err) console.log(err);
                else {
                    console.log("\nDeleted file successfuly");

                    // Get the files in current directory
                    // after deletion
                }
            });
        await conn.products.destroy({ where: { id: req.params.id } });
        res.status(200).json({
            status: true,
            msg: `data deleted successfully`,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: "حدث خطأ ماأثناء مسح الصورة",
        });
    }
};
