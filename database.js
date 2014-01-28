

function checkdb(input,callback) {

//TODO Change messages to decent ones....
//TODO Write conditions for GDB termination
//TODO Unlink when boards are busy or user is already logged on or database connection error
//TODO write unit tests (Mohan - Test Engineer)

	var mysql = require('mysql')
	,   file = require("./load")
	,   ipfwd = require("./fwd")
	,   auth = {host : 'localhost', user : 'adi', password : 'adi123', database:'b_mng'}
	,   info = {}
	,   query = {};
	query.check_user = "select count(*) as count from b_mng.b_status where userid='"+input.userid+"' and collegeip='"+input.collip+"';";
	query.free_board = "select boardip from b_mng.b_status where working=1 group by boardip order by sum(logged),boardip LIMIT 1;";
	var err_msg ="Something went wrong....\nTry sending once again....";
	var pool = mysql.createPool(auth);
	pool.getConnection(function(err,connection) {
		if(err !== null)
		return callback('Error connecting to mysql:' + err+'\n',1);
		else
			UserQuery(connection, query.check_user, function(status)	{
                if (status === 0)
                return callback(err_msg,1);
				if(status == 2) 
				return callback('Why this kolaveri ??? You already connected to a board. Terminate the session before requesting for a new one....',1);
				else    {
					BoardQuery(connection, query.free_board, function(err, board)	{
                        if(err !== null) return callback(err_msg,1);
                        else {
                            var temp = "select boardip,min(portno) as portno from b_mng.b_status where logged=0 and working=1 and boardip='"+board+"' LIMIT 1;";
                            info.boardip = board;
                            FindBoardQuery(connection, temp, function(err, port)	{
                                if(err !== null) return callback(err_msg,1);
                                else    {
                                info.portno = port;
                                temp = "update b_mng.b_status set logged=1,userid='"+input.userid+"',collegeip='"+input.collip+"',intime=now() where boardip='"+board+"' and portno="+port+" and logged=0;";
                                UpdateTableQuery(connection, temp, function(err)	{
                                    if(err !== null) return callback(err_msg,1);
                                    else    {
                                    temp = "select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where boardip='"+board+"' and portno="+port+";";
                                    GetIntimeQuery(connection, temp, function(err, intime)	{
                                        if(err !== null) return callback(err_msg,1);
                                        else    {
                                        info.intime = intime;
                                        file.load(connection, info, input);
                                        ipfwd.allow(info, input);
                                        }
                                        return callback("Start debugging....You have 5 minutes....Remember to terminate the session once done.....",0);
                                    });}
                                });}
                            });}
					});}
			});
	});
}

function UserQuery(connection, query, callback)	{
	connection.query(query, function(err, rows) {
		if(err !== null){
			callback(0);}
		else{
			if(rows[0].count!==0)
				callback(2);
			else 
				callback(1);
		}
	});			
}

function BoardQuery(connection, query, callback)	{
	connection.query(query, function(err, rows)	{
		if(err !== null)
			callback(err, 0);
		else
			callback(err, rows[0].boardip);
	});			
}

function FindBoardQuery(connection, query, callback)	{
	connection.query(query, function(err, rows)	{
		if(err !==null)	{
			callback(err, 0);
		} 
		else	{
			if(rows[0].boardip!== null)	{
				callback(err, rows[0].portno);
			}
		}
	});			
}


function UpdateTableQuery(connection, query, callback)	{
	connection.query(query, function(err, res)	{
		if(err !== null || res.affectedRows===0)	{
			callback(err);
		}
		callback(null);
	});			
}

function GetIntimeQuery(connection, query, callback)	{
	connection.query(query, function(err, res)	{
		if(err !== null)
			callback(err, 0); 
		else
			callback(err,res[0].time1);
	});			
}

exports.checkdb = checkdb;
