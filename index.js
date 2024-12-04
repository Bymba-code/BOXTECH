const express = require("express");
const {testDatabaseConnection} = require("./DATABASE/index") 
const cors = require("cors")
const path = require("path")

const productRoutes = require("./Routes/Product/index");
const categoryRoutes = require("./Routes/Category")
const authRoutes = require("./Routes/Auth")
const commentRouter = require("./Routes/Comments")
const qpayRoutes = require("./Routes/QPAY")
const subController = require("./Routes/Subscription");
const checkController = require("./Routes/Checkout")
const cookieParser = require("cookie-parser");
const adminRoutes = require("./Routes/Admin")

const app = express();



app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser())

app.use("/api/v1/auth/v1",authRoutes)

app.use("/api/v1", productRoutes);

app.use("/api/v1", categoryRoutes)

app.use("/api/v1" , commentRouter)

app.use("/api/v1", qpayRoutes)

app.use("/api/v1", subController)

app.use("/api/v1" , checkController)
app.use("/api/v1", adminRoutes)


testDatabaseConnection()


app.listen(8000, () => {
    console.log("App listening on port 8000");
});
