class Employee {
    constructor(id, codigo, nombre, direccion, telefono, correo, estado) {
        this.id = id;
        this.codigo = codigo || `EMP${String(id).padStart(3, "0")}`;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.correo = correo;
        this.estado = estado || "Activo";
    }



    // Método estático para validar si un objeto es un Employee válido
    static validate(employee) {
        if (
            !employee.nombre ||
            !employee.direccion ||
            !employee.telefono ||
            !employee.correo ||
            !employee.estado
        ) {
            throw new Error("Todos los campos son obligatorios.");
        }
    }
}

export default Employee;
