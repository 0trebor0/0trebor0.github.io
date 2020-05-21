var app = {
	windowOnresize:[],
	windowOnload:[],
	windowOnclose:[]
};
window.onload = ()=>{
    app.windowOnload.forEach( ( d )=>{
        d()
    } );
}
window.onresize = ()=>{
    app.windowOnresize.forEach( (d)=>{
        d();
    } );
}
window.onbeforeunload = ()=>{
    app.windowOnclose.forEach( (d)=>{
        d();
    } );
}
app.windowOnload[0] = ()=>{
	app.urlparam = new URLSearchParams( location.search );
	app.urlHash = location.hash.slice(1);
    console.log("app.windowOnresize.push(FUNCTION)");
    console.log("app.windowOnload.push(FUNCTION)");
    console.log("app.windowOnclose.push(FUNCTION)");
    document.querySelectorAll( 'input[type=text], input[type=password]' ).forEach( ( input )=>{
        if( input !== null ){
            input.autocomplete = "off";
        }
    } );
}
element = ( id = null, from = null )=>{
    var e = null;
    if( id !== null ){
        e = document.querySelector( id );
    }else if( id !== null || from !== null ){
        e = from.querySelector( id );
    }
    if( e !== null ){
        e.child = ( id )=>{
            return element( id, e );
        };
    }
    return e;
}
app.video = ( id = null,json = null)=>{
	let player;
	if( document.querySelector( id ) ){
		player = document.querySelector( id );
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata(json);
			navigator.mediaSession.setActionHandler('play',()=>{
				player.play();
			});
			navigator.mediaSession.setActionHandler('pause',()=>{
				player.pause();
			});
			navigator.mediaSession.setActionHandler('seekbackward', ()=>{
				player.currentTime = Math.max(player.currentTime - 10, 0);
			});
			navigator.mediaSession.setActionHandler('seekforward', ()=>{
				player.currentTime = Math.min(player.currentTime + 10, player.duration);
			});
		}
		if( "src" in json ){
			player.src = json.src;
		}
		if( "artwork" in json && json.artwork[0].src ){
			player.poster = json.artwork[0].src;
		}
		if( "stream" in json && json.stream == true ){
			player.stream = player.captureStream();
		}
	} else {
		console.log("can't find ",id);
	}
	return player;
}
app.audio = ( id = null,json = null)=>{
	let player;
	if( document.querySelector( id ) ){
		player = document.querySelector( id );
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata(json);
			navigator.mediaSession.setActionHandler('play',()=>{
				player.play();
			});
			navigator.mediaSession.setActionHandler('pause',()=>{
				player.pause();
			});
			navigator.mediaSession.setActionHandler('seekbackward', ()=>{
				player.currentTime = Math.max(player.currentTime - 10, 0);
			});
			navigator.mediaSession.setActionHandler('seekforward', ()=>{
				player.currentTime = Math.min(player.currentTime + 10, player.duration);
			});
		}
		if( "src" in json ){
			player.src = json.src;
		}
		if( "stream" in json && json.stream == true ){
			player.stream = player.captureStream();
		}
	} else {
		console.log("can't find ",id);
	}
	return player;
}
class Github{
    constructor( username = null ){
        this.url = "https://api.github.com";
        this.repos = {};
        this.user = {};
        this.username = username;
    }
    async getRepos(){
        this.repos = await fetch( this.url+"/users/"+this.username+"/repos" );
        this.repos = await this.repos.json();
    }
    async getUser(){
        this.user = await fetch( this.url+"/users/"+this.username);
        this.user = await this.user.json();
    }
}
class Peers{
    constructor( config = null ){
        this.peers = {};
        this.iceServers = {};
        if( config === null ){
            this.iceServers = { "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]};
        } else {
            this.iceServers = config;
        }
    }
    new( name ){
        console.log( "creating peer for "+name );
        this.peers[ name ] = new RTCPeerConnection( this.iceServers );
        this.peers[ name ].userid = name;
        this.onConnectionStateChange( name );
        this.onIceConnectionStateChange( name );
        this.onIceGatheringStateChange( name );
        this.onSignalingStateChange( name );
        return this.peers[ name ];
    }
    close( name = null ){
        if( name === null){
            for( x in this.peers ){
                if( this.peers[x] ){
                    this.peers[x].close();
                }
            }
        } else if( this.peers[name] ){
            this.peers[ name ].close();
        }
    }
    onNegotiationNeeded( name, callback = null ){
        this.peers[ name ].onnegotiationneeded = ()=>{
            if( callback !== null ){
                callback();
            }
        }
    }
    createOffer( name, callback = null ){
        console.log( "creating offer for "+name );
        this.peers[ name ].createOffer( { offerToReceiveAudio: 1, offerToReceiveVideo: 1 } ).then( ( offer )=>{
            console.log( "create offer success" );
            this.peers[ name ].setLocalDescription( offer );
            if( callback !== null ){
                callback( offer );
            }
        } ).catch( ( err )=>{
            console.log( err );
        } );
    }
    onSignalingStateChange( name, callback = null ){
        if( callback === null ){
            this.peers[ name ].onsignalingstatechange = ( e )=>{
                console.log( name+" SignalingStateChange "+this.peers[ name ].iceGatheringState );
                switch(this.peers[ name ].iceGatheringState) {
                    case "have-local-pranswer":
                    break;
                }
            }
        } else {
            this.peers[ name ].onsignalingstatechange = ( e )=>{
                console.log( name+" SignalingStateChange "+this.peers[ name ].iceGatheringState );
                if( callback !== null ){
                    callback( e );
                }
            }
        }
    }
    onIceGatheringStateChange( name, callback = null ){
        if( callback === null ){
            this.peers[ name ].onicegatheringstatechange = (e)=>{
                console.log( name+" onIceGatheringStateChange "+this.peers[ name ].iceGatheringState );
                switch(this.peers[ name ].iceGatheringState) {
                    case "new":
                    break;
                    case "complete":
                    break;
                    case "gathering":
                        //this.peers[ name ].restartIce();
                    break;
                  }
            }
        } else {
            this.peers[ name ].onicegatheringstatechange = (e)=>{
                console.log( name+" onIceGatheringStateChange "+this.peers[ name ].iceGatheringState );
                if( callback !== null ){
                    callback( e );
                }
            }
        }
    }
    onIceConnectionStateChange( name, callback = null ){
        if( callback === null ){
            this.peers[ name ].oniceconnectionstatechange = (e)=>{
                console.log( name+" onIceConnectionStateChange "+this.peers[ name ].iceConnectionState );
                switch(this.peers[ name ].iceConnectionState) {
                    case"failed":
                    break;
                    case"disconnected":
                    break;
                    case"closed":
                    break;
                }
            }
        } else {
            this.peers[ name ].oniceconnectionstatechange = ( e )=>{
                console.log( name+" onIceConnectionStateChange "+this.peers[ name ].iceConnectionState );
                if( callback !== null ){
                    callback( e );
                }
            }
        }
    }
    onConnectionStateChange( name, callback = null ){
        if( callback === null ){
            this.peers[ name ].onconnectionstatechange = (e)=>{
                console.log( name+" onConnectionStateChange "+this.peers[ name ].connectionState );
                switch(this.peers[ name ].connectionState) {
                    case "connected":
                    break;
                    case "disconnected":
                        console.log( 'peer '+name+" disconnected" );
                        this.close( name );
                    case "failed":
                        console.log( 'peer '+name+" failed connection" );
                        //this.peers[ name ].close();
                        this.peers[ name ].restartIce();
                    break;
                    case "closed":
                        console.log( 'peer '+name+" closed connection" );
                        this.close( name );
                        //delete this.peers[ name ];
                    break;
                }
            }
        } else {
            this.peers[ name ].onconnectionstatechange = ( e )=>{
                console.log( name+" onConnectionStateChange "+this.peers[ name ].connectionState);
                if( callback !== null ){
                    callback( e );
                }
            }
        }
    }
    onIceCandidate( name, callback = null ){
        this.peers[ name ].onicecandidate = ( event )=>{
            console.log( name+" IceCandidate" );
            if( event.candidate ){
                if( callback !== null ){
                    callback( event.candidate );
                }
            }
        }
    }
    setOffer( name, offer ){
        console.log( "set offer for "+name );
        this.peers[ name ].setRemoteDescription( new RTCSessionDescription( offer ) ).catch( ( err )=>{
            console.log( err );
        } );
    }
    setIceCandidate( name, candidate ){
        console.log( "setIceaCandidate for "+name );
        this.peers[ name ].addIceCandidate( new RTCIceCandidate( candidate ) ).catch( ( err )=>{
            console.log( err );
        } );
    }
    createAnswer( name, callback = null ){
        console.log( "creating answer for "+name );
        this.peers[ name ].createAnswer().then( ( answer )=>{
            console.log( "create answer success");
            this.peers[ name ].setLocalDescription( answer ).catch( ( err )=>{
                console.log( err );
            } );
            if( callback !== null ){
                callback( answer );
            }
        }).catch( ( err )=>{
            console.log( err );
        } );
    }
    setAnswer( name, answer ){
        console.log( "set answer for "+name );
        this.peers[ name ].setRemoteDescription( new RTCSessionDescription( answer ) ).catch( ( err )=>{
            console.log( err );
        } );
    }
    getStreamTracks( name, stream ){
        //console.log( "got media stream for "+name );
        stream.getTracks().forEach( ( track )=>{
            console.log( "Tracks ",track );
            this.peers[ name ].addTrack(track, stream );
        } );
    }
    onStreamTracks( name, callback = null ){
        this.peers[ name ].ontrack = ( event )=>{
            console.log( "ontrack "+name,event );
            if( callback !== null ){
                callback( event.streams );
            }
        }
    }
}