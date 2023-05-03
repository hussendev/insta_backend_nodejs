const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    //! this can be the name of user or the insta usernaem 
    username: {
      type: String,
      required: true,
      //TODO: validate username 
      // that's convert the capital chars to small
      // lowercase : true ,
      // maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      //TODO: validate the password 
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);