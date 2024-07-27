const mongoose = require("mongoose");
const bcrpt = require("bcrypt")
const userSchema = new mongoose.Schema({
    name: String,
    imageUrl:String,
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    email: {
        type: String,
        required: ["Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: ["Password is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.methods.verifyPassword =  (password, hashedPassword) =>{
    return bcrpt.compare(password,hashedPassword);
}

userSchema.pre('save',async function(next){
    if(this.isModified("password")){
        const hashedPassword = await bcrpt.hash(this.password,12);
        this.password = hashedPassword;
        next();
    }else{
        next();
    }
})
const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;