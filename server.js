//var io = require('socket.io')(80);
var app = require('express')();
var http = require('http').Server(app);
var kk = require('http');
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
	  console.log('welcome a browser user!the users value is');
	  console.log(users);
  });

  socket.on('error', function(data) {
	  console.log(data);
  });

  socket.on('updateData', function(data) {
	  console.log(data);
	  var user_id = data.user_id;
	  //console.log(edisons[user_id]);
	  //console.log(users);
//	  exit;
	  edisons[user_id].data = data.data;
	  if(users[user_id] == null) {
		  console.log('your browser user has not login');
		  return;
	  }
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
	  console.log('welcome a edison user the edisons vlue is');
	  console.log(edisons);
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


function isOwnEmpty(obj)
{
    for(var name in obj)
    {
        if(obj.hasOwnProperty(name))
        {
            return false;
        }
    }
    return true;
};

// 不检测原型继承来的属性
function isEmpty(obj)
{
    for (var name in obj)
    {
        return false;
    }
    return true;
};
	

function saveData(data) {

	data= JSON.stringify(data);  
	console.log(data);

var opt= {  
            host : 'localhost',  
            port : '80',  
            path : '/iot/data',  
            method : 'get',  
            headers : {  
				"Content-Type": 'application/json',  
				"Content-Length": data.length  
			}  
        };  


	var req = kk.request(opt, function( serverFeedback ) {
		// if( serverFeedback.statusCode == 200 ) {
			// console.log('ok');
		// }
			serverFeedback.on('data', function(data) {
				console.log('data from server is'+ data);
			});
	});
	
	req.write(data+ "\n");
	req.end();
	req.on('error', function(e) {
		console.log(e);
	});
}

function saveAll() {
	if(isEmpty( edisons )) {
		console.log('no edison connect!');
	}
	for( key in edisons ) {
		if(isEmpty(edisons[key].data) ) {
			console.log('no edison data accept!');
			return;
		}
		var d = {};
		d[key] = edisons[key].data;
		saveData( d );
	}
}

setInterval( saveAll, 20000 );



