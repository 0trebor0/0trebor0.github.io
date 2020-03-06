
element = ( id = null, from = null )=>{
    var e = {};
    if( id !== null ){
        e.dom = document.querySelector( id );
    }else if( id !== null || from !== null ){
        e.dom = from.querySelector( id );
    }
    if( e.dom == null ){
        e = null;
    } else {
        e.html = e.dom.innerHTML;
        e.style = e.dom.style;
        e.element = ( id )=>{
            return element( id, e.html );
        };
    }
    return e;
}
