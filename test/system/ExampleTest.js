describe('Test', function () {
    it('selenium test, login and check if you get redirected to the Home side', function (done) {
        browser.driver.get('http://localhost:3000/login');
        browser.driver.wait(function () {
            return browser.driver.findElement(By.xpath("//button")).isDisplayed();
        }, 10000);
        browser.driver.findElement(By.id("username")).sendKeys('admin');
        browser.driver.findElement(By.id("password")).sendKeys('admin');
        browser.driver.findElement(By.xpath("//button")).click();
        browser.driver.getTitle().then(function (title) {
            expect(title).toEqual('Home | ngBoilerplate');
            done();
        });
    });
    it('protractor test, should change to upload side if you click on upload link at the home side', function () {
        browser.get('http://localhost:3000/app/#/home');
        element(by.xpath('//a[@ui-sref="upload"]')).click();
        expect(browser.getTitle()).toEqual('Upload files | ngBoilerplate');
    });
    it('should fail',function(){
        expect(true).toBeFalsy();
    })
});