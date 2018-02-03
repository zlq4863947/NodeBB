var http = require('http'),
	httpProxy = require('http-proxy');

// 新建一个代理 Proxy Server 对象  
var proxy = httpProxy.createProxyServer({});

// 捕获异常  
proxy.on('error', function (err, req, res) {
	if (res.writeHead) {
		res.writeHead(500, {
			'Content-Type': 'text/plain;charset=utf-8'
		});
		res.end('出了些问题。我们正在报告错误消息');
	}
});

var serverIp = '104.156.238.121';
// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。  
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发  
var server = http.createServer(function (req, res, head) {
	// 在这里可以自定义你的路由分发  
	var host = req.headers.host,
		ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log("client ip:" + ip + ", host:" + host);
	switch (host) {
	case 'www.tokenbbs.ga':
	case 'tokenbbs.ga':
		proxy.web(req, res, {
			target: 'http://' + serverIp + ':4567'
		});
		break;
	default:
		res.writeHead(200, {
			'Content-Type': 'text/plain;charset=utf-8'
		});
		res.end('Welcome to my server!');
	}
});

console.log("listening on port 80")
server.listen(80);