/*var mysql = require('mysql');
var connection = mysql.createConnection({
  user : 'adi',
  password : 'adi123'
});*/

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
			connection.query("select boardip from b_mng.b_status where working=1 group by boardip HAVING sum(logged)<=4 order by sum(logged),boardip LIMIT 1;", function(err, res0){
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
		if(typeof rows[0]!='undefined')
		{	console.log(rows[0]);
			connection.query("update b_mng.b_status set logged=1,userid='"+args['userid']+"',collegeip='"+args['collip']+"',intime=now() where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and logged=0;", function(err,res){
				if(err!=null)
					console.log(err);
			
				else
				{
					if (res['affectedRows']==0){
						info['db_code']	= 4;
						console.log(info['db_code']);
						//connection.end();
						return info;
						
					}
					info['db_code']	= 1;
					console.log(info['db_code']);
					//info['boardip'] = rows[0]['boardip'];
					info['portno'] = rows[0]['portno'];

connection.query("select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where '"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+";", function(err,res1){
					if(err!=null)
					console.log(err);
					else{
						info['intime'] =res1[0]['time1'];
						console.log(info['intime']);	
						console.log(res1[0]['time1']);
						//connection.end();
						var gdb_portno='\'gdbserver :'+rows[0]['portno']+'\'';
					console.log(gdb_portno);
					console.log(info['intime']);
					var filetrans = require("./filetrans");
					//var ipupdate = require("./ipupdate");
					filetrans.ftransfer(args['filename'],info['boardip'],info['portno'],info['intime']);
						}});
					var temp10 = new Array();

					/*var gdb_portno='\'gdbserver :'+rows[0]['portno']+'\'';
					console.log(gdb_portno);
					console.log(info['intime']);
					var filetrans = require("./filetrans");
					//var ipupdate = require("./ipupdate");
					filetrans.ftransfer(args['filename'],rows[0]['boardip'],rows[0]['portno'],info['intime']);*/

					//var spawn = require('child_process').spawn,ls= spawn(
//'sshpass', ['-p','','ssh','0@'+rows[0]['boardip'], 'pkill','-f','-o',gdb_portno]);
					/*connection.query("select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where '"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+";", function(err,res1){
					if(err!=null)
					console.log(err);
					else{
						setTimeout(function(){connection.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and intime='"+res1[0]['time1']+"';", function(err,res2){
					if(err!=null)
					console.log(err);
					});
						console.log(res1[0]['time1']);
						console.log(res1[0]);
						connection.end();
						return info;
						
						}, 30000);
						}
						});
					
					//connection.end();
					//return info;
					
				}

			});*/
		}
		else
		{
			info['db_code']	= 3;
			console.log(info['db_code']);
			//connection.end();
			return info;
			
		}
}});

    }

});	
		

		


		



	}});
//}

//if(info['db_code']!=2){
	//console.log(info['boardip']);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*connection.query("select boardip,min(portno) as portno from b_mng.b_status where logged=0 and working=1 and 	boardip='"+info['boardip']+"' LIMIT 1;", function(err, rows){
	if(err != null) {
        console.log("Query error:" + err);
	} 
	else
	{
		if(typeof rows[0]!='undefined')
		{	console.log(rows[0]);
			connection.query("update b_mng.b_status set logged=1,userid='"+args['userid']+"',collegeip='"+args['collip']+"',intime=now() where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and logged=0;", function(err,res){
				if(err!=null)
					console.log(err);
			
				else
				{
					if (res['affectedRows']==0){
						info['db_code']	= 4;
						console.log(info['db_code']);
						//connection.end();
						return info;
						
					}
					info['db_code']	= 1;
					console.log(info['db_code']);
					//info['boardip'] = rows[0]['boardip'];
					info['portno'] = rows[0]['portno'];

connection.query("select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where '"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+";", function(err,res1){
					if(err!=null)
					console.log(err);
					else{
						info['intime'] =res1[0]['time1'];
						console.log(info['intime']);	
						console.log(res1[0]['time1']);
						//connection.end();
						var gdb_portno='\'gdbserver :'+rows[0]['portno']+'\'';
					console.log(gdb_portno);
					console.log(info['intime']);
					var filetrans = require("./filetrans");
					//var ipupdate = require("./ipupdate");
					filetrans.ftransfer(args['filename'],info['boardip'],info['portno'],info['intime']);
						}});
					var temp10 = new Array();

					/*var gdb_portno='\'gdbserver :'+rows[0]['portno']+'\'';
					console.log(gdb_portno);
					console.log(info['intime']);
					var filetrans = require("./filetrans");
					//var ipupdate = require("./ipupdate");
					filetrans.ftransfer(args['filename'],rows[0]['boardip'],rows[0]['portno'],info['intime']);*/

					//var spawn = require('child_process').spawn,ls= spawn(
//'sshpass', ['-p','','ssh','0@'+rows[0]['boardip'], 'pkill','-f','-o',gdb_portno]);
					/*connection.query("select date_format(Intime,'%Y-%m-%d %T') as time1 from b_mng.b_status where '"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+";", function(err,res1){
					if(err!=null)
					console.log(err);
					else{
						setTimeout(function(){connection.query("update b_mng.b_status set logged=0,userid=NULL,collegeip=NULL,intime=NULL where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and intime='"+res1[0]['time1']+"';", function(err,res2){
					if(err!=null)
					console.log(err);
					});
						console.log(res1[0]['time1']);
						console.log(res1[0]);
						connection.end();
						return info;
						
						}, 30000);
						}
						});
					
					//connection.end();
					//return info;
					
				}

			});
		}
		else
		{
			info['db_code']	= 3;
			console.log(info['db_code']);
			//connection.end();
			return info;
			
		}

    }

});
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////




		}
	}
});
}


exports.dbchecking = dbcheck;



























///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//connection.end();
/*
if(info['db_code']!=2){
connection.query("select boardip,portno from b_mng.b_status where logged=0 and working=1 group by boardip HAVING sum(logged)<=4 order by sum(logged),boardip LIMIT 1;", function(err, rows){
	if(err != null) {
        console.log("Query error:" + err);
	} 
	else
	{
		if(typeof rows[0]!='undefined')
		{
			connection.query("update b_mng.b_status set logged=1,userid='"+args['userid']+"',userid='"+args['collip']+"',intime=now() where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and logged=0;", function(err,res){
				if(err!=null)
					console.log(err);
			
				else
				{
					if (res['affectedRows']==0){
						info['db_code']	= 4;
						
					}
					info['db_code']	= 1;
					
				}

			});
		}
		else
		{
			info['db_code']	= 3;
			console.log(info['db_code']);
			
		}

    }

});
}*/
//console.log(info['db_code']);
//connection.end();
//return info;
//return info;
