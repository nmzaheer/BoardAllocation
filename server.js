var fs = require("fs");
var express = require('express');
var database = require('./database');
var app = express();

//----------------------------iptables restart---------------------------
var spawn = require('child_process').spawn
	,   child = spawn('service',['iptables', 'restart']);
	
//----------------------------iptables restart end---------------------------

//----------------------------Database cleaning--------------------------
var mysql = require('mysql');
var connection = mysql.createConnection({
  user : 'adi',
  password : 'adi123'
});
connection.connect(function(err){
	if(err != null)
	{
		console.log('Error connecting to mysql:' + err+'\n');
	}
});

connection.query("update b_mng.b_status set Userid=null,Intime=null,logged=0,collegeip=null where logged=1;", function(err, rows){
	if(err != null) 
        console.log("Query error:" + err);
	else{
		console.log('Database is refreshed & iptables service has been restarted');
		connection.query("set global max_connections=10000;", function(err, rows){
			if(err != null) 
			console.log("Query error:" + err);
			else{
				console.log('Max SQL user connections=10000');
			}
		});
	}
	connection.end();
});
//----------------------------Database cleaning end--------------------------

app.configure(function(){
    app.use(require('connect').bodyParser());
    app.use('/plugin/update',express.static(__dirname + '/update'));
    app.use(express.static(__dirname + '/'));
    app.use(express.logger());
});

app.get('/users', function(req, res){
var mysql = require('mysql');
var connection = mysql.createConnection({
  user : 'adi',
  password : 'adi123'
});
connection.connect(function(err){
	if(err != null)
	{
		console.log('Error connecting to mysql:' + err+'\n');

	}
});

connection.query("select * from b_mng.b_status where logged=1;", function(err, rows){
	if(err != null) 
        console.log("Query error:" + err);
	else{
	if(rows.length == 0)
		res.send("No users logged in....");
	else
		res.write("College IP  \t  Board  \tPort  \t \tTime of Entry\t\t\t        Username  \n");
		for(i=0; i<rows.length;i++)
		res.write(rows[i].Collegeip+'\t'+rows[i].Boardip+'\t'+rows[i].Portno+'\t'+rows[i].Intime+'\t\t'+rows[i].Userid+'\n');
	}
	res.end();
	connection.end();
});

});
app.post('/allocate',function(req,res){
	var info = {};
	
	info.userid = req.body.userid;
	info.collip = req.connection.remoteAddress;
	info.srcport = req.body.portno;
	info.filename = info.userid + info.collip + info.srcport;
fs.readFile(req.files.objfile.path,function(err,data){
		var newPath = "/tftpboot/"+info.filename;
		fs.writeFile(newPath, data, function (err) {
			if(err){
				console.log("file copying problem");
				console.log(err);
				res.send("Failure ....");
			}
			else{
                    database.checkdb(info,function(status,deletefile){
                    res.write(status+"\n");
                    res.write("OK...\n");
                    res.write("Bye...");
		console.log("Delete file value: "+deletefile);
					if(deletefile===1){
                        fs.unlink('/tftpboot/'+info.filename, function(err){
                            if (err !==null && err.code != 'ENOENT') console.log(err);
                            console.log('successfully deleted'+info.filename);
                        });
                    }
					res.end();
				});
			}
		});
	});
});
process.on('uncaughtException', function(err){
console.log(err.stack);
});
app.listen(5475);
console.log('Express server started on port %s', app.listen().address().port);
