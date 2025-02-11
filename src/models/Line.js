class Line {
    constructor(idlinea, nombre, estado, idemp) {
        this.idlinea = idlinea;
        this.nombre = nombre;
        this.estado = estado;   // "1" o "2"
        this.idemp = idemp;
    }

    // Validación al estilo "Client.validate"
    static validate(line) {
        if (!line.nombre || !line.nombre.trim()) {
            throw new Error("El nombre de la línea es obligatorio.");
        }
        if (!line.estado) {
            throw new Error("El estado es obligatorio (1=Activo, 2=Inactivo).");
        }
        if (!line.idemp) {
            throw new Error("El ID de empresa es obligatorio.");
        }
    }
}

export default Line;
