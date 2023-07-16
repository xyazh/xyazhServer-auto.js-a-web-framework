const PathManager = require("./xyazhServer/PathManager.js");

const webInit = function () {
    //server是BaseServer类的实例
    PathManager.addPath("GET", "/", function (server) {
        var page = `<!doctype html>
        <html>
            <head>
            </head>
            <body>
                <p>Hello World!</p><br>
                <a href="/test1">/test1</a>
            </body>
        </html>
        `;
        server.sendTextPage(page);
    });

    PathManager.addPath("GET", "/test1", function (server) {
        server.sendFile("./project.json")
    });
}

module.exports = webInit;