element = ( id = null, from = null )=>{
    var e = null;
    if( from !== null && id !== null ){
        let test = new DOMParser().parseFromString( from ,'text/html' );
        if( test.querySelectorAll( id ).length > 1 ){
            e = test.querySelectorAll( id );
            e.forEach( ( g )=>{
                g.element = ( id )=>{
                    return element( id, g.innerHTML );
                }
            } );
        } else {
            e = test.querySelector( id );
            e.element = ( id )=>{
                return element( id, e.innerHTML );
            }
        }
    }else if( id !== null ){
        if( document.querySelectorAll( id ).length > 1 ){
            e = document.querySelectorAll( id );
            e.forEach( ( g )=>{
                g.element = ( id )=>{
                    return element( id, g.innerHTML );
                }
            } );
        } else {
            e = document.querySelector( id );
            e.element = ( id )=>{
                return element( id, e.innerHTML );
            }
        }
    }
    return e;
}
