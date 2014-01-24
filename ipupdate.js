function ipupdate(boardip,portno,collegeip,studentport,drop){ 


//	var boardip='192.168.15.2',
//	    portno=4991,
//	    collegeip='10.21.3.154',
//	    studentport='4989',
//	    drop=0,
	var board_port=boardip+':'+portno;

	var sudo = require('sudo');
	var options = {
	    cachePassword: true,
	    prompt: 'Password, yo? ',
	    spawnOptions: { /* other options for spawn */ }
	};


	if(drop ==0){
	   var child = sudo(['iptables', '-t', 'nat', '-A', 'PREROUTING','-i','eth0', '-p', 'tcp', '-j', 'DNAT', '-s', collegeip, '-d', '10.7.149.100', '--dport',studentport, '--to-destination', board_port], options);
child.stdout.on('data', function (data) {
    console.log(data.toString());
});
	
	}
	else{
	    var child = sudo(['iptables', '-t', 'nat', '-D', 'PREROUTING','-i','eth0','-p', 'tcp', '-j', 'DNAT', '-s', collegeip, '-d', '10.7.149.100', '--dport',studentport, '--to-destination', board_port], options);
child.stdout.on('data', function (data) {
    console.log(data.toString());
});
	
	}
	


}


////////////////////////////////////////////////////////////////////////////////////////////////////
exports.ipupdating = ipupdate;
