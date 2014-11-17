describe('menu', function () {
    var $menu;
    var $menuProvider;

    beforeEach(function () {
        module('songster.menu.services', function (_$menuProvider_) {
            $menuProvider = _$menuProvider_;
        });

        // Kickstart the injectors previously registered with calls to angular.mock.module
        inject(function () {
        });

        expect($menuProvider).toBeDefined();
    });

    beforeEach(inject(function (_$menu_) {
        $menu = _$menu_;
        expect($menu).toBeDefined();
    }));

    describe('"unknown_menu"', function () {
        it('should be an undefined', function () {
            var menu = $menu.getMenu('unknown_menu');
            expect(menu).toBeUndefined();
        });
    });

    describe('"main"', function () {

        beforeEach(function () {
            $menuProvider.addMenu('main', 'Main Menu');
        });

        it('should be defined', function () {
            var menu = $menu.getMenu('main');
            expect(menu).toBeDefined();
        });

        it('should have the right properties', function () {
            var menu = $menu.getMenu('main');
            expect(menu.getId()).toBe('main');
            expect(menu.getTitle()).toBe('Main Menu');
        });

        it('should be empty on creation', function () {
            var menu = $menu.getMenu('main');
            var entries = menu.getEntries();
            expect(entries).toBeDefined();
            expect(entries.length).toEqual(0);
        });

        describe('with entries', function () {

            beforeEach(function () {
                $menuProvider.addMenuEntry('main', 'Home', 'fa-home', 'home');
                $menuProvider.addMenuEntry('main', 'About', 'fa-about', 'about');
            });

            it('should have the right amount of entries', function () {
                var menu = $menu.getMenu('main');
                var entries = menu.getEntries();
                expect(entries).toBeDefined();
                expect(entries.length).toEqual(2);
            });

            it('should have correct properties', function () {
                var menu = $menu.getMenu('main');
                var entries = menu.getEntries();
                var entry1 = entries[0];
                expect(entry1.getTitle()).toEqual('Home');
                expect(entry1.getIcon()).toEqual('fa-home');
                expect(entry1.getRoute()).toEqual('home');
                var entry2 = entries[1];
                expect(entry2.getTitle()).toEqual('About');
                expect(entry2.getIcon()).toEqual('fa-about');
                expect(entry2.getRoute()).toEqual('about');
            });
        });

        describe('with prioritized entries', function () {

            beforeEach(function () {
                $menuProvider.addMenuEntry('main', 'Home', 'fa-home', 'home', 45);
                $menuProvider.addMenuEntry('main', 'About', 'fa-about', 'about', undefined);
                $menuProvider.addMenuEntry('main', 'Contact', 'fa-contact', 'contact', 10);
            });

            it('should be ordered by priority desc', function () {
                var menu = $menu.getMenu('main');
                var entries = menu.getEntries();
                var entry1 = entries[0];
                expect(entry1.getTitle()).toEqual('Home');
                var entry2 = entries[1];
                expect(entry2.getTitle()).toEqual('Contact');
                var entry3 = entries[2];
                expect(entry3.getTitle()).toEqual('About');
                expect(entry3.getPriority()).toEqual(0);
            });

            it('should prioritize undefined priorities with 0', function () {
                var menu = $menu.getMenu('main');
                var entries = menu.getEntries();
                var entry = _.find(entries, {'title': 'About'});
                expect(entry.getPriority()).toEqual(0);
            });
        });
    });
});