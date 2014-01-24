
function ftransfer(filename,boardip,portno,intime,collegeip,studentport){ 
		
		/*var filename=filename1;
		var boardip=boardip1;
		var portno=portno1;
		var intime=intime1;*/

		//console.log(filename);
		//console.log(boardip);
		//console.log(portno);
		var sport = portno+3089;
		console.log(filename+' '+boardip+' '+portno+' '+sport);
		var ipupdate = require("./ipupdate");
		// ipupdate.ipupdating(boardip,portno,intime,0);
		var spawn = require('child_process').spawn,	
		    //ls    = spawn('sshpass', ['-p','','ssh','0@192.168.15.2', './loading_file','abc','4991','obj2']);
		ls    = spawn('ssh', ['-p',sport,'0@'+boardip, './loading_file',filename,portno,'obj'+portno]);
		//ls= spawn('sshpass', ['-p','','ssh','0@'+rows[0]['boardip'], 'pkill','-f','-o',gdb_portno]);
		ls.stdout.on('data', function (data) {
		  console.log('stdout: ' + data);
		});
////////////////////////////////////////////////////////////////////////////////////////////////////
		ls.stderr.on('data', function (data) {
			//if (data == 'Terminated'){


		//}	
			//console.log('I am here3');
			console.log('stderr: ' + data);
			
		});
////////////////////////////////////////////////////////////////////////////////////////////////////
	ls.on('close', function (code) {
		var mysql = require('mysql');
		var connection2 = mysql.createConnection({
		  user : 'adi',
		  password : 'adi123'
		});
		connection2.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+boardip+"' and portno="+portno+";", function(err,res2){
							if(err!=null){
							console.log('I am here2');
							console.log(err);
							}
							else{
							//connection2.end();
							console.log('I am here');	
							return "success";
							}
						});
		 console.log('child process exited with code ' + code);
			var fs = require('fs');
			ipupdate.ipupdating(boardip,portno,collegeip,studentport,1);
			fs.unlink('/tftpboot/'+filename, function (err) {
			 //if (err) throw err;
			  console.log('successfully deleted'+filename);
			});
		 return "success";
	});

////////////////////////////////////////////////////////////////////////////////////////////////////
	setTimeout(function(){
		var mysql = require('mysql');
		var connection3 = mysql.createConnection({
		  user : 'adi',
		  password : 'adi123'
		});
		connection3.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+boardip+"' and portno="+portno+" and intime='"+intime+"';", function(err,res2){
							if(err!=null){
							console.log(err);
							}
							else{
								console.log(res2);
								//connection3.end();
								if (res2['affectedRows']==1){
var gdb_portno='\'gdbserver :'+portno+'\'';
var spawn = require('child_process').spawn,ls= spawn('ssh', ['-p','8088','0@'+boardip, 'pkill','-f','-o',gdb_portno]);



								console.log('intime');
								console.log('I am here5');
			var fs = require('fs');
			ipupdate.ipupdating(boardip,portno,collegeip,studentport,1);
			fs.unlink('/tftpboot/'+filename, function (err) {
			 // if (err) throw err;
			  console.log('successfully deleted 2'+filename);
			});
			
								}
							}
						});
		}, 300000);
						
}
////////////////////////////////////////////////////////////////////////////////////////////////////
exports.ftransfer = ftransfer;
