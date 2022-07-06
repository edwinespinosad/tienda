export class Articulo{
    constructor(
        public nombre: string, 
        public precio: number,
        public descripcion: string,
        public imagen: string,
        public _id?: string
    ){}
}