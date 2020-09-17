const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()

const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'nodejs1'
})

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
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use('/assets', express.static(__dirname + '/public'))

app.listen(8000, function(){
	// list data product
	app.get('/', (req, res) => {
		let sql = "SELECT * FROM PRODUCTs";
		let query = conn.query(sql, (err, result) => {
			if (err){
				console.log(err.message)
			}
			res.render('product_view', {
				results: result
			})
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
			}else{
				console.log("Berhasil menambahkan data")
			}
			res.redirect('/')
		})
	})
})