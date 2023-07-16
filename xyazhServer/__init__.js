/* 服务器在这里实现启动
 * 创建一个tcp服务器绑定一个端口并监听，连接传入
 * 后处理http请求。
*/

importClass(java.net.Inet4Address);
importClass(java.net.ServerSocket);

XyazhServerSocket = require("./XyazhServerSocket.js");
BaseServer = require("./BaseServer.js");

const XyazhServer = function () {
    var self = {};
    self.__this__ = this;
    self.is_running = false;
    //随机一个端口
    self.port = random(10240,65535);
    self.run = function () {
        //ip127.0.0.1
        addr = Inet4Address.getByAddress([127, 0, 0, 1]);
        var max_try = 50;
        while(max_try){
            try{
                max_try -= 1;
                self.socket = new ServerSocket(self.port, 102400, addr);
                break;
    
            }catch(e){
                self.port = random(10240,65535);
            }
        }
        for (; ;) {
            self.is_running = true;
            var sock = self.socket.accept();
            var xya_sock = new XyazhServerSocket(sock);
            threads.start(function () {
                var server = new BaseServer(xya_sock);
                server.__httpLink__();
                sock.close();
            })
        }
    }
    return self;
}

module.exports = XyazhServer;