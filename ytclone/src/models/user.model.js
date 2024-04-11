import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'


const userSchema=mongoose.Schema({
        id:{
           type:String,
           required:true,
           unique:true
        },
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,  // cloudinary
            required:true
        },
        coverImage:{
            type:String   //cloudinary
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String,
        }





},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        return next()
    }
    this.password =bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async 


const User=mongoose.model("User",userSchema)