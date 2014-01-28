function add(info, input)   {
    
	var spawn = require('child_process').spawn
	,   board_port=info.boardip+':'+info.portno
    ,   child = spawn('iptables',['-t', 'nat', '-A', 'PREROUTING','-i','eth0', '-p', 'tcp', '-j', 'DNAT', '-s', input.collip, '-d', '10.7.143.42', '--dport',input.srcport, '--to-destination', board_port]);
}
	
function del(info, input)   {
    
	var spawn = require('child_process').spawn
	,   board_port=info.boardip+':'+info.portno
    ,   child = spawn('iptables',['-t', 'nat', '-D', 'PREROUTING','-i','eth0', '-p', 'tcp', '-j', 'DNAT', '-s', input.collip, '-d', '10.7.143.42', '--dport',input.srcport, '--to-destination', board_port]);
}

exports.allow = add;
exports.drop = del;
