//var io = require('socket.io')(80);
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var edisons = {};
var users = {};

var num = 0;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user has connect');
  //console.log(io.sockets.sockets);
//  edisons[num] = socket;
  num++;
  console.log(num);
  socket.on('message', function (msg) {
	  console.log(msg);
	  socket.emit('r', 'i have reseve');


  });
	  //eval('users.' + user_id + '= "jjjj"');

  // 这里开始是iot控制
  socket.on('addUsers', function(data) {
	  // 客户端添加了'user_id'前缀
	  var user_id = data.user_id;
	  //var user_id = 'jj';
	  console.log(user_id);
	  //eval('users.' + data.user_id + ' = { online_sensors: ' + data.online_sensors + '}' );
	  var cache = {online_sensors: data.online_sensors, socket: socket};
	  users[user_id] = cache;
	  //eval('(users.'+ user_id + '= cache)');
	  //eval('users.' + user_id + '= "jjjj"');
	  console.log(users);
  });

  socket.on('error', function(data) {
	  console.log(data);
  });

  socket.on('updateData', function(data) {
	  console.log(data);
	  var user_id = data.user_id;
	  console.log(edisons[user_id]);
	  console.log(users);
//	  exit;
	  edisons[user_id].data = data.data;
	  var online_sensors = users[user_id].online_sensors;
	  console.log(users[user_id]);
	  console.log(online_sensors);
	  var updateData = {};
	  // 构造在线sensor的更新数据
	  for (var key in online_sensors) {
		  var sensor_id = online_sensors[key];
		  console.log(key, sensor_id);
		  updateData[sensor_id] = data.data[sensor_id] ;
	//	  eval( 'updateData.' +  sensor_id + '= ' + edisons.user_id.value.sensor_id)
	  }

	  users[user_id].socket.emit('updateData', updateData);
  });

  var  computUpdateData = function() {
	//  for (key in users.use)
  }

  socket.on('addEdison', function(data) {
	  console.log(data);
	  var user_id = data.user_id;
	  var cache = { data : {}, socket: socket }
	  //eval('edisons.' + user_id + '= cache');
	  // 可以直接用数组形式动态增加键值对
	  edisons[user_id] = cache;
	  //edisons = eval(edisons);
	  console.log(edisons[user_id]);
  });

  function updateData() {
	  socket.emit('updataData', {});
  } 

  //setInterval(updateData, 5000);

  socket.on('yy', function(data) {
	  console.log(data);
  });

  socket.on('newMsg' ,function(data) {
      socket.emit('message', 'your data is'+data);
  });
  socket.emit('message', 'welcome!');
  socket.on('data' ,function(data) {
      console.log(data);
      io.emit('newData', data);
  });

  socket.on('WeblightOn', function() {
      console.log('light on');
	  edison[1].emit('hh', 'jj');
  });

  socket.on('WeblightOff' , function() {
      console.log('light off');
      io.emit('lightOff');
  });


  socket.on('disconnect', function () {
	  console.log('disconnect');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



