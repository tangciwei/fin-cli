/**
 * @file batchCreatePage
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/7
 */

'use strict';

require('console.table');

const FS = require('fs');
const PATH = require('path');

const FSE = require('fs-extra');

const STRING = require('string');

const LOG = require('../util/log');

const GET_PAGE_ENV = require('../util/getPageEnv');

const READ_PROJECT_YAML = require('../util/readProjectConfigYaml');

let batchCreatePage = (list, dirPath, createPage, option) => {
    let pageTrace = [];

    if (Array.isArray(list)) {
        list.forEach(item => {
            if (!item.name) {
                LOG('✖ Page `name` does not exist!', 'red');
                return false;
            }

            const START = +(new Date());

            let {name, title} = item;
            let pageName = STRING(item.name).dasherize().s;
            let data = Object.assign(
                    {},
                    option,
                    {title},
                    {type: option.extra, createType: 'batch', overwrite: false}
                );
            let alias = STRING(name).camelize().s;

            const ENV = GET_PAGE_ENV(pageName, dirPath);

            createPage(Object.assign({}, data, {ENV}, {name: pageName, alias, targetDir: dirPath}));
            pageTrace.push({'Page name': pageName, 'Consumption time': `${+(new Date())- START}ms`});
        });
    }

    return pageTrace;
};

module.exports = (createPage, option) => {
    const START = + (new Date());
    const CWD = process.cwd();
    const INDEX_DOC = READ_PROJECT_YAML(CWD);

    let keyMap = Object.keys(INDEX_DOC);

    if (keyMap === 0) {

        LOG('`index.yml` has some error!', 'fail');
    }

    let pagesMessage = [];

    Object.keys(INDEX_DOC).forEach(key => {
        let dirName = STRING(key).dasherize().s;
        let dirPath = PATH.join(CWD, 'page', dirName);

        if (!FS.existsSync(dirPath)) {
            FSE.ensureDirSync(dirPath);
        }

        let page = batchCreatePage(INDEX_DOC[key], dirPath, createPage, option);

        pagesMessage = pagesMessage.concat(page);
    });

    LOG(`Total: ${pagesMessage.length} pages was created, Take ${+(new Date) - START}ms.`, 'green');

    LOG('Batch generation completed! \n', 'success');
};
