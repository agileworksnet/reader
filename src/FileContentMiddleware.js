const fs = require('fs');

module.exports = function getFileContent(req, res, next) {

    const fileName = atob(req.params.file);

    fs.readFile(fileName, { encoding: 'utf-8' }, (err, data) => {

        if (err) {
            console.log(err);
        }

        res.locals.file = data;

        next();

    });

};