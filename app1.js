var express = require("express");
var fs = require("fs");
var app = express();

app.configure(function(){
    app.use(require('connect').bodyParser());
});

app.use(express.static(__dirname + '/'));

app.post('/a',function(req,res){
	var userid = req.body.userid;
	var portno = req.body.portno;
	var collip = req.headers['x-forwarded-for'].split(', ')[0];
	console.log(collip);
	console.log(userid);
console.log(portno);
console.log(req.files.objfile.size);
fs.readFile(req.files.objfile.path,function(err,data){
		var newPath = "/tftpboot/"+collip+userid+portno;

		fs.writeFile(newPath, data, function (err) {
			if(err)
			{
				console.log(err);
				res.send("Failure ....");
			}
			else
			    res.send("File transfer successful!!!!!!");
			    var dbcheck = require("./db2");
				dbcheck.dbchecking(userid,collip,collip+userid+portno,portno);
			});
	});
});
app.listen(8080);
console.log('Express server started on port %s', app.listen().address());
