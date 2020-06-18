var app = {
	windowOnresize:[],
	windowOnload:[],
	windowOnclose:[]
};
window.onload = ()=>{
    app.urlparam = new URLSearchParams( location.search );
    app.urlHash = location.hash.slice(1);
    console.log(app);
    document.querySelectorAll( 'input[type=text], input[type=password]' ).forEach( ( input )=>{
        if( input !== null ){
            input.autocomplete = "off";
        }
    } );
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
var element = ( id = null, from = null )=>{
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
app.websocket = ( url = null )=>{
    let websocket;
    if( url !== null ){
        if( "WebSocket" in window ){
            websocket = new WebSocket( url );
        } else {
            websocket = {'status':'error','msg':'browser dont support websocket'};
        }
    }
    return websocket;
}
app.video = (json = null)=>{
    let player;
    if(json.id && document.querySelector(json.id)){
        player = document.querySelector(json.id);
    } else if(json.element && json.element.nodeType && json.element.nodeType === 1 ){
        player = json.element;
    } else {
        player = {'status':'error','msg':'cant find valid video'};
    }
    if( player.nodeType && player.nodeType === 1){
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
        if( 'src' in json &&  json.src ){
            player.src = json.src;
        }
        if( "artwork" in json && json.artwork[0].src ){
            player.poster = json.artwork[0].src;
        }
        if( "stream" in json && json.stream == true ){
            player.stream = player.captureStream();
        }
    }
    return player;
}
app.audio = (json = null)=>{
    let player;
    if(json.id && document.querySelector(json.id)){
        player = document.querySelector(json.id);
    } else if(json.element && json.element.nodeType && json.element.nodeType === 1 ){
        player = json.element;
    } else {
        player = {'status':'error','msg':'cant find valid audio'};
    }
    if( player.nodeType && player.nodeType === 1){
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
        if( 'src' in json &&  json.src ){
            player.src = json.src;
        }
        if( "artwork" in json && json.artwork[0].src ){
            player.poster = json.artwork[0].src;
        }
        if( "stream" in json && json.stream == true ){
            player.stream = player.captureStream();
        }
    }
    return player;
}
app.createElement = ( json )=>{
    let u = {};
    if( typeof json == 'object' ){
        if( "name" in json ){
            u = document.createElement( json.name );
            if( "inside" in json ){
                if( json.inside.nodeType && json.inside.nodeType === 1 ){
                    json.inside.appendChild( u );
                } else if( document.querySelector( json.inside ) ){
                    document.querySelector(  json.inside ).appendChild( u );
                } else {
                    return {'type':'error','msg':'cant find '+json.inside};
                }
            } else {
                //Adding to Body
                document.body.appendChild( u );
            }
            if( json.class && json.class.length > 0){
                //Loop to add class
                json.class.forEach((c)=>{
                    u.classList.add(c);
                });
            }
            if( json.body && typeof json.body == 'string' ){
                u.innerHTML = json.body;
            } else if( json.body && typeof json.body == 'object' && json.body.length > 0 ){
                json.body.forEach((b)=>{
                    b.inside = u;
                    app.createElement(b);
                });
            }
            if( json.id ){
                //Add Id To element
                u.id = json.id;
            }
            if( json.onclick && typeof json.onclick == 'function'){
                //Add onclick event
                u.onclick = json.onclick;
            }
            if( json.src ){
                //Add src to element
                u.src = json.src;
            }
            if( json.height ){
                //Add height to element
                u.height = json.height;
            }
            if( json.width ){
                //Add width to element
                u.width = json.width;
            }
            if( json.alt ){
                //Add alt to element
                u.alt = json.alt;
            }
            if( json.oncreate && typeof json.oncreate == 'function' ){
                //Run function on element create
                json.oncreate(u);
            }
            return u;
        } else {
            return {'type':'error','msg':'Missing Name'};
        }
    } else {
        return {'type':'error','msg':'not valid json'};
    }
}
app.isJson = ( data )=>{
	try{
		JSON.parse( data );
	}catch( data ){
		return false;
	}
	return true;
}
app.github = ( username = null )=>{
    let h = {"api":"https://api.github.com"};
    if( username == null ){
        return {'status':'error','msg':'Missing Username'};
    } else {
        h.repos = fetch( h.api+"/users/"+username+"/repos" ).then(res=>res.json());
        h.user = fetch( h.api+"/users/"+username ).then(res=>res.json());
        /* EXAMPLE
        app.github('username').user.then( d=>{
            console.log(d);
        });
        app.github('username').repos.then( d=>{
            console.log(d);
        });
        */
    }
    return h;
}
//START, NEED TO TEST THIS
// app.peer = ( json = null )=>{
//     let u;
//     let iceServers = { "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]};
//     if( json == null ){
//         //Automatic Setup
//     } else if( "iceservers" in json ){
//         //Custom Setup
//         u = new RTCPeerConnection( json.iceServers );
//     }
// }//END
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