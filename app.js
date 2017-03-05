const {
	app,
	BrowserWindow
} = require( "electron" );

const { join } = require( "path" );
const { open } = require( "zeelib" );
const appUrl = "http://127.0.0.1:9876";

let mainWindow = null;

const createWindow = () => {
	// create the window, with its options
	mainWindow = new BrowserWindow( {
		  "accept-first-mouse": true
		, "auto-hide-menu-bar": true
		, height: 800
		, icon: join( __dirname, "public", "images", "icon.png" )
		, "node-integration": true
		, "title-bar-style": "hidden"
		, width: 1200
	} );

	// open links externally
	mainWindow.webContents.on( "will-navigate", ( e, url ) => {
		if ( !url.includes( appUrl ) ) {
			e.preventDefault();
			open( url );
		}
	} );

	mainWindow.webContents.on( "new-window", ( e, url ) => {
		if ( !url.includes( appUrl ) ) {
			e.preventDefault();
			open( url );
		}
	} );

	// load our app
	mainWindow.loadURL( appUrl );

	// open devtools
	mainWindow.openDevTools();

	// mainWindow.setMenu(null)

	mainWindow.on( "closed", () => {
		mainWindow = null;
	} );
};

app.on( "ready", createWindow );

// stuff below is because OS X is fucking weird
app.on( "window-all-closed", () => {
	if ( process.platform !== "darwin" ) {
		app.quit();
	}
} );

app.on( "activate", () => {
	if ( !mainWindow ) {
		createWindow();
	}
} );
