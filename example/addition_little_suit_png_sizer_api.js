'use strict'

const express = require('express')
const basic_auth = require('express-basic-auth')
const body_parser = require('body-parser')
const app = express()
var multer  = require('multer')
var storage = multer.memoryStorage()
const readChunk = require('read-chunk')
const imageType = require('image-type')
const acceptableExtensions = ["png"]

var upload = multer({ storage: storage, limits: {fileSize: 30001}}).single('file');

app.use(basic_auth({
    users: {"basic": "auth"}
}))

app.set('json spaces', 2);
app.use(body_parser.json())

app.get('/list_numbers', function (req, res) {
    let result_suit = [];
    let base = req.query.base;
    while (result_suit.length < 3) {
        result_suit.push(base * req.query.multiple)
        ++base;
    }
    res.status(200).json({"suit": result_suit})
}       )

app.post('/number', function(req, res) {
    res.status(200).json({"result": 200 + req.body.number});
})

app.post('/size_png', function (req, res) {
    upload(req, res, function (err) {
	if (err instanceof multer.MulterError) {
	    res.status(403).json({"error": err.message});
	    return
	} else if (err) {
	    res.status(500).json({"error": err})
	    return
	}
	const ext = req.file.originalname.split('.').pop();
	const mimeorigin = req.file.mimetype;
	const obj = imageType(req.file.buffer)
	if (!obj || !ext || acceptableExtensions.indexOf(obj.ext) === -1 || ext !== obj.ext || obj.mime !== mimeorigin)
	{
            const error = {
		"numeric": 0,
		"litteral": "please, be sure to size a real png file"
            }
	    res.status(403).json({"error": error});
	}
	else
	{
	    const size = {
		"size": req.file.size
            }
	    res.status(200).json({"size": size});
	}
    })
})

module.exports = app
