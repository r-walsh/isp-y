/**
 * LICENSE MIT
 * (C) Daniel Zelisko
 * http://github.com/danielzzz/node-ping
 *
 * A poor man's ping for node.js
 * It uses UDP_scanning (as node is not able to generate iCPM packets)
 * http://en.wikipedia.org/wiki/Port_scanner#UDP_scanning
 * it may not work correct for hosts that silently drop UDP traffic on their firewall
 * you need at pcap version 0.1.9 or higher
 *
 */

let sys = require( "util" )
	, pcap = require( "pcap" );

const addr = process.argv[ 3 ] || "localhost";
setInterval( () => {
	probe( addr );
}, 1000 );


function probe( addr ) {
	sys.puts( `sending a probe to ${  addr }` );
	const dgram = require( "dgram" );
	const message = new Buffer( "Some bytes" );
	const client = dgram.createSocket( "udp4" );
	client.send( message, 0, message.length, 21111, addr );
	client.close();
}

// create a pcap session
pcap_session = pcap.createSession( process.argv[ 2 ] || "eth0", "" );


// listen for packets, decode them, and feed the simple printer
pcap_session.addListener( "packet", ( raw_packet ) => {
	const packet = pcap.decode.packet( raw_packet );
	if ( packet.link && packet.link.ip && packet.link.ip.saddr == addr ) {
		packet.link && packet.link.ip && sys.puts( `${ packet.link.ip.saddr  } is alive` );
	}
} );

//-------- example ------------------------

