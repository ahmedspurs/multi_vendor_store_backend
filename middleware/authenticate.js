exports.authenticate = (req, res, next) => {
  if (req?.originalUrl == "/api/users/login" && req?.method == "POST") next();
  if (!req?.cookies?.hala_token)
    return res.status(401).json({ status: false, msg: "الرجاء تسجيل الدخول" });
  next();
};
