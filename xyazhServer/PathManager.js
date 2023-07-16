

const TreeNode = function(){
    var self = {};
    self.__this__ = this;
    self.fuc = null;
    self.val = null;
    self.parent = null;
    self.childs = {};
    return self;
}

const PathManager = {};
PathManager.path_dirs = {};
PathManager.D = "*";

PathManager.addPath = function(t,path,fuc){
    path = path.replace("\\","/");
    var h_dir = path.split("/");
    h_dir = h_dir.filter(s => s != "");
    h_dir.push("");
    if(!PathManager.path_dirs[t]){
        PathManager.path_dirs[t] = new TreeNode();
    }
    var in_node = PathManager.path_dirs[t];
    for(var i of h_dir){
        if(i == ""){
            in_node.fuc = fuc;
            break;
        }else if(i in in_node.childs){
            in_node = in_node.childs[i];
        }else{
            var new_node = new TreeNode();
            new_node.parent = in_node;
            new_node.val = i;
            in_node.childs[i] = new_node;
            in_node = new_node;
        }
    }
}

PathManager.findPath = function(path,t){
    path = path.replace("\\","/");
    var h_dir = path.split("/");
    h_dir = h_dir.filter(s => s != "");
    h_dir.push("");
    var r = null;
    var in_node = PathManager.path_dirs[t];
    for(var i of h_dir){
        if(!in_node){
            return null;
        }else if(i == ""){
            r = in_node.fuc;
            break;
        }else if(i in in_node.childs){
            in_node = in_node.childs[i];
        }else if(PathManager.D in in_node.childs){
            in_node = in_node.childs[PathManager.D];
        }else{
            break;
        }
    }
    return r;
}

module.exports = PathManager;