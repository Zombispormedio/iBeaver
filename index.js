var express = require("express");
var config=require("./config/config.js");
var db=require("./config/db.js");
var app=express();
//Configuracion
require("./config/express.js")(app);


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname+"/public"));

var router=express.Router();
app.use(router);


//Conexion con la base de datos, devuelve el modelo de la coleccion
var User=db();


function sendAll(res){
    return function(err, users){
        if(err){
            res.send(500, err.message);
        }

        res.status(200).jsonp(users);
    };
}


//functiones rest
function getAllUsers(req, res){
    //Busca en la base de datos
    User.find(sendAll(res));
}

function addUser(req, res){
    User.create(

        {name:req.body.name,
         surname:req.body.surname,
         age:req.body.age,
         work:req.body.work},

        function(err, user){

            if(err) {
                res.send(err);
            }

            getAllUsers(req, res);
        }

    );

}



function updateUser(req, res){

    User.findById(req.params.id, function(err, user){

        user.name=req.body.name;
        user.surname=req.body.surname;
        user.age=req.body.age;
        user.work=req.body.work;
        user.save(function(err, user){
        if(err) return res.send(500, err.message);
            getAllUsers(req, res);
        });

    });

}


function deleteUser(req, res){
    User.findById(req.params.id,function(err, user){
        user.remove(function(err){
            if(err) return res.send(500, err.message);

            getAllUsers(req, res);
        });

    });
}


var users=express.Router();

users.route('/users')
    .get(getAllUsers)
    .post(addUser);

users.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

app.use('/api', users);


app.listen(app.get("port"), function(){
    console.log("Magia!!!");
});








