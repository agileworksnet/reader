//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

//joining path of directory 
const directoryPathStorage = path.join(__dirname, 'storage');

function getDirectoryContent(req, res, next) {

    const files = [];

    function readAllFilesRecursively(directoryPath) {

        fs.readdirSync(directoryPath).forEach((filename) => {
            const filePath = directoryPath + "/" + filename;

            if (fs.statSync(filePath).isFile()) {

                if (filename.match(/^(?!\.).*$/)) {
                    files.push(filePath);                
                }

            } else if (fs.statSync(filePath).isDirectory()) {
                readAllFilesRecursively(filePath);
            }
        });
    }

    // Cargamos los archivos
    readAllFilesRecursively(directoryPathStorage);

    const hostname = req.headers.host;
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${hostname}/read/`;

    // Construimos los objetos de archivo
    res.locals.filenames = files.map(function (filename) {

        return {
            link: baseUrl + btoa(`${directoryPathStorage}/${filename}`),
            filename: filename
        };
    });

    next();

}

function getFileContent(req, res, next) {

    var fileName = atob(req.params.file);

    fs.readFile(fileName, { encoding: 'utf-8' }, (err, data) => {

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
        files: res.locals.filenames,
        hasFiles: res.locals.filenames.length > 0
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

