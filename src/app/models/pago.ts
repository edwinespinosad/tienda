export class Pago {
    constructor(
        public usuarioId: string,
        public numeroTarjeta: string,
        public mm: string,
        public yy: string,
        public cvc: string, 
        public nombreTarjeta: string, 
        public total: number,
        public calle: string,
        public ciudad: string,
        public estado: string,
        public cp: string,
        public _id?: string,
    ) { }
}