const path = require('path')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const session = require('express-session')
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
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use('/assets', express.static(__dirname + '/public'))

var sessMessage = ''
var sessActive = false
function textSession(message){
	return message
}

app.listen(3000, function(){
	// list data product
	app.get('/', (req, res) => {
		let sql = "SELECT * FROM PRODUCT ORDER BY product_id DESC";
		let query = conn.query(sql, (err, result) => {
			if (err){
				console.log(err.message)
			}
			sessMessage = req.session

			if (sessActive){					
				sessMessage.msg = "Berhasil menambahkan data"
				console.log('1:' + sessActive)
			}

			res.render('product_view', {
				results: result,
				session: textSession(sessMessage),
				sessCheck: sessActive
			})
			sessActive = false
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
			}else{				
				sessActive = true
				console.log("Berhasil menambahkan data")
			}						
			res.redirect('/')
		})
	})
})