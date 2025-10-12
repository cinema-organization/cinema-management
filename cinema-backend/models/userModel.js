const mongoose=require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nom: {
            type:String,
            required:[true,"le nom est obligatoire"],
            trim: true,
            minlength:[2,"le nom doit contenir au moin 2 caractères"]
        },
        email: {
            type:String, 
            required: [true,"L'email est obligatire"],
            unique:true,
            match:[/^\S+@\S+\.\S+$/,"Email invalide"],
        },
        password:{
            type:String,
            required:[true,"le mot de passe est obligatoire"],
            minlength:[6,"le mot de passe doit contenir au moins 6 caractères"],
        },
        role:{
            type:String,
            enum:["admin","user"],
            default:"user",
        },
    },
    {timestamps:true}
);

module.exports= mongoose.model("User",userSchema);