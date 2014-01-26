
function ftransfer(connection, info, input){ 
		
	var ncport = 56789
	,   fs = require("fs")
	,   ipfwd = require("./fwd")
	,   spawn = require('child_process').spawn
    ,   echo_cmd ='"./loading_file '+input.filename+' '+input.portno+' '+'obj'+input.portno+'"'
    ,   nc_cmd = "nc "+info.boardip+" "+ncport
	,   ls = spawn('echo', [echo_cmd, " | ", nc_cmd])
	,   id = setTimeout(function(){
                var gdb_portno='\'gdbserver :'+info.portno+'\''
                ,   spawn = require('child_process').spawn
                ,   pkill_cmd = 'pkill '+'-f '+'-o '+gdb_portno
                ,   fs = require('fs')
                ,   kill= spawn('echo', [pkill_cmd , " | ", nc_cmd]);
                kill.stdout.on('data', function (data) {
                    console.log("stdout:"+data);
                });
                kill.stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });
                connection.release();
                ipfwd.drop(input,info);
                fs.unlink('/tftpboot/'+input.filename, function (err) {
                    if (err) throw err;
                    console.log('Successfully deleted '+input.filename);
                });
	}, 300000);
	ls.stdout.on('data', function (data) {
        console.log("stdout:"+data);
	});
	ls.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});
	ls.on('close', function (code) {
		connection.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+info.boardip+"' and portno="+info.portno+";", function(err,res){
			if(err!==null)   console.log(err);
		});
		clearTimeout(id);
		connection.release();
		ipfwd.drop(input,info);
		fs.unlink('/tftpboot/'+input.filename, function (err) {
            if (err) throw err;
            console.log('successfully deleted'+input.filename);
		});
    });
}

exports.load = ftransfer;