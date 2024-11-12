const express = require("express")
const cors = require("cors")
const {testDatabaseConnection } = require("./DATABASE")
const userRoutes = require("./Routes/USER/index")
const authRoutes = require("./Routes/AUTH/index")
const categoryRoutes = require("./Routes/CATEGORY")
const productRoutes = require("./Routes/PRODUCT/index")

const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credential: true,
}



const app = express()

app.use(express.json())
app.use(cors(corsOptions));


testDatabaseConnection();



app.use("/api/v1/" , userRoutes)

app.use("/api/v1", authRoutes)

app.use("/api/v1",  categoryRoutes)

app.use("/api/v1", productRoutes)

app.listen(5000, console.log("App listening 5000"))
