const express = require("express")
const cors = require("cors")
const {testDatabaseConnection } = require("./DATABASE")
const userRoutes = require("./Routes/USER/index")
const authRoutes = require("./Routes/AUTH/index")
const categoryRoutes = require("./Routes/CATEGORY")
const productRoutes = require("./Routes/PRODUCT/index")
const path = require("path");


const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
};



const app = express()

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json())
app.use(cors(corsOptions));


testDatabaseConnection();



app.use("/api/v1/" , userRoutes)

app.use("/api/v1", authRoutes)

app.use("/api/v1",  categoryRoutes)

app.use("/api/v1", productRoutes)

app.listen(3000, console.log("App listening 3000"))
