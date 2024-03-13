const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

dotenv.config();

// Create Express app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const verifyToken = require("./middleware/verifyUserToken");

const authRouter = require("./router/auth");

const userCartRouter = require("./router/user/cartRouter");

const userOrderRouter = require("./router/user/orderRouter");

app.use("/api/auth", authRouter);

app.use("/api/user/cart", verifyToken, userCartRouter);

app.use("/api/user/order", verifyToken, userOrderRouter);

// Admin router
const adminBannerRouter = require("./router/admin/bannersRouter");
app.use("/api/admin/banner", verifyToken, adminBannerRouter);

const adminItemRouter = require('./router/admin/itemRouter')
app.use('/api/admin/item', verifyToken, adminItemRouter)

// app.get('/verify', verifyToken ,(req , res) => {
//     console.log(req)
//     return res.json({code:1 , message: 'Token Verified' , extra:req})
// })


const testWhatsapp = require("./controller/whatsapp/test");
app.post('/test/whatsapp' , testWhatsapp)

app.post('/test/mobile', (req , res) => {
  const { text, li } = req.body
  console.log(text , li)
  res.json({code:17 , message: 'Hello Praneeth' , list:[1 , 2 , 3 , 4]})
})
