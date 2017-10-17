#!/usr/bin/env node
'use strict';

var AWS = require('aws-sdk');
var cp = require('child_process');
var fs = require('fs');
var ini = require('ini');
var path = require('path');
var bluebird = require('bluebird');
var promisify = bluebird.promisify;
var prompt = require('prompt');

var CREDENTIALS_FILE = path.join(process.env.HOME, '.aws/credentials');
var MFA_ID_FILE = path.join(process.env.HOME, '.aws/mfa_id');
var TOKEN_LIFETIME_SECONDS = 129600; //36hr

var credentialConfig = ini.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));

/* Do the things */
authenticateAws()
    .then(runCommandArgs);


function authenticateAws() {
    console.log('Checking cached credentials...');
    if (credentialsExpired()) {
        return promptMfaToken()
                .then(getCredentials)
                .then(storeCredentials)
                .then(function () {
                    console.log('Credentials Updated.');
                });

    } else {
        console.log('Credentials are still good.');
        return bluebird.resolve();
    }
}

function credentialsExpired() {
    var expiration = credentialConfig.default && credentialConfig.default.expiration;
    if (!expiration) {
        console.log('No credentials found');
        return true;
    } else if (new Date(expiration) < new Date()) {
        console.log('Credentials expired on ' + expiration);
        return true;
    } else {
       return false;
    }
}

function getCredentials(mfaKey) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
        profile: 'master'
    });
    var sts = new AWS.STS();
    var mfaIdentifier = loadMfaIdentifier();
    return promisify(sts.getSessionToken.bind(sts))({
        DurationSeconds: TOKEN_LIFETIME_SECONDS,
        SerialNumber: mfaIdentifier,
        TokenCode: mfaKey,
    }).then(function (response) {
        return response.Credentials;
    });
}

function loadMfaIdentifier() {
    return fs.readFileSync(MFA_ID_FILE, 'utf-8').trim();
}

function promptMfaToken() {
    prompt.start();
    return promisify(prompt.get)('AWS MFA token')
        .then(function(result) {
            return result['AWS MFA token'];
        });
}

function runCommandArgs() {
    var cmd = process.argv.slice(2);
    if (cmd.length > 0) {
        cp.spawnSync(process.argv[2], process.argv.slice(3), {
            stdio: [0, 0, 0]
        });
    }
}

function storeCredentials(credentials) {
    credentialConfig.default = {};
    credentialConfig.default.aws_access_key_id = credentials.AccessKeyId;
    credentialConfig.default.aws_secret_access_key = credentials.SecretAccessKey;
    credentialConfig.default.aws_session_token = credentials.SessionToken;
    credentialConfig.default.expiration = credentials.Expiration.toString();
    fs.writeFileSync(CREDENTIALS_FILE, ini.stringify(credentialConfig));
    return credentials;
}
