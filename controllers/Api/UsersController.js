const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: `${__dirname}/../../.env` });
const SECRET = process.env.SECRET;
const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
    let transaction;
    try {
        console.log(req.body);
        transaction = await sequelize.transaction();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req?.body?.password, salt);
        req.body.password = hash;
        // create user
        const result = await conn.users.create(req?.body, { transaction });

        delete result.password;

        const token = jwt.sign(
            {
                user: {
                    id: result?.id,
                    name: result?.name,
                },
            },
            SECRET
        );

        await transaction.commit();
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error);
        if (transaction) await transaction.rollback();
        res.status(500).json({ status: false, msg: "حدث خطأ ما" });
    }
};

exports.createVendor = async (req, res, next) => {
    let transaction;
    let user_data = req.body.user_data;
    let store_data = req.body.store_data;
    try {
        console.log(req.body);
        transaction = await sequelize.transaction();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req?.body?.password, salt);
        req.body.password = hash;
        // create user
        const user = await conn.users.create(user_data, { transaction });
        store_data = {
            ...store_data,
            user_id: user.id,
        };
        const store = await conn.store_details.create(store_data, {
            transaction,
        });

        delete user.password;

        const token = jwt.sign(
            {
                user: {
                    id: user?.id,
                    name: user?.name,
                },
                store: {
                    id: store.id,
                    name: store.ame,
                    image: store.image,
                },
            },
            SECRET
        );

        await transaction.commit();
        res.status(200).json({ status: true, data: { user, store } });
    } catch (error) {
        console.log(error);
        if (transaction) await transaction.rollback();
        res.status(500).json({ status: false, msg: "حدث خطأ ما" });
    }
};

exports.login = async (req, res) => {
    console.log({
        email: req?.body?.email,
        password: req?.body?.password,
    });
    if (!req?.body?.email || !req?.body?.password)
        return res.status(500).json({
            status: false,
            msg: `الرجاء إدخال إسم المستخدم و كلمة السر`,
        });
    try {
        const existingUser = await conn.users.findOne({
            where: { email: req.body.email },
        });
        if (!existingUser)
            return res.json({ status: false, msg: "بيانات الدخول غير صحيحة" });
        const matchedPass = await bcrypt.compare(
            req?.body?.password,
            existingUser?.password
        );
        if (!matchedPass)
            return res.json({ status: false, msg: "بيانات الدخول غير صحيحة" });
        const found_user = await conn.users.findOne({
            where: {
                id: existingUser?.id,
            },
        });

        const token = jwt.sign(
            {
                user: {
                    id: existingUser?.id,
                    name: existingUser?.name,
                },
            },
            SECRET
        );

        res.status(200).json({
            status: true,
            data: {
                token,
                user: {
                    id: found_user?.id,
                    name: found_user?.name,
                },
            },
        });
    } catch (error) {
        console.log({ error });
        res.status(500).json({
            status: false,
            msg: "حدث خطأ ما أثناء تسجيل الدخول",
        });
    }
};

exports.selectUsersByFilter = async (req, res, next) => {
    var params = { limit: 10, page: 1, constrains: { name: "" } };
    const result = await filter.filter("users", params);
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
    await conn.users
        .findAll({
            limit: req.body.limit,
            offset: offset,
            include: [
                "user_phones",
                { model: conn.user_roles, as: "user_roles", include: ["role"] },
            ],
            where: {
                [searchCol]: {
                    [Op.like]: "%" + search + "%",
                },
            },
        })
        .then(async function (assets) {
            var count = conn.users.findAll();
            res.status(200).json({
                status: true,
                data: assets,
                tot: count.length,
                msg: "حدث خطأ ما في السيرفر",
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

//@decs   Get All
//@route  GET
//@access Public
exports.getUsers = async (req, res, next) => {
    try {
        const result = await conn.users.findAll();
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: "حدث خطأ ما في السيرفر",
        });
    }
};
exports.getVendors = async (req, res, next) => {
    try {
        const result = await conn.users.findAll({
            where: {
                user_type: "vendor",
            },
            include: [
                {
                    model: conn.products,
                    as: "products",
                    include: [
                        {
                            model: conn.sub_categories,
                            as: "sub_category",
                        },
                    ],
                },
            ],
        });
        res.status(200).json({ status: true, data: result });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: "حدث خطأ ما في السيرفر",
        });
    }
};

exports.vendorsPaginate = async (req, res, next) => {
    try {
        var offset = (req.body.page - 1) * req.body.limit;
        console.log("the offset", offset, "the limit is ", req.body.limit);
        var result = await conn.users.findAll({
            order: [["id", "DESC"]],

            where: {
                user_type: "vendor",
            },
            include: [
                {
                    model: conn.products,
                    as: "products",
                    include: [
                        {
                            model: conn.sub_categories,
                            as: "sub_category",
                        },
                    ],
                },
            ],

            offset: offset,
            limit: req.body.limit,
            subQuery: true,
        });
        var count = await conn.users.findAll({
            where: {
                user_type: "vendor",
            },
            include: [
                {
                    model: conn.products,
                    as: "products",
                    include: [
                        {
                            model: conn.sub_categories,
                            as: "sub_category",
                        },
                    ],
                },
            ],
        });
        res.status(200).json({ status: true, data: result, tot: count.length });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            msg: "حدث خطأ ما في السيرفر",
        });
    }
};
//@decs   Get All
//@route  GET
//@access Public
exports.getUsersById = async (req, res, next) => {
    try {
        const result = await conn.users.findOne({
            where: { id: req.params.id },
        });
        res.status(200).json({
            status: true,
            data: result,
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            status: false,
            msg: "حدث خطأ ما في السيرفر",
        });
    }
};

//@decs   Get All
//@route  Put
//@access Public

exports.updateUsers = async (req, res, next) => {
    let transaction;
    try {
        // update user
        transaction = await sequelize.transaction();

        const result = await conn.users.update(req?.body, {
            where: { id: req.params.id },
            transaction,
        });

        await transaction.commit();
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error);
        if (transaction) await transaction.rollback();
        res.status(500).json({ status: false, msg: "حدث خطأ ما" });
    }
};
exports.updatePass = async (req, res) => {
    try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                const updated_user = await conn.users.update(
                    { password: hash },
                    { where: { id: req.body.user_id } }
                );
                console.log({ updated_user });
                res.status(201).json({ status: true });
            });
        });
    } catch (error) {
        res.status(200).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
    }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteUsers = async (req, res, next) => {
    try {
        const user = await conn.users.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (user?.image)
            fs.unlink(user.image, (err) => {
                if (err) console.log(err);
                else {
                    console.log("\nDeleted file successfuly");

                    // Get the files in current directory
                    // after deletion
                }
            });
        await conn.users.destroy({
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
            msg: "حدث خطأ ما في السيرفر",
        });
    }
};
