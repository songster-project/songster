/*describe('Event Songs', function () {
    beforeEach(function () {
        browser.driver.get('http://localhost:3000/login');
        browser.driver.wait(function () {
            return browser.driver.findElement(By.xpath("//button")).isDisplayed();
        }, 10000);
        browser.driver.findElement(By.id("username")).sendKeys('user2');
        browser.driver.findElement(By.id("password")).sendKeys('user2');
        browser.driver.findElement(By.xpath("//button")).click();
    });
    afterEach(function () {
        browser.driver.get('http://localhost:3000/logout');
    });
    it('Events Songs should be displayed on event.', function () {
        browser.get('http://localhost:3000/');
        element(by.xpath('//a[@ui-sref="event-songs"]')).click();
        element(by.xpath('//input[@id="inputEventId"]')).sendKeys('5489e2892b6671a414dcabbd');
        element(by.xpath('//button[@id="getEventSongsButton"]')).click();
        element(by.xpath('//button[@id="getEventSongsButton"]')).click();

        browser.driver.wait(function () {
            return browser.driver.findElement(By.xpath('//table[@id="EventSongsTableCurrentSong"]/tbody/tr[2]')).isDisplayed();
        }, 10000);

        var el;
        el = element(by.xpath('//table[@id="EventSongsTableLastSongs"]/tbody/tr[2]/td[1]'));
        expect(el.getText()).toEqual('Meet The Enemy');
        el = element(by.xpath('//table[@id="EventSongsTableLastSongs"]/tbody/tr[3]/td[1]'));
        expect(el.getText()).toEqual('Contrails');
        el = element(by.xpath('//table[@id="EventSongsTableLastSongs"]/tbody/tr[4]/td[1]'));
        expect(el.getText()).toEqual('Know Me');
        el = element(by.xpath('//table[@id="EventSongsTableLastSongs"]/tbody/tr[5]/td[1]'));
        expect(el.getText()).toEqual('Meet The Enemy');
        el = element(by.xpath('//table[@id="EventSongsTableLastSongs"]/tbody/tr[6]/td[1]'));
        expect(el.getText()).toEqual('Contrails');

        el = element(by.xpath('//table[@id="EventSongsTableCurrentSong"]/tbody/tr[2]/td[1]'));
        expect(el.getText()).toEqual('Know Me');

        el = element(by.xpath('//table[@id="EventSongsTableNextSongs"]/tbody/tr[2]/td[1]'));
        expect(el.getText()).toEqual('Meet The Enemy');
        el = element(by.xpath('//table[@id="EventSongsTableNextSongs"]/tbody/tr[3]/td[1]'));
        expect(el.getText()).toEqual('Contrails');
        browser.get('http://localhost:3000/');
        expect(browser.getTitle()).toEqual('Home | ngBoilerplate');
    });
    it('no error should occur if event is empty', function () {
        browser.get('http://localhost:3000/');
        element(by.xpath('//a[@ui-sref="event-songs"]')).click();
        element(by.xpath('//input[@id="inputEventId"]')).sendKeys('5489e22a2b6671a414dcab8f');
        element(by.xpath('//button[@id="getEventSongsButton"]')).click();

        var el;
        try {
            el = element(by.xpath('//table[@id="EventSongsTableLastSongs"]/tbody/tr[2]/td'));
            fail();
        } catch (err) {

        }

        el = element(by.xpath('//table[@id="EventSongsTableCurrentSong"]/tbody/tr[2]/td'));
        expect(el.getText()).toEqual('');

        try {
            el = element(by.xpath('//table[@id="EventSongsTableNextSongs"]/tbody/tr[2]/td'));
            fail();
        } catch (err) {

        }

        browser.get('http://localhost:3000/');
        expect(browser.getTitle()).toEqual('Home | ngBoilerplate');
    });
});*/