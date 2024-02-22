//requiring path and fs modules
const path = require('path');
const express = require('express');
const app = express();

//joining path of directory 
// joining path of directory 
const directoryPathStorage = path.join(__dirname, 'storage');
const baseUrlPath          = process.env.BASE_URL_PATH || "";
const getFileContent       = require('./src/FileContentMiddleware');
const getDirectoryContent  = require('./src/DirectoryContentMiddleware')(
    directoryPathStorage
);

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.engine('html', require('ejs').renderFile);
app.set("views", __dirname + "/views")

app.get('/', getDirectoryContent, function (req, res) {

    res.render(__dirname + "/views/index.html", {
        basePath: baseUrlPath,
        files: res.locals.filenames,
        hasFiles: res.locals.filenames.length > 0
    });

});

app.get('/read/:file', getFileContent, (req, res) => {
    
    res.render(__dirname + "/views/show.html", {
        basePath: baseUrlPath,
        file: res.locals.file
    });

});

//Iniciando el servidor, escuchando...
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});

