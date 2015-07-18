var config = (function () {
    var private = {

        port: 5000,
        db: "mongodb://teachit:wantedhex@ds059722.mongolab.com:59722/zombispormediodb",
        host: "localhost",
        model: {
            name: String,
            surname:String,
            age: Number,
            work: String
        }
    };
    return {
        get: function (name) {
            return private[name];
        }
    };
})();

module.exports = config;
