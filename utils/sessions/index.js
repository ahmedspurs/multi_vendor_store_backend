var geoip = require('geoip-lite');
const jwt = require('jsonwebtoken');
const { conn, sequelize } = require('../../db/conn')
const WhichBrowser = require('which-browser')


function checkBrowser(info, user_id) {
    return new Promise(async resolve => {
        console.log("info **** ", info);
        var browser = await conn.browsers.findOne({
            where: {
                device: info.device,
                name: info.browser_name,
                os_name: info.os_name,
                os_version: info.os_version,
                version: info.browser_version,
                user_id
            }
        })
        if (!browser)
            browser = await conn.browsers.create({
                device: info.device,
                name: info.browser_name,
                os_name: info.os_name,
                os_version: info.os_version,
                version: info.browser_version,
                user_id
            })
        resolve(browser.id)})}

module.exports = function start_session(user_id, req) {
    return new Promise(async (resolve) => {
        var token = jwt.sign({
            _id: { user_id },
            access: "auth"
        }, 'atcsmart').toString();

        const result = new WhichBrowser(req.headers);
        console.log(result, "******");
        var info = {}
        info.os_name = result.os.name.toString()
        info.os_version = result.os ? result.os.version.toString() : ""
        info.browser_name = result.browser.name.toString()
        info.browser_version = result.browser.version.toString()
        console.log("77767");
        if (result.isMobile())
            info.device = result.device.toString()
        else
            info.device = "Desktop"
        var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        console.log("ip *****");
        var geo = geoip.lookup(ip);
        console.log("geo *****");
        var browser_id = await checkBrowser(info, user_id)
        console.log("browser_id", browser_id)
        conn.sessions.create({
            user_id,
            browser_id,
            token
        })
        resolve(token)
    })
}
