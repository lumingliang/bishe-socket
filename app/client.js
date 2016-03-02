var net = require('net');
var client = net.connect({port:80,host:'52.74.209.168'} , function() {
	console.log('i have connect to the server!');
	client.write('hello word\n');
	client.write('l jjj');
});
client.on('data' , function(data) {
	console.log(data.toString());
	//client.write('i had recieve');
//	client.end();
});
client.on('end', function() {
	console.log('disconnect to the server gg');
});
client.on('error' ,function(e) {
	console.log(e);
});
