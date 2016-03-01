var express = require('express'),
    app = express();
    
// Serve static files
app.use(express.static('./public'));
    
// Create http server
var port = 8080;
app.listen(port, function () {
    console.log('Server listening on port', port);
});