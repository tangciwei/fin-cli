 /**
 * @file user
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/12
 */

'use strict';

const FS = require('fs');
const PATH = require('path');

const HOME_PATH = require('os').homedir();

const LOG = require('../util/log');

const FIN_RC_LOCAL_DATA_PATH = PATH.join(HOME_PATH, '/.finrc');

const DEFAULT_RC_DATA = {
    email: 'fin',
    author: 'fin',
    project: {
        name: 'fin',
        id: '-fin-'
    }
};

exports.path = HOME_PATH;

let getRcData = function () {
    let data = DEFAULT_RC_DATA;

    try {
        let text = FS.readFileSync(FIN_RC_LOCAL_DATA_PATH, {encoding: 'utf8', flag: 'r'});

        data = JSON.parse(text);
    }
    catch (e) {}

    return data
};
let upgradeRC = (data = {}) => {
    let oldUserData = getRcData();
    let newUserData = Object.assign({}, DEFAULT_RC_DATA, oldUserData, data);

    FS.writeFileSync(FIN_RC_LOCAL_DATA_PATH, JSON.stringify(newUserData), {encoding: 'utf8', flag: 'w'});

    LOG('User information configure completed!', 'green');
    LOG(`\n ${JSON.stringify(newUserData)} \n`, 'white');
};

exports.finrc = FIN_RC_LOCAL_DATA_PATH;

exports.getRcData = getRcData;

exports.upgradeRC = upgradeRC;

exports.createRC = data => {
    if (!data) {
     data = DEFAULT_RC_DATA;
    }

    upgradeRC(data);
};
