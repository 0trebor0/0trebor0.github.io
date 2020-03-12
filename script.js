document.querySelectorAll( 'input[type=text], input[type=password]' ).forEach( ( input )=>{
    if( input !== null ){
        input.autocomplete = "off";
    }
} );
element = ( id = null, from = null )=>{
    var e = null;
    if( from !== null && id !== null ){
        e = test.querySelector( id );
        e.element = ( id )=>{
            return element( id, e.innerHTML );
        }
    }else if( id !== null ){
        e = document.querySelector( id );
        e.element = ( id )=>{
            return element( id, e.innerHTML );
        }
    }
    return e;
}
