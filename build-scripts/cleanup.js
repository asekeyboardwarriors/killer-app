const fs = require('fs');
const path = 'node_modules/@types/heatmap.js/node_modules';

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

fs.appendFileSync('node_modules/@types/leaflet/index.d.ts', 'export interface ILayer {\n' +
    '    onAdd(map: Map): void;\n' +
    '    onRemove(map: Map): void;\n' +
    '}');
if (fs.existsSync(path)) {
    deleteFolderRecursive(path);
}

