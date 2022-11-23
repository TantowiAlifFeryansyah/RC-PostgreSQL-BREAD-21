var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    db.query(`SELECT * FROM siswa`, (err, data) => {
      if (err) return console.log(`ini ${err}`);
      res.render('list', { data: data.rows, moment });
    })
  });

  router.get('/add', function (req, res, next) {
    res.render('add');
  });

  router.post('/add', function (req, res, next) {
    db.query(`INSERT INTO siswa (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)`, [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean], (err, data) => {
      if (err) return console.log(`ini ${err}`);
      res.redirect('/')
    })
  });

  router.get('/edit', function (req, res, next) {
    res.render('edit');
  });

  router.get('/delete/:id', function (req, res, next) {
    const index = req.params.id
    db.query(`delete FROM siswa WHERE id = $1`, [index], (err, rows) => {
      if (err) return console.log('gagal ambil data', err);
      res.redirect('/')
    })
  });

  return router;
}
