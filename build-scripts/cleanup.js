const fs = require('fs');
const path = 'node_modules/@types/leaflet';
if (fs.existsSync(path)) {
    try {
        fs.unlinkSync(path)
    } catch (e) {
        console.log(e);
    }
}
