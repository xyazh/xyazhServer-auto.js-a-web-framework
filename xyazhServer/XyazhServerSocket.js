const XyazhServerSocket = function(sock){
    var self = {};
    self.__this__ = this;
    self.sock = sock;
    self.recv = function(size){
        var r = self.sock.getInputStream();
        var buf = $util.java.array("byte",size);
        var available_bytes = r.available();
        if(available_bytes < 1){
            return null;
        }
        var real_size = r.read(buf,0,size);
        var buf1 = $util.java.array("byte",real_size);
        java.lang.System.arraycopy(buf,0,buf1,0,real_size);
        return buf1
    }
    self.recvLine = function(){
        var r = [];
        while(true){
            var d = self.recv(1);
            if(!d){
                return r;
            }
            r.push(d[0]);
            if(d[0] == 10){
                return r;
            }
        }
    }
    self.send = function(data){
        var r = sock.getOutputStream();
        r.write(data);
    }
    return self;
}

module.exports = XyazhServerSocket;