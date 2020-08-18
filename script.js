var app = {windowOnload:[],windowOnresize:[],windowOnclose:[]};
window.onload = (e)=>{
    app.urlHash = location.hash.slice(1);
    document.querySelectorAll( 'input[type=text], input[type=password]' ).forEach( ( input )=>{
        if( input !== null ){
            input.autocomplete = "off";
        }
    } );
    app.windowOnload.forEach( ( d )=>{
        d(e);
    } );
};
window.onbeforeunload = (e)=>{
    app.windowOnclose.forEach( (d)=>{
        d(e);
    } );
};
window.onresize = (e)=>{
    app.windowOnresize.forEach( (d)=>{
        d(e);
    } );
};
app.onready = ( f )=>{
    app.windowOnload.push( f );
}
app.onclose = ( f )=>{
    app.windowOnclose.push( f );
}
app.onresize = ( f )=>{
    app.windowOnresize.push( f );
}
app.search = (id)=>{
    if( document.querySelectorAll( id ).length > 0 ){
        return document.querySelectorAll( id );
    } else {
        return false;
    }
}
app.isJson = ( json )=>{
    try{
        JSON.parse( json );
    }catch( err ){
        return false;
    }
    return true;
}
app.github = ( username = null )=>{
    let h = {"api":"https://api.github.com"};
    if( username == null ){
        return {'type':'error','msg':'Missing Username'};
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
app.video = ( json )=>{
    let player;
    let playerStorage;
    if( typeof json == "object" ){
        if(json.id && document.querySelector(json.id)){
            player = document.querySelector(json.id);
        } else if(json.element && json.element.nodeType && json.element.nodeType === 1 ){
            player = json.element;
        } else {
            player = {'type':'error','msg':'cant find valid video'};
        }
        if( player.nodeType && player.nodeType === 1){
            if( window.localStorage.getItem('history') == null ){
                playerStorage = {};
            } else {
                playerStorage = JSON.parse( window.localStorage.getItem('history') );
            }
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
            if( playerStorage[ btoa(player.src) ] ){
                if( playerStorage[ btoa(player.src) ].currentTime ){
                    player.currentTime = playerStorage[ btoa(player.src) ].currentTime;
                }
            } else {
                playerStorage[ btoa(player.src) ] = {};
            }
            player.ontimeupdate = ()=>{
                playerStorage[ btoa(player.src) ].currentTime = player.currentTime;
            }
            player.onpause = ()=>{
                window.localStorage.setItem('history',JSON.stringify(playerStorage));
            }
            player.onended = ()=>{
                window.localStorage.setItem('history',JSON.stringify(playerStorage));
            }
        }
    } else {
        player = {'type':'error','msg':'not valid json'};
    }
    return player;
}
app.audio = (json = null)=>{
    let player;
    let playerStorage;
    if( typeof json == "object" ){
        if(json.id && document.querySelector(json.id)){
            player = document.querySelector(json.id);
        } else if(json.element && json.element.nodeType && json.element.nodeType === 1 ){
            player = json.element;
        } else {
            player = {'type':'error','msg':'cant find valid audio'};
        }
        if( player.nodeType && player.nodeType === 1){
            if( window.localStorage.getItem('history') == null ){
                playerStorage = {};
            } else {
                playerStorage = JSON.parse( window.localStorage.getItem('history') );
            }
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
            if( playerStorage[ btoa(player.src) ] ){
                if( playerStorage[ btoa(player.src) ].currentTime ){
                    player.currentTime = playerStorage[ btoa(player.src) ].currentTime;
                }
            } else {
                playerStorage[ btoa(player.src) ] = {};
            }
            player.ontimeupdate = ()=>{
                playerStorage[ btoa(player.src) ].currentTime = player.currentTime;
            }
            player.onpause = ()=>{
                window.localStorage.setItem('history',JSON.stringify(playerStorage));
            }
            player.onended = ()=>{
                window.localStorage.setItem('history',JSON.stringify(playerStorage));
            }
        }
    } else {
        player = {'type':'error','msg':'not valid json'};
    }
    return player;
}
app.create = (json)=>{
    let u;
    if( typeof json == 'object' ){
        if( "name" in json ){
            u = document.createElement( json.name );
            if( json.parent && json.parent !=='' ){
                if( json.parent.nodeType && json.parent.nodeType === 1 ){
                    json.parent.appendChild( u );
                } else if( document.querySelector( json.parent ) ){
                    document.querySelector(  json.parent ).appendChild( u );
                } else {
                    u = {'type':'error','msg':'cant find '+json.parent};
                }
            } else {
                document.body.appendChild( u );
            }
            if( json.attribute && typeof json.attribute == 'object' ){
                for( a in json.attribute ){
                    u[a] = json.attribute[a];
                }
            }
            if( json.class && json.class.length > 0){
                //Loop to add class
                json.class.forEach((c)=>{
                    u.classList.add(c);
                });
            }
            if( json.onclick && typeof json.onclick == 'function'){
                //Add onclick event
                u.onclick = json.onclick;
            }
            if( json.oncreate && typeof json.oncreate == 'function' ){
                //Run function on element create
                json.oncreate(u);
            }
            if( json.body && typeof json.body == 'string' ){
                u.innerHTML += json.body;
            } else if( json.body && typeof json.body == 'object' && json.body.length > 0 ){
                json.body.forEach((b)=>{
                    if( typeof b == 'object' ){
                        b.parent = u;
                        app.create(b);
                    } else if( typeof b == 'string' ){
                        u.innerHTML += b;
                    }
                });
            }

        } else {
            u = {'type':'error','msg':'Missing Name'};
        }
    } else {
        u = {'type':'error','msg':'not valid json'};
    }
    return u;
}