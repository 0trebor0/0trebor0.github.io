var d = (d)=>{
    let methods = {}
    methods.onready = ( f )=>{
        methods.urlHash = location.hash.slice(1);
        window.onload = ()=>{
            f();
        };
    }
    methods.onclose = ( f )=>{
        window.onbeforeunload = ()=>{
            f();
        };
    }
    methods.onresize = ( f )=>{
        window.onresize = ()=>{
            f();
        };
    }
    methods.search = (id)=>{
        if( d.querySelectorAll( id ).length > 1 ){
            return d.querySelectorAll( id );
        } else {
            return d.querySelector( id );
        }
    }
    methods.isJson = ( json )=>{
        try{
            JSON.parse( json );
        }catch( err ){
            return false;
        }
        return true;
    }
    methods.github = ( username = null )=>{
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
    methods.video = ( json )=>{
        let player;
        let playerStorage;
        if( typeof json == "object" ){
            if(json.id && d.querySelector(json.id)){
                player = d.querySelector(json.id);
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
    methods.audio = (json = null)=>{
        let player;
        let playerStorage;
        if( typeof json == "object" ){
            if(json.id && d.querySelector(json.id)){
                player = d.querySelector(json.id);
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
    methods.create = (json)=>{
        let u;
        if( typeof json == 'object' ){
            if( "name" in json ){
                u = d.createElement( json.name );
                if( json.parent && json.parent !=='' ){
                    if( json.parent.nodeType && json.parent.nodeType === 1 ){
                        json.parent.appendChild( u );
                    } else if( d.querySelector( json.parent ) ){
                        d.querySelector(  json.parent ).appendChild( u );
                    } else {
                        u = {'type':'error','msg':'cant find '+json.parent};
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
                                methods.create(b);
                            } else if( typeof b == 'string' ){
                                u.innerHTML += b;
                            }
                        });
                    }
                }

            } else {
                u = {'type':'error','msg':'Missing Name'};
            }
        } else {
            u = {'type':'error','msg':'not valid json'};
        }
        return u;
    }
    return methods;
}