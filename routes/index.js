var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res, next) {

    const params = []
    let count = 1
    const values = []

    if (req.query.id && req.query.idcheck) {
      params.push(`id = $${count++}`)
      values.push(req.query.id)
    }

    if (req.query.string && req.query.stringcheck) {
      params.push(`string ilike '%' || $${count++} || '%'`)
      values.push(req.query.string)
    }

    if (req.query.integer && req.query.integercheck) {
      params.push(`integer = $${count++}`)
      values.push(req.query.integer)
    }

    if (req.query.float && req.query.floatcheck) {
      params.push(`float = $${count++}`)
      values.push(req.query.float)
    }

    if (req.query.datecheck) {
      if (req.query.startdate != '' && req.query.enddate != '') {
          params.push(`date BETWEEN $${count++} AND $${count++}`)
          values.push(req.query.startdate)
          values.push(req.query.enddate)
      }
      else if (req.query.startdate != '') {
          params.push(`date >= $${count++}`)
          values.push(req.query.startdate)
      }
      else if (req.query.enddate != '') {
          params.push(`date <= $${count++}`)
          values.push(req.query.enddate)
      }
  }

    if (req.query.boolean && req.query.booleancheck) {
      params.push(`boolean = $${count++}`)
      values.push(req.query.booelan)
    }

    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit

    let sql = `SELECT COUNT(*) AS total FROM siswa `
    if (params.length > 0)
      sql += `WHERE ${params.join(' AND ')}`

    db.query(sql, values, (err, data) => {
      if (err) return console.log(`ini ${err}`);
      const total = data.rows[0].total
      const totalpages = Math.ceil(total / limit)

      sql = `SELECT * FROM siswa`
      if (params.length > 0)
        sql += ` WHERE ${params.join(' AND ')}`

      sql += ` LIMIT $${count++} OFFSET $${count++} `
        db.query(sql, [...values, limit, offset], (err, data) => {
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
    db.query(`UPDATE siswa SET string = $1, integer = $2, float = $3, date = $4, boolean = $5 WHERE id = $6`, [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean, index], (err, data) => {
      if (err) return console.log('gagal ambil data', err);
      res.redirect('/');
    })
  });


  return router;
}
