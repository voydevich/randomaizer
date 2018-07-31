var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');

var fileName = './resources/saveData.json'
/* GET home page. */
router.get('/', function (req, res, next) {
    jsonfile.readFile(fileName, function (err, data) {
        if (err) {
            res.status(500).json({
                status: err.stack,
            });
        }
        else {

            res.status(200).json({
                status: "done",
                data: data
            });
        }
    })

    // res.render('index', { title: 'Test' });
    // res
});

router.post('/', function (req, res, next) {
    jsonfile.writeFile(fileName, req.body, function (err) {
        if (err) {
            res.status(500).json({
                status: err.stack,
            });
        }
        else {
            res.status(200).json({
                status: "done"
            });
        }
    });

    // res.render('index', { title: 'Test' });
});

module.exports = router;
