var config = require('../nightwatch.conf.BASIC.js');

module.exports = {
  'Smoke Test': function(browser) {
    browser
      .url('http://emissaryws.herokuapp.com/')
      .waitForElementVisible('body')
      .assert.title('Emissary')
      .end();
  }
};
