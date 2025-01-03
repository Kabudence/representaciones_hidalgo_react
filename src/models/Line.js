class Line {
    constructor(id, nombre, estado) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
    }

    static validate(line) {
        if (!line.nombre || line.nombre.trim() === "") {
            throw new Error("El nombre de la línea es obligatorio.");
        }
        if (!["Activo", "Inactivo"].includes(line.estado)) {
            throw new Error("El estado debe ser 'Activo' o 'Inactivo'.");
        }
    }
}

export default Line;
