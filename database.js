

function checkdb(input,callback) {

	var mysql = require('mysql');
	var file = require("./load");
	var ipfwd = require("./fwd");
	var auth = {user : 'adi', password : 'adi123'};
	var query = {};
	query['check_user'] = "select count(*) as count from b_mng.b_status where userid='"+input['userid']+"' and collegeip='"+input['collip']+"';";
	query['free_board'] = "select boardip from b_mng.b_status where working=1 group by boardip order by sum(logged),boardip LIMIT 1;";
	var info = {};
	info['db_code'] = null;//0=dberror,1=success(transfer file),2=user already logged,3=no boards available,4=try again
	info['boardip'] = null;
	info['portno'] = 0;
	info['intime'] = null;


	var pool = mysql.createPool(auth);
	pool.getConnection(function(err,connection) {
		if(err != null)
			console.log('Error connecting to mysql:' + err+'\n');
		else
			UserQuery(connection, query['check_user'], function(status)	{
				if(status == 2)
					res.send('You are already logged on,try after exiting the previous session');				
				else
					BoardQuery(connection, query['free_board'], function(board)	{
						temp = "select boardip,min(portno) as portno from b_mng.b_status where logged=0 and working=1 and boardip='"+board+"' LIMIT 1;";
						info['boardip'] = board;
						FindBoardQuery(connection, temp, function(port)	{
							info['portno'] = port;
							temp = "update b_mng.b_status set logged=1,userid='"+input['userid']+"',collegeip='"+input['collip']+"',intime=now() where boardip='"+board+"' and portno="+port+" and logged=0;"
							UpdateTableQuery(connection, temp, function()	{
								temp = "select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where boardip='"+board+"' and portno="+port+";";
								GetIntimeQuery(connection, temp, function(intime)	{
									info['intime'] = intime;
									file.load(connection, info, input, function()	{
										//TODO
									});
									ipfwd.add(info, input, function(){
										///TODO
									});
								});
							});
						});
					});
			callback();
			});
	});
}

function UserQuery(connection, query, callback)	{
	connection.query(query, function(err, rows) { 
		if(err != null)
			console.log("Query error:" + err);
		else
			if(rows[0]['count']!=0)
				callback(2);
	});			
}

function BoardQuery(connection, query, callback)	{
	connection.query(query, function(err, rows)	{
		if(err != null)
			console.log("Query error:" + err);
		else
			callback(rows[0]['boardip']);
	});			
}

function FindBoardQuery(connection, query, callback)	{
	connection.query(query, function(err, rows)	{
		if(err != null)	{
			console.log("Query error:" + err);
		} 
		else	{
			if(rows[0]['boardip']!= null)	{	
				console.log(rows[0]['portno']);
				callback(rows[0]['portno']);
			}
		}
	});			
}


function UpdateTableQuery(connection, query, callback)	{
	connection.query(query, function(err, res)	{
		if(err != null)	{
			console.log("Query error:" + err);
		} 
		else	{
			if (res['affectedRows']==0){
						console.log('Something went wrong. Can you please try again ???');
			}
		callback();
		}
	});			
}

function GetIntimeQuery(connection, query, callback)	{
	connection.query(query, function(err, res)	{
		if(err != null)
			console.log("Query error:" + err); 
		else
			callback(res[0]['time1']);
	});			
}
exports.checkdb = checkdb;
