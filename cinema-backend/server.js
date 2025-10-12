const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db.js")

dotenv.config();

//connecter la DB
connectDB();

const app=express()

//Middlewares
app.use(express.json());
app.use(cors());

//Route test
app.get("/",(req,res)=>{
    res.send("Bienvenue dans le backend du système de cinéma 🎬");
});

//lancer le serveur
const PORT=process.env.PORT ||5000;
app.listen(PORT,()=>console.log(`serveur lancé sur le port ${PORT}`));