element = ( id = null )=>{
    var e = null;
    if( id !== null ){
        e = document.querySelectorAll( id );
    }
    return e;
}
