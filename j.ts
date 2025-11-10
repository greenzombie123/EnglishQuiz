const g = (a:unknown)=> typeof a === "string" || typeof a === "number" 
const j = (a:unknown)=> typeof a === "number"


const b = (a:number | string | {a:number})=>{
    if(g(a)){
        a
    }
    else if(g(a)){
        a
    }
    else a
}
