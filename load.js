
function ftransfer(connection, info, input){ 
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
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
		ls.kill("SIGHUP");
		
	}, 300000);
	ls.stdin.write(echo_cmd);
	ls.stdout.on('data', function (data) {
        console.log("stdout:"+data);
	var datum = decoder.write(data);
	if(datum == 'Killing inferior\n' || datum.indexOf("GDBserver exiting")!==-1)
		ls.kill('SIGHUP');
	});
	ls.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	ls.on('close', function (code) {
        clearTimeout(id);
		connection.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+info.boardip+"' and portno="+info.portno+";", function(err,res){
			if(err!==null)   console.log(err);
			connection.release();
		});
		ipfwd.drop(info,input);

///////////////////////////////////////////////Logging/////////////////////////////////////////////////////////////////////
		Number.prototype.padLeft = function(base,chr){
		    var  len = (String(base || 10).length - String(this).length)+1;
		    return len > 0? new Array(len).join(chr || '0')+this : this;
		}
		var d = new Date,
		    dformat = [d.getFullYear(),
			       (d.getMonth()+1).padLeft(),
			       d.getDate().padLeft()].join('-')+
			      ' ' +
			      [d.getHours().padLeft(),
			       d.getMinutes().padLeft(),
			       d.getSeconds().padLeft()].join(':');
		//var datetime = new Date();
		var winston = require('winston');
		winston.add(winston.transports.File, { filename: 'mylogfile.log', level: 'silly' });
		winston.log('info'," Username: "+input.userid+" Portno of student "+input.srcport+" College "+input.collip+" board ip "+info.boardip+" board port "+info.portno+" Intime "+info.intime+" Outtime "+dformat);
		winston.remove(winston.transports.File);
///////////////////////////////////////////////Logging/////////////////////////////////////////////////////////////////////
		fs.unlink('/tftpboot/'+input.filename, function (err) {
            if (err !==null && err.code != 'ENOENT') console.log(err);
            console.log('successfully deleted'+input.filename+dformat);
		});
    });
}

exports.load = ftransfer;
