FileClassTable = require("./FileClassTable.js");

const IServerHelper = function(){
    var self = {};
    self.getFileContentType = function(file_path){
        ed = "." + file_path.split(".").slice(-1)[0];
        if(ed in FileClassTable.TABLE){
            return FileClassTable.TABLE[ed];
        }else{
            return "application/octet-stream";
        }
    }
    return self;
}

module.exports = IServerHelper;