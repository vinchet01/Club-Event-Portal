const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose').default;

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
//here in user Schema the username and password is not there because the passport.js 
// will automatically put the username and password inside the user schema
UserSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model('User',UserSchema);
