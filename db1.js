var mysql = require('mysql');
var connection = mysql.createConnection({
  user : 'adi',
  password : 'adi123'
});

 var profile = new Array();
     profile['checkret']=0;

connection.connect(function(err){
	if(err != null)
	{
		console.log('Error connecting to mysql:' + err+'\n');
		profile['checkret']=1;
	}
});
connection.query("select boardip,portno from b_mng.b_status where logged=0 and working=1 group by boardip HAVING sum(logged)<=4 order by sum(logged),boardip LIMIT 1;", function(err, rows){
	if(err != null) {
        console.log("Query error:" + err);
	} 
	else
	{
		console.log(rows[0]['boardip']);
		connection.query("update b_mng.b_status set logged=1 where boardip='"+rows[0]['boardip']+"' and portno="+rows[0]['portno']+" and logged=1;", function(err,res){
			if(err!=null)
				console.log(err);
			else
			{
				if (res['affectedRows']==0)

			}

		});

    }
    connection.end();
});
