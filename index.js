const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const session = require('express-session')
const dotenv = require('dotenv')
const file = require('fs')
const app = express()

dotenv.config()
var db = {
	host: `${process.env.DB_HOST}`,
	database: `${process.env.DB_NAME}`,
	user: `${process.env.DB_USER}`,
	password: `${process.env.DB_PASSWORD}`
}
const conn = mysql.createConnection(db)

// konek ke database
conn.connect((err) => {
	if (err){
		console.log(err.message)
	}else{
		console.log('Mysql success Connect')		
	}
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(bodyParser.json())
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use('/assets', express.static(__dirname + '/public'))

var sessMessage = ''
var sessActive = false

var aksi = ''

app.listen(3000, function(){
	// list data product
	var total = ''
	app.get('/', (req, res) => {
		let sql = "SELECT * FROM PRODUCT ORDER BY product_id DESC";
		let query = conn.query(sql, (err, result) => {
			if (err){
				console.log(err.message)
			}
			sessMessage = req.session

			if (sessActive){
				if (aksi == "save") {					
					sessMessage.msg = "Berhasil menambahkan data"
				}else if(aksi == "update"){
					sessMessage.msg = "Berhasil mengupdate data"
				}else if(aksi == "delete"){
					sessMessage.msg = "Berhasil menghapus data"
				}else{
					sessMessage.msg = "Whoops, ada kesalahan"
				}
				console.log('1:' + sessActive)
			}

			res.render('product_view', {
				results: result,
				session: sessMessage,
				sessCheck: sessActive
			})
			sessActive = false
			aksi = ''
			console.log('2:' + sessActive)
			req.session.destroy()
		})
	})

	// insert data product
	app.post('/save', (req, res) => {
		let data = {
			product_name: req.body.product_name,
			product_price: req.body.product_price
		}
		let sql = "INSERT INTO product SET ?"
		let query = conn.query(sql, data, (err, result) => {
			if (err) {
				console.log(err.message)
			}
			sessActive = true
			aksi = "save"
			console.log("Berhasil menambahkan data")					
			res.redirect('/')
		})
	})

	// update data product
	app.post('/update', (req, res) => {
		let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id
		let query = conn.query(sql, (err, results) => {
			if (err) {
				console.log(err.message)
			}
			sessActive = true
			aksi = "update"
			console.log("Berhasil mengupdate data")
			res.redirect('/')
		})
	})

	// delete data product
	app.post('/delete', (req, res) => {
		let sql = "DELETE FROM product WHERE product_id="+req.body.product_id
		let query = conn.query(sql, (err, results) => {
			if (err) {
				console.log(err.message)
			}
			sessActive = true
			aksi = "delete"
			console.log("Berhasil mengdelete data")
			res.redirect('/')
		})
	})

	app.get('/login', (req, res) => {
		res.render('login')
	})

	app.post('/login', (req, res) => {
		let sql = "SELECT * FROM `user` WHERE email='"+req.body.email+"' AND password='"+req.body.password+"'";
		let query = conn.query(sql, (err, results) => {
			if (err) {
				console.log(err.message)
			}
			if (results.length > 0) {
				res.redirect('/')
				checkLogin = true
			}else{				
				res.redirect('/login')
				checkLogin = false
			}
		})
	})
})