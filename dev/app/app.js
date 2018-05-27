var express = require('express');
var mysql   = require('mysql');
var bodyParser = require('body-parser');
var app = express();

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'kakaopay'
});

conn.connect();

app.locals.pretty = true;
app.set('views','./views');
app.set('view engine','jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}))

app.get('/:idx', function(req, res) {
	if(req.params.idx == 'index'){
		res.render('index');
	}else if(new RegExp(/^[a-zA-Z0-9]{1,8}$/).test(req.params.idx)){
		var sql = 'SELECT id, shortUrlId, shorturl, longurl FROM shorturlhistory where shortUrl = ?';
		var qParams = [req.params.idx];
		
		conn.query(sql,qParams,function(err, rows, fields){
			if(err){
				console.log(err);
				res.render('error');
			}else{
				if(rows.length > 0) {
					console.log(rows[0].longurl);
					res.redirect(rows[0].longurl);
				} else {
					res.render('error');
				}
			}
		});	
	}else{
		res.render('error');
	}
	
});

app.post('/result',function(req,res){
	
	var orgUrlVal = '';
	var shortUrlId = '';
	var orgUrlValTemp = '';
	
	orgUrlVal = req.body.orgUrl;	
	
	var shortUrl = '';
	var baseUrl = 'http://localhost:3000/';
	var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	shortUrl = makeShortUrl(orgUrlVal);
	
	function makeShortUrl(orgUrlVal){
		orgUrlValTemp = orgUrlVal;
		var uniqueShortedUrl = '';
		var totalNum = 0;
		for(var inx = 0 ; inx < orgUrlValTemp.length; inx++){
			totalNum = totalNum + orgUrlValTemp[inx].charCodeAt();
		}
		
		shortUrlId = totalNum;
		
		var sql = 'SELECT id, shortUrlId, shorturl, longurl FROM shorturlhistory where shortUrlId = ?';
		var params = [shortUrlId];
		
		conn.query(sql,params,function(err, rows, fields){
			if(err){
				console.log(err);
				res.render('error');
			}else{		
						
				//unique sqlId		
				if(rows.length < 1){
					while(totalNum > 0){
						uniqueShortedUrl = uniqueShortedUrl + (table[totalNum % 62]);
						totalNum = Math.floor(totalNum / 62);
					}
				
					shortUrl = baseUrl + uniqueShortedUrl;
				
					insertShortUrl(shortUrlId,uniqueShortedUrl,orgUrlValTemp);
					
				}
				//same sqlId
				else{
					//different URL
					if(orgUrlValTemp != rows[0].longurl){
						shortUrlId = shortUrlId + (rows[0].id + 1);
						while(totalNum > 0){
							uniqueShortedUrl = uniqueShortedUrl + (table[totalNum % 62]);
							totalNum = Math.floor(totalNum / 62);
						}
					
						shortUrl = baseUrl + uniqueShortedUrl;
					
						insertShortUrl(shortUrlId,uniqueShortedUrl,orgUrlValTemp);
					}
					//same URL
					else{
						shortUrl = baseUrl + rows[0].shorturl;						
					}
					
				}
				
				res.render('result',{shortUrl : shortUrl, orgUrl : orgUrlVal});				
				
			}
		});
		
	};
	
	function insertShortUrl(shortUrlId,uniqueShortedUrl,longUrl){
		var sql = 'INSERT INTO shortUrlHistory (shorturlid, shorturl, longurl) VALUES(?,?,?)';
		var params = [shortUrlId, uniqueShortedUrl, longUrl];
		
		conn.query(sql,params,function(err, rows, fields){
			if(err){
				console.log(err);
			}
		});
	}
		
});

app.listen(3000,function(){
	console.log('Connected 3000port.');
});