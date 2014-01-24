
function dbcheck(userid,collip,filename,studentport){
//Get values from main function and send them back
var mysql = require('mysql');
var connection = mysql.createConnection({
  user : 'adi',
  password : 'adi123'
});

args = new Array();
args['userid'] = userid;//"mohan";
args['collip'] = collip;//"iitm";
args['filename']=filename;//"abc";
args['studentport']=studentport;//"abc";

var info = new Array();
info['db_code'] = null;//0=dberror,1=success(transfer file),2=user already logged,3=no boards available,4=try again
info['boardip'] = null;
info['portno'] = 0;
info['intime']=null;
connection.connect(function(err){
	if(err != null)
	{
		console.log('Error connecting to mysql:' + err+'\n');

	}
});

connection.query("select count(*) as count from b_mng.b_status where userid='"+args['userid']+"' and collegeip='"+args['collip']+"';", function(err, rows){
	if(err != null) {
        console.log("Query error:" + err);
	info['db_code']==0;
	} 
	else
	{
		if(rows[0]['count']!=0)
		{
			info['db_code']=2;
			//connection.end();
			console.log(info['db_code']+'You are already logged on,try after exiting the previous session');
			return info;
				
			
		}
		if(info['db_code']!=2){
			connection.query("select boardip from b_mng.b_status where working=1 group by boardip order by sum(logged),boardip LIMIT 1;", function(err, res0){
	if(err != null) {
        console.log("Query error:" + err);
	} else{

		info['boardip'] = res0[0]['boardip'];
			connection.query("select boardip,min(portno) as portno from b_mng.b_status where logged=0 and working=1 and 	boardip='"+info['boardip']+"' LIMIT 1;", function(err, rows){
	if(err != null) {
        console.log("Query error:" + err);
	} 
	else
	{
		if(rows[0]['boardip']!= null)
		{	console.log(rows[0]);
			connection.query("update b_mng.b_status set logged=1,userid='"+args['userid']+"',collegeip='"+args['collip']+"',intime=now() where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and logged=0;", function(err,res){
				if(err!=null)
					console.log(err);
			
				else
				{
					if (res['affectedRows']==0){
						info['db_code']	= 4;
						console.log(info['db_code']+'Sorry try connecting again');
						//connection.end();
						return info;
						
					}
					info['db_code']	= 1;
					console.log(info['db_code']);
					//info['boardip'] = rows[0]['boardip'];
					info['portno'] = rows[0]['portno'];
					
connection.query("select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+";", function(err,res1){
					if(err!=null)
					console.log(err);
					else{
						info['intime'] =res1[0]['time1'];
						//console.log(info['intime']+'notnull');	
						//console.log(res1[0]['time1']);
						//connection.end();
						var gdb_portno='\'gdbserver :'+rows[0]['portno']+'\'';
					console.log(gdb_portno+info['intime']);
					//console.log(info['intime']);
					var filetrans = require("./filetrans");
					var ipupdate = require("./ipupdate");
					filetrans.ftransfer(args['filename'],info['boardip'],info['portno'],info['intime'],collip,studentport);
					ipupdate.ipupdating(info['boardip'],info['portno'],collip,studentport,0);
					}});//fifth query end(60)
					var temp10 = new Array();

						}});//fourth query end(60)
					}//if end(58)
					else
					{
					info['db_code']	= 3;
					console.log(info['db_code']+'All boards are occupied, please try later');
					return info;
					}
				}});//third query(52) end	
			}});//second query(46) end
		}//if end(45)
	}});//first query(29) end
}//function end

exports.dbchecking = dbcheck;


