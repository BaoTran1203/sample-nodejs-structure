//lets require/import the mongodb native drivers.
import mongoose from 'mongoose';

const url: string = 'mongodb://127.0.0.1:27017/product';
const option: object = { useNewUrlParser: true };

// Set plugin
mongoose.plugin(require('mongoose-timestamp-date-unix'));
mongoose.plugin(require('mongoose-beautiful-unique-validation'));

//Lets connect to our database using the DB server URL.
mongoose.connect(url, option, (err) => {
    if (err) throw err;
});

export default mongoose;