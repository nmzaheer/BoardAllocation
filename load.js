
function ftransfer(connection, info, input){ 

	var ncport = 56789
	,   fs = require("fs")
	,   ipfwd = require("./fwd")
	,   spawn = require('child_process').spawn
	,   echo_cmd ='./loading_file '+input.filename+' '+info.portno+' '+'obj'+info.portno+"\n"
	,   ls = spawn('nc', [info.boardip, ncport])
	,   id = setTimeout(function(){
                var gdb_portno='\'gdbserver :'+info.portno+'\''
                ,   spawn = require('child_process').spawn
                ,   pkill_cmd = 'pkill '+'-f '+'-o '+gdb_portno+"\n"
                ,   kill= spawn('nc', [info.boardip, ncport]);
		kill.stdin.write(pkill_cmd);
                kill.stdout.on('data', function (data) {
                    console.log("stdout:"+data);
                });
                kill.stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });
		kill.stdin.end();
		
	}, 10000);
	ls.stdin.write(echo_cmd);
	ls.stdout.on('data', function (data) {
        console.log("stdout:"+data);
	if(data == 'TERM\n') ls.kill('SIGHUP');
	});
	ls.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	ls.on('close', function (code) {
		connection.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+info.boardip+"' and portno="+info.portno+";", function(err,res){
			if(err!==null)   console.log(err);
			connection.release();
		});
		clearTimeout(id);
		ipfwd.drop(input,info);
		fs.unlink('/tftpboot/'+input.filename, function (err) {
            if (err !==null && err.code != 'ENOENT') console.log(err);
            console.log('successfully deleted'+input.filename);
		});
    });
}

exports.load = ftransfer;
