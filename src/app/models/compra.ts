export class Compra {
    constructor(
        public usuarioId: string,
        public pagoId: string,
        public articuloId: string,
        public cantidad: number,
        public precio: number,
        public nombreArticulo: string,
        public imagen: string,
        public fecha: Date,
        public total: number,
        public compraId : string,
        public _id?: string,
    ) { }
}