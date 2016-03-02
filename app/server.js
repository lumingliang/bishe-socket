var net = require('net');
var server = net.createServer(function(connect) {
	console.log('client connected');
	connect.on('end' , function() {
		console.log('client has disconnect');
	});
	
	connect.write('hello ,welcome to join us!');
	connect.pipe(connect);
	connect.on('data' , function(data) {
		console.log(data);
	});
});

server.listen(8088, function() {
	console.log('server has create');
});
