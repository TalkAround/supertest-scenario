'use strict'

const assert = require('assert')

module.exports = function(err, res, scenario, done) {
    if (err)
	    return done(err)
    assert.deepStrictEqual(res.body.result, scenario.response.result)
    done()
}
