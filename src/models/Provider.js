class Provider {
    constructor(ruc, nomproveedor, direccion, telefono, celular, contacto, correo, estado) {
        this.ruc = ruc;
        this.nomproveedor = nomproveedor;
        this.direccion = direccion;
        this.telefono = telefono;
        this.celular = celular;
        this.contacto = contacto;
        this.correo = correo;
        this.estado = estado;
    }

    static validate(provider) {
        if (!provider.nomproveedor.trim()) {
            throw new Error("El nombre del proveedor es obligatorio.");
        }
        if (!provider.ruc.trim()) {
            throw new Error("El RUC es obligatorio.");
        }
        if (!provider.correo.trim() || !provider.correo.includes("@")) {
            throw new Error("El correo es inválido.");
        }
    }
}

export default Provider;