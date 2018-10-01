'use strict'

const request = require('supertest')

const simple_get = 0;
const simple_post = 1;
const upload_post = 2;

class supertest_scenario {
    constructor(endpoint, type, api_credentials, scenario) {
	this.endpoint_name = endpoint
	this.type = type
	this.api_credentials = api_credentials
	this.scenario_fct = scenario
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

    run_get(app, scenario_content, done) {
	    request(app)
		.get(this.endpoint_name)
		.query(scenario_content.query_strings)
		.auth(this.api_credentials.login, this.api_credentials.passwd)
		.expect(scenario_content.http_error_code)
		.expect('Content-Type', /json/)
	    .end((err, res) => this.scenario_fct(err, res, scenario_content, done))
    }

    run_simple_post(app, scenario_content, done) {
        request(app)
		.post(this.endpoint_name)
		.set('Content-Type', 'application/json')
	    .expect('Content-Type', /json/)
	    .auth(this.api_credentials.login, this.api_credentials.passwd)
	    .send(scenario_content.payload)
	    .expect(scenario_content.http_error_code)
	    .end((err, res) => this.scenario_fct(err, res, scenario_content, done))
    }

    run_upload_post(app, scenario_content, done) {
		request(app)
		.post(this.endpoint_name)
		.type('file')
		.field('name', 'filename')
	    .expect('Content-Type', /json/)
		.auth(this.api_credentials.login, this.api_credentials.passwd)
		.attach("file", scenario_content.payload.filepath)
		.expect(scenario_content.http_error_code)
	    .end((err, res) => this.scenario_fct(err, res, scenario_content, done))
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
