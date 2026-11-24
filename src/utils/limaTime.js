const lima = { timeZone: "America/Lima" };
const dateParts = { day: "2-digit", month: "2-digit", year: "numeric" };

export const formatLimaDate = (value = new Date()) => {
    const dateOnly = typeof value === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnly) return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;

    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return value || "Sin fecha";
    const zone = typeof value === "string" && / 00:00:00 GMT$/.test(value) ? "UTC" : lima.timeZone;
    return date.toLocaleDateString("es-PE", { ...dateParts, timeZone: zone });
};

export const formatLimaTime = (date = new Date()) => date.toLocaleTimeString("es-PE", lima);

export const formatLimaTimestamp = (value) => {
    if (!value) return "Sin fecha";
    const iso = String(value).replace(" ", "T");
    const date = new Date(/[Zz]$|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.toLocaleDateString("es-PE", { ...dateParts, ...lima })} ${formatLimaTime(date)}`;
};