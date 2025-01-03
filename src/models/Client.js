class Client {
    constructor(id, codigo, nombre, direccion, telefono, estado) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.estado = estado;
    }

    static validate(client) {
        if (!client.codigo || !client.nombre || !client.direccion || !client.telefono || !client.estado) {
            throw new Error("Todos los campos son obligatorios.");
        }
    }
}

export default Client;
