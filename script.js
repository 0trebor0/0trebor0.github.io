element = ( id = null )=>{
    var e = null;
    if( id !== null ){
        if( document.querySelectorAll( id ).length > 0 ){
            e = document.querySelectorAll( id );
        } else {
            e = document.querySelector( id );
        }
    }
    return e;
}
