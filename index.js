require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require('path');
const {testDatabaseConnection } = require("./Database/test")

const authRoutes = require("./Routes/1. Auth")
const categoryRoutes = require("./Routes/2. Category")
const productRoutes = require("./Routes/3. Product")
const userRoutes = require("./Routes/4. User")
const expandRoutes = require("./Routes/5. Expand")
const checkoutRoutes = require("./Routes/6. Product Checkout")
const favouriteRoutes = require("./Routes/7. Favourite")
const gatewayController = require("./Routes/8. GATEWAY")
const qpayController = require("./Routes/9. QPAY/")
const commentController = require("./Routes/10. Product_comment")
const newsController = require("./Routes/11. News")
const profileController = require("./Routes/12. Profile")
const notificationController = require("./Routes/14. Notifications")
const usersRoutes = require("./Routes/16. Users")
const nmzRoutes = require("./Routes/20. Nmz")



const app = express()

app.use(express.json())
  
const corsOptions = {
    origin: ["http://localhost:5173", "https://omn1club.com", "https://boxtech.mn"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
};

app.use(express.json({ limit: '50gb' }))
app.use(express.urlencoded({ limit: '50gb', extended: true })); 

app.use(cors(corsOptions));

testDatabaseConnection()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(process.env.URL, authRoutes)
app.use(process.env.URL, categoryRoutes)
app.use(process.env.URL, productRoutes)
app.use(process.env.URL, userRoutes)
app.use(process.env.URL, expandRoutes)
app.use(process.env.URL, checkoutRoutes)
app.use(process.env.URL, favouriteRoutes)
app.use(process.env.URL, gatewayController)
app.use(process.env.URL, qpayController)
app.use(process.env.URL, commentController)
app.use(process.env.URL, newsController)
app.use(process.env.URL, profileController)
app.use(process.env.URL, notificationController)
app.use(process.env.URL, usersRoutes)
app.use(process.env.URL, nmzRoutes)







app.listen(process.env.PORT, () => {
    console.log("App listening" + " " +  process.env.PORT)
})
