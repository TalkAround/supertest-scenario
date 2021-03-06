'use strict'

const request = require('supertest')
const assert = require('assert')

const simple_get = 0;
const simple_post = 1;
const upload_post = 2;

function generic_assert_validator(err, res, scenario, done) {
	if (err)
		return done(err)
	assert.deepStrictEqual(res.body, scenario.res_expected)
	done()
}

class supertest_scenario {
    constructor(endpoint, type, api_credentials, external_validator) {
	this.endpoint_name = endpoint
	this.type = type
	this.api_credentials = api_credentials
	this.external_validator = null;
	if (external_validator)
		this.external_validator = external_validator
    }

    static get _simple_get() {
	return (simple_get)
    }

    static get _simple_post() {
	return (simple_post)
    }

    static get _upload_post() {
	return (upload_post)
    }

	internal_validator(err, res, scenario_content, done) {
		if (this.external_validator !== null)
			return this.external_validator(err, res, scenario_content, done)
		else {
			return generic_assert_validator(err, res, scenario_content, done)
		}
	}

    run_get(app, scenario_content, done) {
	request(app)
	    .get(this.endpoint_name)
	    .query(scenario_content.query_strings)
	    .auth(this.api_credentials.login, this.api_credentials.passwd)
	    .expect(scenario_content.http_error_code)
	    .end((err, res) => this.internal_validator(err, res, scenario_content, done))
    }

    run_simple_post(app, scenario_content, done) {
        request(app)
	    .post(this.endpoint_name)
	    .set('Content-Type', 'application/json')
	    .auth(this.api_credentials.login, this.api_credentials.passwd)
	    .send(scenario_content.payload)
	    .expect(scenario_content.http_error_code)
	    .end((err, res) => this.internal_validator(err, res, scenario_content, done))
    }

    run_upload_post(app, scenario_content, done) {
	request(app)
	    .post(this.endpoint_name)
	    .type('file')
	    .field('name', 'filename')
	    .auth(this.api_credentials.login, this.api_credentials.passwd)
	    .attach("file", scenario_content.payload.filepath)
	    .expect(scenario_content.http_error_code)
	    .end((err, res) => this.internal_validator(err, res, scenario_content, done))
    }
    
    run_one(app, scenario_content, done) {
	switch (this.type) {
	case supertest_scenario._simple_get:
	    this.run_get(app, scenario_content, done)
	    break
	case supertest_scenario._simple_post:
	    this.run_simple_post(app, scenario_content, done)
	    break
	case supertest_scenario._upload_post:
	    this.run_upload_post(app, scenario_content, done)
	    break
	}
    }
}

module.exports = supertest_scenario
