//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

if(!process.env.DIRECTORY_STORAGE_LOG) {
    console.log('DIRECTORY_STORAGE_LOG var is not configured');
    process.exit(1);
}

//joining path of directory 
// const directoryPathStorage = path.join(__dirname, 'storage');
const directoryPathStorage = path.join(__dirname, process.env.DIRECTORY_STORAGE_LOG);

function getDirectoryContent(req, res, next) {
    fs.readdir(directoryPathStorage, function (err, files) {

        var hostname = req.headers.host;
        var protocol = req.protocol;
        var baseUrl  = `${protocol}://${hostname}/read/`;

        if (err) { return next(err); }
        res.locals.filenames = files.map((file) => {
            return {
                link: baseUrl + btoa(`${directoryPathStorage}/${file}`),
                filename: file
            };
        });

        next();
    });
}

function getFileContent(req, res, next) {

    var fileName = atob(req.params.file);

    fs.readFile(fileName, {encoding: 'utf-8'}, (err, data) => {
        
        if (err) {
            console.log(err);
        }

        res.locals.file = data;

        next();

    });

}

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.engine('html', require('ejs').renderFile);
app.set("views", __dirname + "/views")

app.get('/', getDirectoryContent, function (req, res) {

    res.render(__dirname + "/views/log.html", {
        files:  res.locals.filenames
    });

});

app.get('/read/:file', getFileContent, (req, res) => {

    res.render(__dirname + "/views/file.html", {
        file: res.locals.file
    });
    
});

//Iniciando el servidor, escuchando...
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});

