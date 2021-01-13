require('dotenv').config();
import mongoose from 'mongoose';

const {
  MONGO_HOSTNAME,
  MONGO_PORT,
} = process.env;

export const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/fts?authSource=admin`;

export default callback => {
  
  const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
  };
  
  
  let db = mongoose.connect(url, options).then( function() {
              console.log('MongoDB is connected');
            })
              .catch( function(err) {
              console.log(err);
            });
            
  callback(db);
}
