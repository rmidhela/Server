const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();

app.use(cors());
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://rmidhela:TkWypdnN1hWjKKP4@cluster0.ispb2yc.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));
app.use(express.json());
//app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// Routes
app.use('/api', userRoutes);
app.use('/api/expenses', expenseRoutes); // Use expense routes
app.use('/api/budget', budgetRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
