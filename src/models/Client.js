// Client class actualizado
class Client {
    constructor(idcliente, tdoc, nomcliente, direccion, telefono, estado) {
        this.idcliente = idcliente;
        this.tdoc = tdoc;
        this.nomcliente = nomcliente;
        this.direccion = direccion;
        this.telefono = telefono;
        this.estado = estado;
    }

    static validate(client) {
        if (!client.idcliente || !client.tdoc || !client.nomcliente || !client.direccion || !client.telefono || !client.estado) {
            throw new Error("Todos los campos son obligatorios.");
        }
    }
}

export default Client;