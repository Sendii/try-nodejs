'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
  exports.setup = function(options, seedLink) {
  	dbm = options.dbmigrate;
  	type = dbm.dataType;
  	seed = seedLink;
  };

  exports.up = function(db, callback) {
  	db.createTable('product', {
  		product_id: {
  			type: 'int',
  			primaryKey: true,
  			autoIncrement: true
  		},
  		product_name: {
  			type: 'string',
  			length: 40
  		},
  		product_price: {
  			type: 'int',
  			length: 12
  		},
  	}, (err) => {
  		if (err) {
  			console.log(err.message)
  		}
  		return callback()
  	})
  };

  exports.down = function(db, callback) {
  	db.dropTable('product', callback)
  };

  exports._meta = {
  	"version": 1
  };
