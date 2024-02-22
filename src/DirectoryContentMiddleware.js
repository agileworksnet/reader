const fs   = require('fs');
const path = require('path');

module.exports = function(directoryPathStorage) {

    return function (req, res, next) {

        const files = [];
    
        function readAllFilesRecursively(directoryPath) {
    
            fs.readdirSync(directoryPath, { pattern: '*.log' })
                .forEach((filename) => {
                    
                    const filePath = directoryPath + "/" + filename;
                    
                    if (fs.statSync(filePath).isFile()) {
    
                        // Exclude dotFiles
                        if (filename.match(/^(?!\.).*$/)) {
                            if(filename.endsWith('.log')) {
                                files.push(filePath);
                            }
                        }
    
                    } else if (fs.statSync(filePath).isDirectory()) {
                        readAllFilesRecursively(filePath);
                    }
    
                });
        }
    
        // Cargamos los archivos
        readAllFilesRecursively(directoryPathStorage);
    
        // Construimos los objetos de archivo
        res.locals.filenames = files.map(function (filePath) {
    
            const fileStats = fs.statSync(filePath);
            const fileName = path.basename(filePath);
    
            return {
                link: 'read/' + btoa(filePath),
                name: fileName,
                path: filePath,
                ctime: fileStats.ctime
            };
    
        });
    
        // Ordenar archivos por orden alfabético
        res.locals.filenames.sort((a, b) => {
            return b.ctime - a.ctime;
        });
    
        next();
    
    }

};