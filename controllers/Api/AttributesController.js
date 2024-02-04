const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");
exports.selectAttributesByFilter = async (req, res, next) => {
    var params = { limit: 10, page: 1, constrains: { name: "" } };
    const result = await filter.filter("attributes", params);
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
    await conn.attributes
        .findAll({
            limit: req.body.limit,
            offset: offset,
            include: [],
            where: {
                [searchCol]: {
                    [Op.like]: "%" + search + "%",
                },
            },
        })
        .then(async function (assets) {
            var count = conn.attributes.findAll();
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
exports.getAttributes = async (req, res, next) => {
    try {
        const result = await conn.attributes.findAll();
        res.status(200).json({ status: true, data: result });
        // res.status(500).json({
        //   status: false,
        //   msg: `حدث خطأ ما في السيرفر`,
        // });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};
exports.createAttributes = async (req, res, next) => {
    try {
        const result = await conn.attributes.create(req.body);
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};

exports.paginate = async (req, res, next) => {
    try {
        const offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        const result = await conn.attributes.findAll({
            order: [["id", "DESC"]],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
        });
        const count = await conn.attributes.findAll();
        res.status(200).json({ status: true, data: result, tot: count.length });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};

exports.paginateByVendor = async (req, res, next) => {
    try {
        const offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        const result = await conn.attributes.findAll({
            order: [["id", "DESC"]],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
            where: {
                vendor_id: req.body.vendor_id,
            },
        });
        const count = await conn.attributes.findAll();
        res.status(200).json({ status: true, data: result, tot: count.length });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};
//@decs   Get All
//@route  GET
//@access Public
exports.getAttributesById = async (req, res, next) => {
    try {
        const result = await conn.attributes.findOne({
            where: { id: req.params.id },
        });
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};

//@decs   Get All
//@route  Put
//@access Public
exports.updateAttributes = async (req, res, next) => {
    try {
        const category = await conn.attributes.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (req.body.image) {
            if (category?.image) {
                fs.unlink(category.image, (err) => {
                    if (err) console.log(err);
                    else {
                        console.log("\nDeleted file successfuly");

                        // Get the files in current directory
                        // after deletion
                    }
                });
            }
        }
        await conn.attributes.update(req.body, {
            where: { id: req.params.id },
        });
        res.status(200).json({ status: true, data: req.body });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteAttributes = async (req, res, next) => {
    try {
        const category = await conn.attributes.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (category?.image) {
            fs.unlink(category.image, (err) => {
                if (err) console.log(err);
                else {
                    console.log("\nDeleted file successfuly");

                    // Get the files in current directory
                    // after deletion
                }
            });
        }

        await conn.attributes.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            status: true,
            msg: `data deleted successfully`,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};
