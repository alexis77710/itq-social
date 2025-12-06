//modelo para el muro de publicaciones.
// Es decir, los posts que los usuarios hacen en su perfil o en el de otros.

export class Publication {
    constructor(
        public _id: string,
        public texto: string,
        public file: string,
        public created_at: any, //Fecha de creación con tipo any para mayor flexibilidad y multiplicar por mil
        public user: any
    ){}
}