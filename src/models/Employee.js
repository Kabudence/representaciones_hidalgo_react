class Employee {
    constructor(id, nombre, direccion, telefono, correo, idemp, estado) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.correo = correo;
        this.idemp = idemp;
        this.estado = estado;
    }

    static validate(employee) {
        if (!employee.nombre || !employee.direccion || !employee.telefono || !employee.correo || !employee.estado) {
            throw new Error("Todos los campos son obligatorios.");
        }
    }
}

export default Employee;
