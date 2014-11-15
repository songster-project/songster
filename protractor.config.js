exports.config ={
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs:['./system_tests/*.js'],
    framework:'jasmine',
    capabilities:{
        browserName: 'firefox'
    }
}