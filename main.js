"ui";

XyazhServer = require("./xyazhServer/__init__.js");
webInit = require("./webInit.js");

webInit();


ui.layout(
    <vertical>
        <webview id="web" h="*"></webview>
    </vertical>
)
ui.web.getSettings().setJavaScriptEnabled(true);
xya_server = new XyazhServer();
threads.start(function(){
    xya_server.run();
});

const tryLoadUrl = function(){
    if(xya_server.is_running){
        var port = xya_server.port;
        ui.web.loadUrl(`http://127.0.0.1:${port}/`);
    }else{
        setTimeout(tryLoadUrl,100);
    }
}
tryLoadUrl();