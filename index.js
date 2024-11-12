const express = require("express")
const {testDatabaseConnection } = require("./DATABASE")
const userRoutes = require("./Routes/USER/index")
const authRoutes = require("./Routes/AUTH/index")
const categoryRoutes = require("./Routes/CATEGORY")
const productRoutes = require("./Routes/PRODUCT/index")

const app = express()

app.use(express.json())

testDatabaseConnection();



app.use("/api/v1/" , userRoutes)

app.use("/api/v1", authRoutes)

app.use("/api/v1",  categoryRoutes)

app.use("/api/v1", productRoutes)

app.listen(3000, console.log("App listening 3000"))
