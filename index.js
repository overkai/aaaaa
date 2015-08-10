var express = require('express');
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var app = express();
 
var mongodbURL = 'mongodb://SeanTsai:sodamiu1216@ds031952.mongolab.com:31952/todolist';

var myDB;
mongodb.MongoClient.connect(mongodbURL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		myDB = db;
		console.log('connection success');
	}
});

//將帳號、密碼、名稱存入Todos資料庫
app.get('/api/insert', function(request, response) {
	var item = {
		account : request.query.account,
		password : request.query.password,
		owner : request.query.owner
	}
	var collection = myDB.collection('Todos');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});


//回傳密碼比對，若成功登入將UID、名稱紀錄起來
app.get('/api/query', function(request, response) {
	var item = {
	account : request.query.account,
	password : request.query.password,
	owner : request.query.owner
	}
	var collection = myDB.collection('Todos');
	collection.find({account : request.query.account}, {password: 1, _id: 1, owner: 1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});


//建立群組：將群組名稱、密碼存入group資料庫
app.get('/api/groupinsert', function(request, response) {
	var item = {
		groupname : request.query.groupname,
		password : request.query.password,
		UID : request.query.UID,
	}
	var collection = myDB.collection('group');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});

//建立群組2：把建立的群組ID抓回來(GID) 後呼叫API insertnumber
app.get('/api/groupIDquery', function(request, response) {
	var item = {
	UID : request.query.UID,
	}
	var collection = myDB.collection('group');
	collection.find( { UID : request.query.UID, }, { _id: 1 }).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});


//新增群組：要比對群組密碼，若是對的，回傳_id (GID) 後呼叫API insertnumber
app.get('/api/joingroupquery', function(request, response) {
	var item = {
	groupmember : request.query.groupmember,
	groupname : request.query.groupname,
	password : request.query.password
	}
	var collection = myDB.collection('group');
	collection.find({groupname : request.query.groupname}, {password: 1, _id: 1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});


//將GID、UID、傳到number資料庫 
app.get('/api/insertnumber', function(request, response) {
	var item = {
		GID : request.query.GID,
		UID : request.query.UID
		
	}

	var collection = myDB.collection('number');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});
//用GID找尋UID
app.get('/api/findUID', function(request, response) {
	var item = {
	
	GID : request.query.GID
	}
	var collection = myDB.collection('number');
	collection.find({GID : request.query.GID}, {UID: 1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});

//查詢出群組裡的成員有哪些
app.get('/api/groupquerylist', function(request, response) {
	var item = {
	_id : request.query._id
    
	}
	var collection = myDB.collection('Todos');
	collection.find({_id: request.query._id}, {owner:1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});



//用UID找尋GID
app.get('/api/findGID', function(request, response) {
	var item = {
	
	UID : request.query.UID
	}
	var collection = myDB.collection('number');
	collection.find({UID : request.query.UID}, {GID: 1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});




//查詢出成員加入的群組有哪些
app.get('/api/groupmemberquerylist', function(request, response) {
	var item = {
	
	UID: request.query.UID
	}
	var collection = myDB.collection('group');
	collection.find({UID: request.query.UID}, {groupname: 1, _id: 0}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});


/*app.get('/api/delete', function(request, response) {
	var param = {
		_id : new ObjectID(request.query.id)
	}
	console.log(JSON.stringify(param));
	var collection = myDB.collection('Todos');
	collection.remove(param, function(err, result) {
		if (err) {
			console.log('response err' + JSON.stringify(err));
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});*/

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));


