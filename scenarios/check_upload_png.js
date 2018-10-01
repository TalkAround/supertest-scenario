'use strict'

const assert = require("assert");

module.exports = function(err, res, scenario, done) {
    if (err)
        {
            return done(err)
        }
    if (scenario.error)
        {
            assert.deepStrictEqual(res.body.error, scenario.error);
            return done()
        }
    if (res.body.size < scenario.size.minimum || res.body.size > scenario.size.maximum)
        done("The size of the file is not between the minimum and the maximum described in the scenario")
    done()
}