//requiring path and fs modules
const path = require('path');
const express = require('express');
const app = express();

const baseUrlPath     = process.env.BASE_URL_PATH     || "/";
const applicationTitle= process.env.APPLICATION_TITLE || "agileworksnet/reader: read your logs files on the browser";
const applicationName = process.env.APPLICATION_NAME  || "agileworksnet/reader";

const directoryPathStorage = path.join(__dirname, 'storage');
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
        applicationTitle: applicationTitle,
        applicationName: applicationName,
        files: res.locals.filenames,
        hasFiles: res.locals.filenames.length > 0
    });

});

app.get('/read/:file', getFileContent, (req, res) => {
    
    res.render(__dirname + "/views/show.html", {
        basePath: baseUrlPath,
        applicationTitle: applicationTitle,
        applicationName: applicationName,
        file: res.locals.file
    });

});

//Iniciando el servidor, escuchando...
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});

