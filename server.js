var fs = require("fs");
var express = require('express');
var database = require('./database');
var app = express();

app.configure(function(){
    app.use(require('connect').bodyParser());
});

app.use(express.static(__dirname + '/'));
app.use(express.logger());

app.post('/allocate',function(req,res){
	var info = {};
	info['userid'] = req.body.userid;
	info['collip'] = req.headers['x-forwarded-for'].split(', ')[0] || req.connection.remoteAddress;
	info['srcport'] = req.body.portno;
	info['filename'] = info['userid'] + info['collip'] + info['srcport'];
	fs.readFile(req.files.objfile.path,function(err,data){
		var newPath = "/tftpboot/"+info['filename'];
		fs.writeFile(newPath, data, function (err) {
			if(err){
				console.log(err);
				res.send("Failure ....");
			}
			else{
				database.checkdb(info,function(port){
					res.write("You were allocated the following port : "+ port+"\n");
					res.write("OK...");
					res.write("Bye");
					res.end();
				});
			}
		});
	});
});
app.listen(5475);
console.log('Express server started on port %s', app.listen().address().port);
