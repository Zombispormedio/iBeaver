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
var Book=db();


function sendAll(res){
    return function(err, books){
        if(err){
            res.send(500, err.message);
        }

        res.status(200).jsonp(books);
    };
}


//functiones rest
function getAllBooks(req, res){
    //Busca en la base de datos
    Book.find(sendAll(res));
}

function addBook(req, res){
    Book.create(

        {title:req.body.title,
         author:req.body.author,
         score:req.body.score,
         experience:req.body.experience},

        function(err, book){

            if(err) {
                res.send(err);
            }

            getAllBooks(req, res);
        }

    );

}



function updateBook(req, res){

    Book.findById(req.params.id, function(err, book){

        book.title=req.body.title;
        book.author=req.body.author;
        book.score=req.body.score;
        book.experience=req.body.experience;
        book.save(function(err, book){
        if(err) return res.send(500, err.message);
            getAllBooks(req, res);
        });

    });

}


function deleteBook(req, res){
    Book.findById(req.params.id,function(err, book){
        book.remove(function(err){
            if(err) return res.send(500, err.message);

            getAllBooks(req, res);
        });

    });
}


var books=express.Router();

books.route('/books')
    .get(getAllBooks)
    .post(addBook);

books.route('/books/:id')
    .put(updateBook)
    .delete(deleteBook);

app.use('/api', books);


app.listen(app.get("port"), function(){
    console.log("Magia!!!");
});








