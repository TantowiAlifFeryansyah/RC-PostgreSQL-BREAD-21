var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {
    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit
    db.query(`SELECT COUNT(*) AS total FROM siswa`, (err,data) => {
      if (err) return console.log(`ini ${err}`);
      const total = data.rows[0].total
      const totalpages = Math.ceil(total / limit)
      db.query(`SELECT * FROM siswa LIMIT $1 OFFSET $2`,[limit, offset], (err, data) => {
        if (err) return console.log(`ini ${err}`);
        res.render('list', { data: data.rows, moment, page, totalpages, offset });
      })
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

  router.get('/delete/:id', function (req, res, next) {
    const index = req.params.id
    db.query(`delete FROM siswa WHERE id = $1`, [index], (err, rows) => {
      if (err) return console.log('gagal ambil data', err);
      res.redirect('/')
    })
  });

  router.get('/edit/:id', function (req, res, next) {
    const index = req.params.id
    db.query(`SELECT * FROM siswa WHERE id = $1`, [index], (err, data) => {
      if (err) return console.log('gagal ambil data', err);
      res.render('edit', { data: data.rows, moment });
    })
  });

  router.post('/edit/:id', function (req, res, next) {
    const index = req.params.id
    db.query(`UPDATE siswa SET string = $1, integer = $2, float = $3, date = $4, boolean = $5 WHERE id = $6`, [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean,index], (err, data) => {
      if (err) return console.log('gagal ambil data', err);
      res.redirect('/');
    })
  });


  return router;
}
