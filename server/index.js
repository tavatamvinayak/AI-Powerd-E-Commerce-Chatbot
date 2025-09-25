const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors({
            origin:"*"
  //           origin: ['http://localhost:3000'],
  // methods: ['GET,POST','PUT','DELETE']
        }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/',(req,res)=>{
      res.redirect("https://ai-powerd-e-commerce-chatbot-g8gy.vercel.app/")
})
app.get('/',(req,res)=>{
      res.json({"message":"server is running"})
})


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
