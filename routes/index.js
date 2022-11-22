var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
module.exports = function(db){
router.get('/', function(req, res, next) {
  db.query(`SELECT * FROM siswa`,(err, data)=>{
    if(err) return console.log(`ini ${err}`);
  res.render('list',{data: data.rows, moment});
})
});

return router;
}
