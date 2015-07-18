var config = (function () {
    var private = {

        port: 5000,
        db: "mongodb://teachit:wantedhex@ds059722.mongolab.com:59722/zombispormediodb",
        host: "localhost",
        model: {
            title: String,
            author:String,
            score: Number,
            experience: String,
            comic: Boolean,
            artist:String
        }
    };
    return {
        get: function (name) {
            return private[name];
        }
    };
})();

module.exports = config;
