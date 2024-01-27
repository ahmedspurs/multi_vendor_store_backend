const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

exports.selectOrdersByFilter = async (req, res, next) => {
    var params = {
        limit: 10,
        page: 1,
        constrains: { name: "" },
        relations: [{ model: conn.order_details }],
    };
    const result = await filter.filter("orders", params);
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
    if (!search) res.status(200).json({ status: true, data: [], tot: 0 });
    await conn.orders
        .findAll({
            limit: req.body.limit,
            offset: offset,
            include: [
                {
                    model: conn.order_details,
                    as: "order_details",
                    include: [
                        {
                            model: conn.products,
                            as: "product",
                        },
                    ],
                },
                {
                    model: conn.users,
                    as: "user",
                    where: {
                        [searchCol]: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                },
            ],
        })
        .then(async function (assets) {
            var count = conn.orders.findAll({
                include: [
                    {
                        model: conn.order_details,
                        as: "order_details",
                        include: [
                            {
                                model: conn.products,
                                as: "product",
                            },
                        ],
                    },
                    {
                        model: conn.users,
                        as: "user",
                        where: {
                            [searchCol]: {
                                [Op.like]: "%" + search + "%",
                            },
                        },
                    },
                ],
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
exports.getOrders = async (req, res, next) => {
    try {
        const result = await conn.orders.findAll();
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};
exports.createOrders = async (req, res, next) => {
    console.log({ items: JSON.stringify(req?.body?.items) });
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const result = await conn.orders.create(
            {
                user_id: req.body?.user_id,
                status: "new",
                note: req?.body?.note,
            },
            { transaction }
        );
        for (const item of req?.body?.items) {
            console.log({ qty: item?.qty });
            const data = {
                order_id: result?.id,
                qty: item?.qty,
            };
            data.product_id = item?.product?.id;
            console.log({ data: JSON.stringify(data) });
            await conn.order_details.create(data, { transaction });
        }
        await transaction.commit();
        res.status(200).json({ status: true, data: result });
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
        var result = await conn.orders.findAll({
            order: [["id", "DESC"]],
            include: [
                {
                    model: conn.order_details,
                    as: "order_details",
                    include: [
                        {
                            model: conn.products,
                            as: "product",
                        },
                    ],
                },
                "user",
            ],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
        });
        var count = await conn.orders.findAll();
        res.status(200).json({ status: true, data: result, tot: count.length });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};
exports.userOrdersPaginate = async (req, res, next) => {
    try {
        const offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        const result = await conn.orders.findAll({
            where: {
                user_id: req.body?.user_id,
            },
            order: [["id", "DESC"]],
            include: [
                {
                    model: conn.order_details,
                    as: "order_details",
                    include: [
                        {
                            model: conn.products,
                            as: "product",
                        },
                    ],
                },
            ],
            offset: offset,
            limit: req.body.limit,
            subQuery: true,
        });
        const count = await conn.orders.findAll();
        res.status(200).json({ status: true, data: result, tot: count.length });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getOrdersById = async (req, res, next) => {
    try {
        const result = await conn.orders.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: conn.order_details,
                    as: "order_details",
                    include: [
                        {
                            model: conn.products,
                            as: "product",
                        },
                    ],
                },
                "user",
            ],
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
exports.updateOrders = async (req, res, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        await conn.orders.update(req.body, { where: { id: req.params.id } });

        await transaction.commit();
        res.status(200).json({ status: true, data: req.body });
    } catch (e) {
        console.log(e);
        if (transaction) await transaction.rollback();
        res.status(200).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteOrders = async (req, res, next) => {
    try {
        await conn.orders.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            status: true,
            msg: `data deleted successfully`,
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            status: false,
            msg: `حدث خطأ ما في السيرفر`,
        });
    }
};
