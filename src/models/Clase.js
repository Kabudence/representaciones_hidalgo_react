class Clase {
    constructor(idclase, nombres, idemp, estado) {
        this.idclase = idclase; // Puede ser null al crear
        this.nombres = nombres;
        this.idemp = idemp; // Integer
        this.estado = estado; // "1" o "2"
    }

    // Validaciones para los campos
    static validate(clase) {
        if (!clase.nombres || !clase.nombres.trim()) {
            throw new Error("El nombre de la clase es obligatorio.");
        }
        if (!clase.idemp) {
            throw new Error("El ID de empresa es obligatorio.");
        }
        if (!clase.estado) {
            throw new Error("El estado es obligatorio (1=Activo, 2=Inactivo).");
        }
    }
}

export default Clase;
