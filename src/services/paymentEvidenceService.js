import api from "./api";

const paymentEvidenceService = {
    async getTypes() {
        const response = await api.get("/evidencias-pago/tipos-evidencia");
        return response.data;
    },

    async getPaymentTypes() {
        const response = await api.get("/regmovcab-pagos/tipos-venta");
        return response.data?.tipos_venta || [];
    },

    async getSales({
        evidenceStatus = "PENDIENTE",
        saleStatus = "",
        numDocum = "",
        fromDate = "",
        toDate = "",
        initialView = false,
        page = 1,
        size = 30,
    } = {}) {
        const response = await api.get("/evidencias-pago/ventas", {
            params: {
                estado_evidencia: evidenceStatus,
                estado_venta: saleStatus || undefined,
                num_docum: numDocum || undefined,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                vista_inicial: initialView ? 1 : undefined,
                page,
                size,
            },
        });
        return response.data;
    },

    async getSaleDetail(idmov, includeImages = true) {
        const response = await api.get(`/evidencias-pago/ventas/${idmov}`, {
            params: { include_images: includeImages ? 1 : 0 },
        });
        return response.data;
    },

    async getEvidenceImage(evidenceId, signal) {
        const response = await api.get(`/evidencias-pago/evidencias/${evidenceId}/imagen`, { signal, responseType: "blob" });
        return response.data;
    },

    async registerFlow(idmov, payload) {
        const response = await api.post(
            `/evidencias-pago/ventas/${idmov}/registrar`,
            payload,
        );
        return response.data;
    },

    async uploadEvidence(idmov, evidence) {
        const response = await api.post(
            `/evidencias-pago/ventas/${idmov}/evidencias`,
            evidence,
        );
        return response.data;
    },

    async updateEvidenceStatus(idmov, payload) {
        const response = await api.put(
            `/evidencias-pago/ventas/${idmov}/estado`,
            payload,
        );
        return response.data;
    },

    async updateEvidence(idevidencia, payload) {
        const response = await api.put(
            `/evidencias-pago/evidencias/${idevidencia}`,
            payload,
        );
        return response.data;
    },

    async deleteEvidence(idevidencia) {
        const response = await api.delete(
            `/evidencias-pago/evidencias/${idevidencia}`,
        );
        return response.data;
    },
};

export default paymentEvidenceService;
