export class Carrito {
    constructor(
        public usuarioId: string,
        public articuloId: string,
        public cantidad: number,
        public precio: number,
        public nombreArticulo: string,
        public imagen: string,
        public compraId : string,
        public _id?: number
    ) { }
}