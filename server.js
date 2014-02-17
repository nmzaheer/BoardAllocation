var fs = require("fs");
var express = require('express');
var database = require('./database');
var app = express();

app.configure(function(){
    app.use(require('connect').bodyParser());
    app.use('/plugin/update',express.static(__dirname + '/update'));
    app.use(express.static(__dirname + '/'));
    app.use(express.logger());
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
				console.log(err);
				res.send("Failure ....");
			}
			else{
                    database.checkdb(info,function(status,deletefile){
                    res.write(status+"\n");
                    res.write("OK...\n");
                    res.write("Bye...");
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
app.listen(5475);
console.log('Express server started on port %s', app.listen().address().port);
