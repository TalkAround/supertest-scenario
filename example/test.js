'use strict'

const app = require('./addition_little_suit_png_sizer_api')
const supertest_scenarizer = require('../')
const check_list_numbers = require('./scenarios/little_suit/validator')
const check_number_addition = require('./scenarios/addition/validator')
const check_upload_png = require('./scenarios/png_sizer/validator')
const api_credentials = {
    'login': "basic",
    'passwd': 'auth'
}

const gets_scenarizer = new supertest_scenarizer('/list_numbers', supertest_scenarizer._simple_get, api_credentials, check_list_numbers)
describe('GET /list_numbers', function() {
    const array_suit = require("./scenarios/little_suit/scenario.json")
    const suit = array_suit[0];
    const suits = require("./scenarios/little_suit/scenarios.json")
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
    const array_number = require("./scenarios/addition/scenario.json")
    const number = array_number[0];
    const numbers = require("./scenarios/addition/scenarios.json")
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
    const pngs = require("./scenarios/png_sizer/scenarios.json")
    for (let index = 0; index < pngs.length; ++index) {
        it (pngs[index].name, function(done) {
        uploads_scenarizer.run_one(app, pngs[index], done)
        })
    }
})
