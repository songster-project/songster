exports.config ={
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs:['./test/system/**/*.js'],
    framework:'jasmine',
    capabilities:{
        browserName: 'firefox'
    }
}