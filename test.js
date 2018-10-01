'use strict'

const app = require('./index')
const supertest_scenarizer = require('./supertest-scenario')
const check_list_numbers = require('./scenarios/check_list_suit')
const check_number_addition = require('./scenarios/check_number_addition')
const check_upload_png = require('./scenarios/check_upload_png')
const api_credentials = {
    'login': "basic",
    'passwd': 'auth'
}

const gets_scenarizer = new supertest_scenarizer('/list_numbers', supertest_scenarizer._simple_get, api_credentials, check_list_numbers)
describe('GET /list_numbers', function() {
    const array_suit = require("./jsons/gets/list.json")
    const suit = array_suit[0];
    const suits = require("./jsons/gets/lists.json")
    it(suit.name, function (done) {
        gets_scenarizer.run_one(app, suit, done);
    })
    for (let index = 0; index < suits.length; ++index) {
        it(suits[index].name, function(done) {
            gets_scenarizer.run_one(app, suits[index], done)
        })
    }
})


const posts_scenarizer = new supertest_scenarizer('/number', supertest_scenarizer._simple_post, api_credentials, check_number_addition)
describe('POST /number', function() {
    const array_number = require("./jsons/posts/number.json")
    const number = array_number[0];
    const numbers = require("./jsons/posts/numbers.json")
    it(number.name, function(done) {
	posts_scenarizer.run_one(app, number, done)
    })
    for (let index = 0; index < numbers.length; ++index) {
	it(numbers[index].name, function(done) {
	    posts_scenarizer.run_one(app, numbers[index], done)
	})
    }
})

const uploads_scenarizer = new supertest_scenarizer('/size_png', supertest_scenarizer._upload_post, api_credentials, check_upload_png)
describe('UPLOAD /size_png', function() {
    const pngs = require("./jsons/uploads/pngs.json")
    for (let index = 0; index < pngs.length; ++index) {
        it (pngs[index].name, function(done) {
        uploads_scenarizer.run_one(app, pngs[index], done)
        })
    }
})