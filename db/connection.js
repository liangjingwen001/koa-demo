const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://liangjingwen:ljw12345@cluster0.tpcqs.mongodb.net/<dbname>?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {
    console.log('db ok')
})
.catch(err => {
    console.log(err)
})