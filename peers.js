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
