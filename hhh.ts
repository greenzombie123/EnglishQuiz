interface HOT {
    h():number
    jot: 3 | 4
    b:number
}

class NOT implements HOT{
    h(){return 2}
    jot = 3 as const
    b = 2
}

const joke = {a:"fefe"}
joke.a = "f"

let p = 5
p = 10
const g = 3
g = 2