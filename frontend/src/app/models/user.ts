//puesto los mismos campos exactos que tienes en tu Backend (MongoDB).

export class User {
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password?: string, // El ? significa opcional (a veces no viaja)
        public role?: string,
        public image?: string,
        public gettoken?: string, // Este es un truco para el Login
        public bio?: string
    ) {}
}