window.onload = ()=>{
    document.querySelectorAll( 'input[type=text], input[type=password]' ).forEach( ( input )=>{
        if( input !== null ){
            input.autocomplete = "off";
        }
    } );
};
element = ( id = null )=>{
    var e = null;
    if( id !== null ){
        e = document.querySelector( id );
    }
    return e;
}
