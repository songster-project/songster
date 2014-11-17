angular
    .module('songster.menu.services')
    .provider('$menu', MenuProvider);

/**
 * A Menu
 * @param title {String} title of the menu
 * @param id {String} unique identifier of the menu
 * @param priority {Number} priority number
 * @constructor
 */
function Menu(id, title, priority) {
    var _id = id;
    var _title = title;
    var _priority = _.isNumber(priority) ? priority : 0;
    var _entries = [];

    this.getId = function () {
        return _id;
    };
    this.getTitle = function () {
        return _title;
    };
    this.addEntry = function (entry) {
        return _entries.push(entry);
    };
    this.getPriority = function () {
        return _priority;
    };
    this.getEntries = function () {
        // return the entries with the highest priority on top
        return _.sortBy(_entries, function (entry) {
            return entry.getPriority() * -1;
        });
    };
}

/**
 * A Menu Entry
 * @param title {String} title of the menu entry
 * @param icon {String} an icon for the entry
 * @param route {String} route for the menu entry
 * @constructor
 */
function MenuEntry(title, icon, route) {
    var _title = title;
    var _route = route;
    var _icon = icon;

    this.getTitle = function () {
        return _title;
    };
    this.getIcon = function () {
        return _icon;
    };
    this.getRoute = function () {
        return _route;
    };
}

/**
 * A Menu Bar
 * @constructor
 */
function MenuBar() {
    var _menus = {};

    this.addMenu = function addMenu(menu) {
        _menus[menu.getId()] = menu;
    };
    this.getMenu = function getMenu(menuId) {
        return _menus[menuId];
    };
}

function MenuProvider() {
    var _menuBar = new MenuBar();

    this.addMenu = function addMenu(menuId, title) {
        _menuBar.addMenu(new Menu(menuId, title));
    };

    this.addMenuEntry = function addMenuEntry(menuId, title, icon, route, priority) {
        var menu = _menuBar.getMenu(menuId);
        if (!!menu) {
            menu.addEntry(new MenuEntry(title, icon, route, priority));
        }
    };

    this.$get = function () {
        return _menuBar;
    };
}