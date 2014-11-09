describe( 'menu', function() {
  beforeEach( module( 'songster.menu' ) );

  it( '"main" should be empty on creation', inject( ['$menu', function($menu) {
    var mainMenu = $menu.getMenu('main');
    var entries = mainMenu.getEntries();
    expect(entries).to.be.empty;
  }]));
});