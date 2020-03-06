
element = ( id = null, from = null )=>{
    var e = null;
    if( id !== null ){
        e = document.querySelector( id );
    }else if( id !== null || from !== null ){
        e = from.querySelector( id );
    }
    if( e !== null ){
        e.child = ( id )=>{
            return element( id, e.innerHTML );
        };
    }
    return e;
}
