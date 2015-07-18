

var mongoose=require("mongoose");
var config=require("./config.js");

module.exports=function(){

    //Conexion con la base de datos
    var mongodb=mongoose.connect(config.get("db")).connection;

    mongodb.on("error", function(err){
        console.log("Ha ocurrido este error durante la conexion con mongodb: "+err.message);});

    mongodb.once('open', function(){
        console.log("Abierta conexion con MongoDB");});

    var model=mongoose.model("Book", new mongoose.Schema(config.get("model")));

    return model;

};
