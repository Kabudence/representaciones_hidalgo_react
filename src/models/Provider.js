class Provider {
    constructor(id, codigo, nombre, direccion, telefono, correo, estado) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.correo = correo;
        this.estado = estado;
    }

    static validate(provider) {
        if (!provider.nombre.trim()) {
            throw new Error("El nombre es obligatorio.");
        }
        if (!provider.codigo.trim()) {
            throw new Error("El código es obligatorio.");
        }
        if (!provider.correo.trim() || !provider.correo.includes("@")) {
            throw new Error("El correo es inválido.");
        }
    }
}

export default Provider;
