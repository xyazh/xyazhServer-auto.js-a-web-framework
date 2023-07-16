/* http服务器的具体方法在这里实现
 * 每一个连接都对应了一个BaseServer对象的实例。
*/

IServerHelper = require("./IServerHelper.js");
PathManager = require("./PathManager.js");

const H = "HTTP/1.1 ";

const ERROR_PAGE_START = `<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <title>Error response</title>
    </head>
    <body>
        <h1>Error response</h1>`
const ERROR_PAGE_END = `</body>
</html>`

const BaseServer = function (xya_sock) {
    var i_server_helper = new IServerHelper();
    var self = Object.assign({}, i_server_helper);
    self.__this__ = this;
    self.xya_sock = xya_sock;

    self.http_type = "";
    self.raw_path = "";
    self.pure_path = "";
    self.http_version = "";
    self.headers = {};
    self.url_args = {};

    self.request_headers = [];
    self.request_headersed = "";

    self.sendResponse = function (statu, message) {
        self.request_headers.push(`${H} ${statu} ${message}`)
    }

    self.sendHeader = function (keyword, value) {
        self.request_headers.push(`${keyword}: ${value}`)
    }

    self.endHeaders = function () {
        self.request_headers.push(`\r\n`)
        self.request_headersed = self.request_headers.join("\r\n");
        return self.request_headersed;
    }

    self.send = function (body) {
        var r = new java.lang.String(self.request_headersed);
        xya_sock.send(r.getBytes("UTF-8"));
        xya_sock.send(body);
    }

    self.sendTextPage = function (text) {
        text = new java.lang.String(text);
        text = text.getBytes("UTF-8");
        self.sendResponse(200, "OK");
        self.sendHeader("Server", "xyazhServer/1.0(auto.js)");
        self.sendHeader("Content-type", "text/html;charset=utf-8");
        self.sendHeader("Content-Length", text.length);
        self.endHeaders()
        self.send(text);
    }

    self.sendFile = function (file_path) {
        var file_data = null;
        try {
            file_data = files.readBytes(file_path);
        } catch (e) {
            self.sendError(404, "Not Found");
            return;
        }
        var file_class = self.getFileContentType(file_path);
        var size = file_data.length;
        self.sendResponse(200, "OK")
        self.sendHeader("Server", "xyazhServer/1.0(auto.js)");
        self.sendHeader("Content-type", file_class)
        self.sendHeader("Content-Length", size)
        self.endHeaders();
        self.send(file_data);
    }

    self.sendError = function (statu, message) {
        self.sendResponse(statu, message);
        self.sendHeader("Server", "xyazhServer/1.0(auto.js)");
        self.sendHeader("Content-Type", "text/html;charset=utf-8");
        self.sendHeader("Connection", "close");
        var rb = "";
        rb += ERROR_PAGE_START;
        rb += `<p>${statu} ${message}</p>`;
        rb += ERROR_PAGE_END;
        self.sendHeader("Content-Length", rb.length);
        self.endHeaders();
        rb = new java.lang.String(rb);
        self.send(rb.getBytes("UTF-8"));
    }

    self.__httpLink__ = function () {
        var h = new java.lang.String(self.xya_sock.recvLine(), "UTF-8");
        h = h.replace("\r", "").replace("\n", "");
        h = h.split(" ");
        self.http_type = h[0];
        self.raw_path = h[1];
        self.http_version = h[2];
        while (true) {
            var a_line = self.xya_sock.recvLine();
            if ((a_line[0] == 13 && a_line[1] == 10) || (a_line[0] == 10)) {
                break
            }
            a_line = new java.lang.String(a_line, "UTF-8");
            a_line = a_line.replace("\r", "").replace("\n", "");
            var kw_line = a_line.split(": ");
            if (kw_line.length == 1) {
                kw_line = a_line.split(":");
            }
            self.headers[kw_line[0]] = kw_line[1];
        }
        var url_data = self.raw_path.split("?");
        self.pure_path = url_data[0];
        if (url_data[1]) {
            var url_args = url_data.split("&");
            for (var i of url_args) {
                var key_val = i.split("=");
                self.url_args[key_val[0]] = key_val[1];
            }
        }
        self.doLink();
    }

    self.doLink = function () {
        var f = PathManager.findPath(self.pure_path, self.http_type);
        if (!f) {
            self.sendError(404, "Not Found");
            return;
        }
        try {
            f(self);
        } catch (e) {
            self.sendError(500, "Internal Server Error");
            return;
        }
    }

    return self;
}

module.exports = BaseServer;