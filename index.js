const express = require("express");
const {testDatabaseConnection} = require("./DATABASE/index") 

const productRoutes = require("./Routes/Product/index");
const categoryRoutes = require("./Routes/Category")
const authRoutes = require("./Routes/Auth")
const commentRouter = require("./Routes/Comments")

const app = express();

app.use(express.json());


app.use("/api/v1/auth/v1",authRoutes)

app.use("/api/v1", productRoutes);

app.use("/api/v1", categoryRoutes)

app.use("/api/v1" , commentRouter)



testDatabaseConnection()


app.listen(3000, () => {
    console.log("App listening on port 8000");
});
