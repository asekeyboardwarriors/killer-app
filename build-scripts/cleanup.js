const fs = require('fs');
const path = './node_modules/\@types/leaflet';
if (fs.existsSync(path)) {
    fs.unlinkSync(path)
}
