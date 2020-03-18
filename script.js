var app = {};
app.windowOnresize = [];
app.windowOnload = [];
app.windowOnclose = [];
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
    document.querySelectorAll( 'input[type=text], input[type=password]' ).forEach( ( input )=>{
        if( input !== null ){
            input.autocomplete = "off";
        }
    } );
}
element = ( id = null )=>{
    var e = null;
    if( id !== null ){
        if( document.querySelectorAll( id ).length > 1 ){
            e = document.querySelectorAll( id );
        } else {
            e = document.querySelector( id );
        }
    }
    return e;
}
