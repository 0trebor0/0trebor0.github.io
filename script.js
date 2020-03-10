element = ( id = null, from = null )=>{
    var e = null;
    if( id !== null && from !== null ){
        if( from.querySelectorAll( id ).length > 1 ){
            e = from.querySelectorAll( id );
        } else {
            e = from.querySelector( id );
        }
    }else if( id !== null ){
        if( document.querySelectorAll( id ).length > 1 ){
            e = document.querySelectorAll( id );
        } else {
            e = document.querySelector( id );
        }
    }
    if( e !== null ){
        if( e.length > 1 ){
            e.forEach( (o)=>{
                o.child = ( id )=>{
                    return element( id, new DOMParser().parseFromString(o.innerHTML, 'text/html') );
                }
            } );
        } else {
            e.child = ( id )=>{
                return element( id, new DOMParser().parseFromString(e.innerHTML, 'text/html') );
            }
        }
    }
    return e;
}
