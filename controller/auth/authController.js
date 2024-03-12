const db = require("../../config/MySQL_DB_Config");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        code: -1,
        message: "Please provide email and password",
      });
    }
    const query = "select * from auth where email = ?";
    const conn = await db.getConnection()
    await conn
      .query(query, [email])
      .then((result) => {
        conn.release();
        result = result[0];
        if (!result.length > 0)
          return res
            .status(404)
            .json({ code: -1, message: "Invalid email. User not found" });
        if (password == result[0].password) {
          const payload = {
            uid: result[0].uid,
            name: result[0].name,
            role: result[0].role,
          };
          const token = jwt.sign(payload, SECRET_KEY, {
            algorithm: "HS512",
            expiresIn: "7d",
          });
          return res.status(200).json({
            code: 1,
            message: "Login successful",
            token: token,
            data: payload,
          });
        } else
          return res.status(401).json({ code: 0, message: "Invalid password" });
      })
      .catch((err) => {
        conn.release();
        return res.json({
          code: -1,
          message: "Failed to login. Please try again.",
        });
      });
  } catch (err) {
    console.log("Failed to login: " + err.message);
    return res.json({
      code: -1,
      message: "Failed to login. Please try again.",
    });
  }
}

async function userRegister(req, res) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const primary_address = req.body.primary_address;
    const primary_mobile_number = req.body.primary_mobile_number;

    if (
      !name ||
      !email ||
      !password ||
      !primary_address ||
      !primary_mobile_number
    )
      return res.json({ code: -1, message: "Invalid data" });
    
    let query =
      "insert into users (name,email,primary_address,primary_mobile_number) values (?,?,?,?)";
    
    const conn = await db.getConnection()

    await conn
      .query(
        query,
        [name, email, primary_address, primary_mobile_number]
      )
      .then(async (result) => {
        conn.release();
        if (result[0].affectedRows > 0) {
          query = "update auth set password=? where email=?"
          const conn = await db.getConnection()
          await conn.query(query, [password, email])
          conn.release();
          return res.json({
            code: 1,
            message: "Registration successful",
          });
        }
        else
          return res.json({
            code: -1,
            message: "Failed to register. Please try again.",
          });
      })
      .catch((err) => {
        conn.release();
        return res.json({
          code: -1,
          message: "Failed to register. Please try again.",
        });
      });
  } catch (err) {
    const err_message = err.message;
    if (err_message.includes("for key 'users.email'"))
      return res.json({ code: -1, message: "Email already exists" });

    console.log("Failed to register: " + err.message);
    return res.json({
      code: -1,
      message: "Failed to register. Please try again.",
    });
  }
}

module.exports = {
  userLogin,
  userRegister,
};
