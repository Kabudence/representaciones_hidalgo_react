import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import analyticsService from "../services/analyticsService";

const PAYMENT_RANGES = [
    { value: "today", label: "Hoy" },
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
];

const PRODUCT_RANGES = [
    { value: "7d", label: "7 dias" },
    { value: "1m", label: "1 mes" },
    { value: "3m", label: "3 meses" },
    { value: "6m", label: "6 meses" },
    { value: "1y", label: "1 ano" },
];

const MONTH_OPTIONS = [
    { value: 3, label: "3 meses" },
    { value: 6, label: "6 meses" },
    { value: 12, label: "12 meses" },
];

const VIEW_MODES = {
    SUMMARY: "summary",
    PAYMENT_DETAIL: "payment-detail",
    PRODUCTS: "products",
};

const PAYMENT_COLORS = [
    { background: "#fff3d6", accent: "#d97706", soft: "rgba(217, 119, 6, 0.16)" },
    { background: "#eaf7ef", accent: "#15803d", soft: "rgba(21, 128, 61, 0.16)" },
    { background: "#fde8e8", accent: "#b91c1c", soft: "rgba(185, 28, 28, 0.16)" },
    { background: "#f3e8ff", accent: "#7e22ce", soft: "rgba(126, 34, 206, 0.16)" },
    { background: "#e0f2fe", accent: "#0369a1", soft: "rgba(3, 105, 161, 0.16)" },
];

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f0e4 0%, #fffaf0 48%, #f5e6d3 100%)",
        color: "#1f2933",
        padding: "24px 20px 48px",
        fontFamily: "Arial, sans-serif",
    },
    shell: {
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
    },
    hero: {
        background: "linear-gradient(135deg, #2a1513 0%, #7f1d1d 54%, #d97706 100%)",
        color: "#fffaf0",
        borderRadius: "24px",
        padding: "24px",
        marginBottom: "18px",
        boxShadow: "0 18px 36px rgba(127, 29, 29, 0.22)",
        border: "1px solid rgba(255, 250, 240, 0.35)",
    },
    heroTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "18px",
        marginBottom: "20px",
    },
    title: {
        margin: 0,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "42px",
        letterSpacing: "1px",
        lineHeight: 1,
    },
    subtitle: {
        margin: "10px 0 0",
        color: "rgba(255, 250, 240, 0.82)",
        fontSize: "14px",
        maxWidth: "760px",
    },
    buttonRow: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },
    button: {
        border: "none",
        borderRadius: "999px",
        padding: "11px 15px",
        fontWeight: "800",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        fontSize: "13px",
    },
    primaryButton: {
        background: "#fffaf0",
        color: "#7f1d1d",
        boxShadow: "0 10px 18px rgba(0, 0, 0, 0.18)",
    },
    secondaryButton: {
        background: "rgba(255, 250, 240, 0.14)",
        color: "#fffaf0",
        border: "1px solid rgba(255, 250, 240, 0.34)",
    },
    backButton: {
        background: "#7f1d1d",
        color: "#fffaf0",
    },
    card: {
        background: "rgba(255, 250, 240, 0.92)",
        border: "1px solid #ead9bd",
        borderRadius: "22px",
        boxShadow: "0 14px 28px rgba(73, 45, 18, 0.11)",
        padding: "20px",
        minWidth: 0,
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "14px",
        marginBottom: "16px",
    },
    cardTitle: {
        margin: 0,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "26px",
        letterSpacing: "0.7px",
        color: "#331b16",
    },
    cardHelp: {
        margin: "6px 0 0",
        color: "#6b5c4b",
        fontSize: "13px",
    },
    select: {
        backgroundColor: "#fffaf0",
        border: "1px solid #d6b98d",
        borderRadius: "12px",
        color: "#331b16",
        padding: "10px 12px",
        fontWeight: "800",
        outline: "none",
        minWidth: "126px",
    },
    metricGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(130px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
    },
    metricCard: {
        background: "#fff7e8",
        border: "1px solid #ead9bd",
        borderRadius: "18px",
        padding: "16px",
    },
    metricLabel: {
        color: "#7c6a55",
        fontSize: "12px",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        fontWeight: "800",
    },
    metricValue: {
        fontSize: "23px",
        fontWeight: "900",
        color: "#331b16",
    },
    highlightCard: {
        background: "linear-gradient(135deg, #fff3d6 0%, #ffe3ad 100%)",
        border: "1px solid #f0c56d",
        borderRadius: "20px",
        padding: "18px",
    },
    highlightTitle: {
        color: "#7c2d12",
        fontSize: "12px",
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        marginBottom: "8px",
    },
    highlightValue: {
        color: "#331b16",
        fontSize: "24px",
        fontWeight: "900",
    },
    highlightMeta: {
        color: "#7c6a55",
        fontSize: "13px",
        marginTop: "6px",
    },
    empty: {
        background: "#fff7e8",
        border: "1px dashed #d6b98d",
        borderRadius: "16px",
        color: "#7c6a55",
        padding: "18px",
        textAlign: "center",
    },
    error: {
        background: "rgba(185, 28, 28, 0.1)",
        border: "1px solid rgba(185, 28, 28, 0.35)",
        color: "#991b1b",
        borderRadius: "14px",
        padding: "12px",
        marginBottom: "14px",
        fontWeight: "700",
    },
    tableContainer: {
        overflowX: "auto",
        borderRadius: "16px",
        border: "1px solid #ead9bd",
        background: "#fffaf0",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "720px",
    },
    th: {
        textAlign: "left",
        color: "#6b5c4b",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        borderBottom: "1px solid #ead9bd",
        padding: "13px",
        background: "#fff3d6",
    },
    td: {
        color: "#331b16",
        borderBottom: "1px solid #f0dfc5",
        padding: "13px",
        fontSize: "14px",
    },
    rank: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "30px",
        height: "30px",
        borderRadius: "999px",
        background: "#7f1d1d",
        color: "#fffaf0",
        fontWeight: "900",
        fontSize: "12px",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: "12px",
        fontWeight: "900",
        background: "rgba(217, 119, 6, 0.14)",
        color: "#92400e",
        border: "1px solid rgba(217, 119, 6, 0.32)",
        whiteSpace: "nowrap",
    },
    smallText: {
        color: "#7c6a55",
        fontSize: "12px",
    },
};

const css = `
    .analytics-hero-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
    }

    .analytics-main-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
        gap: 18px;
        align-items: start;
    }

    .analytics-stack {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .analytics-payment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 12px;
    }

    .analytics-chart-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 14px;
    }

    .analytics-chart-wrap {
        display: flex;
        align-items: end;
        gap: 12px;
        min-height: 260px;
        border-radius: 18px;
        background: #fff7e8;
        border: 1px solid #ead9bd;
        padding: 18px 14px 12px;
        overflow-x: auto;
    }

    .analytics-chart-box {
        min-width: 64px;
        flex: 1 0 64px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 220px;
        gap: 8px;
    }

    .analytics-chart-bar {
        width: 100%;
        max-width: 44px;
        border-radius: 14px 14px 5px 5px;
        background: linear-gradient(180deg, #b91c1c 0%, #d97706 100%);
        min-height: 8px;
        box-shadow: 0 10px 18px rgba(185, 28, 28, 0.18);
    }

    .analytics-chart-label {
        color: #7c6a55;
        font-size: 11px;
        white-space: nowrap;
        font-weight: 800;
    }

    .analytics-chart-amount {
        color: #331b16;
        font-size: 11px;
        font-weight: 900;
        white-space: nowrap;
    }

    .analytics-progress {
        height: 8px;
        border-radius: 999px;
        background: #f0dfc5;
        overflow: hidden;
        margin-top: 10px;
    }

    .analytics-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #7f1d1d, #d97706);
    }

    .analytics-products-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        align-items: start;
    }

    .analytics-month-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 14px;
    }

    .analytics-month-card {
        background: #fff7e8;
        border: 1px solid #ead9bd;
        border-radius: 18px;
        padding: 15px;
    }

    .analytics-payment-card {
        border-radius: 18px;
        padding: 16px;
        border: 1px solid rgba(73, 45, 18, 0.1);
    }


    .analytics-summary-overview {
        display: grid;
        grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
        gap: 14px;
        margin-bottom: 16px;
    }

    .analytics-summary-total-card {
        background: linear-gradient(135deg, #331b16 0%, #7f1d1d 100%);
        color: #fffaf0;
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 12px 24px rgba(127, 29, 29, 0.18);
    }

    .analytics-summary-total-label {
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: rgba(255, 250, 240, 0.78);
    }

    .analytics-summary-total-value {
        font-size: 34px;
        font-weight: 900;
        margin-top: 8px;
        line-height: 1;
    }

    .analytics-summary-total-meta {
        margin-top: 10px;
        color: rgba(255, 250, 240, 0.78);
        font-size: 13px;
    }

    .analytics-summary-stat-strip {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .analytics-summary-mini-stat {
        background: #fff7e8;
        border: 1px solid #ead9bd;
        border-radius: 18px;
        padding: 16px;
    }

    .analytics-summary-mini-label {
        color: #7c6a55;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.6px;
    }

    .analytics-summary-mini-value {
        color: #331b16;
        font-size: 22px;
        font-weight: 900;
        margin-top: 8px;
    }

    .analytics-summary-content-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
        gap: 16px;
        align-items: start;
    }

    .analytics-subsection-title {
        color: #331b16;
        font-size: 14px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        margin-bottom: 10px;
    }

    .analytics-payment-summary-list,
    .analytics-status-list {
        background: #fffaf0;
        border: 1px solid #ead9bd;
        border-radius: 18px;
        padding: 8px;
    }

    .analytics-payment-summary-row,
    .analytics-status-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        padding: 12px;
        border-radius: 14px;
    }

    .analytics-payment-summary-row + .analytics-payment-summary-row,
    .analytics-status-row + .analytics-status-row {
        border-top: 1px solid #f0dfc5;
    }

    .analytics-payment-summary-main,
    .analytics-status-main {
        min-width: 0;
    }

    .analytics-payment-summary-name,
    .analytics-status-name {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #331b16;
        font-weight: 900;
        min-width: 0;
    }

    .analytics-payment-summary-meta,
    .analytics-status-meta {
        color: #7c6a55;
        font-size: 12px;
        margin-top: 4px;
    }

    .analytics-payment-summary-value,
    .analytics-status-value {
        color: #331b16;
        font-size: 18px;
        font-weight: 900;
        white-space: nowrap;
        text-align: right;
    }

    .analytics-payment-summary-track,
    .analytics-status-track {
        height: 7px;
        border-radius: 999px;
        background: #f0dfc5;
        overflow: hidden;
        margin-top: 8px;
    }

    .analytics-payment-summary-fill,
    .analytics-status-fill {
        height: 100%;
        border-radius: 999px;
    }

    .analytics-payment-card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
    }

    .analytics-dot {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        flex: 0 0 auto;
    }

    .analytics-row-link {
        border: none;
        background: transparent;
        color: #7f1d1d;
        font-weight: 900;
        cursor: pointer;
        padding: 0;
    }

    .analytics-button:hover {
        transform: translateY(-1px);
    }


    .analytics-product-control-panel {
        display: grid;
        grid-template-columns: repeat(3, minmax(210px, 1fr));
        gap: 14px;
        margin-bottom: 16px;
    }

    .analytics-product-filter-card {
        background: #fff7e8;
        border: 1px solid #ead9bd;
        border-radius: 18px;
        padding: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }

    .analytics-product-filter-label {
        color: #331b16;
        font-weight: 900;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .analytics-product-filter-help {
        color: #7c6a55;
        font-size: 12px;
        margin-top: 4px;
    }

    .analytics-product-insights {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }

    .analytics-product-insight {
        border-radius: 20px;
        padding: 17px;
        border: 1px solid rgba(73, 45, 18, 0.11);
        min-height: 138px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        position: relative;
    }

    .analytics-product-insight:after {
        content: "";
        position: absolute;
        width: 94px;
        height: 94px;
        border-radius: 999px;
        right: -32px;
        top: -32px;
        background: rgba(255, 250, 240, 0.42);
    }

    .analytics-product-insight-sales {
        background: linear-gradient(135deg, #fff3d6 0%, #fbd38d 100%);
    }

    .analytics-product-insight-profit {
        background: linear-gradient(135deg, #eaf7ef 0%, #bfe8cc 100%);
    }

    .analytics-product-insight-month {
        background: linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%);
    }

    .analytics-product-insight-label {
        color: #7c2d12;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        position: relative;
        z-index: 1;
    }

    .analytics-product-insight-value {
        color: #331b16;
        font-size: 24px;
        font-weight: 900;
        margin-top: 10px;
        line-height: 1.1;
        position: relative;
        z-index: 1;
    }

    .analytics-product-insight-meta {
        color: #5f4d3d;
        font-size: 13px;
        margin-top: 8px;
        position: relative;
        z-index: 1;
    }

    .analytics-product-board {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        align-items: start;
    }

    .analytics-product-chart-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .analytics-product-row-card {
        background: #fff7e8;
        border: 1px solid #ead9bd;
        border-radius: 18px;
        padding: 14px;
        box-shadow: 0 8px 18px rgba(73, 45, 18, 0.06);
    }

    .analytics-product-row-main {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
    }

    .analytics-product-name {
        color: #331b16;
        font-weight: 900;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .analytics-product-meta {
        color: #7c6a55;
        font-size: 12px;
        margin-top: 4px;
    }

    .analytics-product-value {
        color: #7f1d1d;
        font-weight: 900;
        white-space: nowrap;
        text-align: right;
    }

    .analytics-product-track {
        height: 12px;
        border-radius: 999px;
        background: #f0dfc5;
        overflow: hidden;
        margin-top: 12px;
    }

    .analytics-product-fill-sales {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #7f1d1d 0%, #d97706 100%);
    }

    .analytics-product-fill-profit {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #166534 0%, #22c55e 100%);
    }

    .analytics-profit-stack {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 7px;
        margin-top: 12px;
    }

    .analytics-profit-stack-row {
        display: grid;
        grid-template-columns: 68px minmax(0, 1fr) 78px;
        align-items: center;
        gap: 8px;
        color: #7c6a55;
        font-size: 11px;
        font-weight: 800;
    }

    .analytics-profit-stack-track {
        height: 7px;
        border-radius: 999px;
        background: #f0dfc5;
        overflow: hidden;
    }

    .analytics-profit-stack-fill-cost {
        height: 100%;
        border-radius: 999px;
        background: #d97706;
    }

    .analytics-profit-stack-fill-gain {
        height: 100%;
        border-radius: 999px;
        background: #16a34a;
    }

    .analytics-product-month-grid-v2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
        gap: 14px;
    }

    .analytics-product-month-card-v2 {
        background: #fff7e8;
        border: 1px solid #ead9bd;
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 8px 18px rgba(73, 45, 18, 0.06);
    }

    .analytics-product-month-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 13px;
    }

    .analytics-product-month-title {
        color: #331b16;
        font-weight: 900;
        text-transform: capitalize;
    }

    .analytics-product-month-leader {
        background: #fff3d6;
        border: 1px solid #f0c56d;
        border-radius: 16px;
        padding: 12px;
        margin-bottom: 12px;
    }

    .analytics-product-mini-row {
        display: grid;
        grid-template-columns: 28px minmax(0, 1fr) auto;
        gap: 10px;
        align-items: center;
    }

    .analytics-product-mini-track {
        height: 7px;
        border-radius: 999px;
        background: #f0dfc5;
        overflow: hidden;
        margin-top: 6px;
    }

    .analytics-product-mini-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #7f1d1d, #d97706);
    }

    @media (max-width: 1180px) {
        .analytics-main-grid,
        .analytics-products-grid,
        .analytics-product-board,
        .analytics-product-control-panel,
        .analytics-product-insights,
        .analytics-summary-overview,
        .analytics-summary-content-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 760px) {
        .analytics-page {
            padding: 16px 10px 34px !important;
        }

        .analytics-hero-top,
        .analytics-section-header {
            flex-direction: column;
            align-items: stretch !important;
        }

        .analytics-hero-actions {
            justify-content: flex-start;
        }

        .analytics-product-filter-card,
        .analytics-product-row-main,
        .analytics-profit-stack-row {
            grid-template-columns: 1fr;
            align-items: stretch;
        }

        .analytics-product-value {
            text-align: left;
        }

        .analytics-metric-grid,
        .analytics-summary-stat-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        .analytics-payment-summary-row,
        .analytics-status-row {
            grid-template-columns: 1fr;
            align-items: stretch;
        }

        .analytics-payment-summary-value,
        .analytics-status-value {
            text-align: left;
        }
    }



    @media (max-width: 900px) {
        .analytics-card {
            padding: 16px !important;
            border-radius: 18px !important;
        }

        .analytics-hero-title {
            font-size: 34px !important;
        }

        .analytics-card-title {
            font-size: 23px !important;
        }

        .analytics-chart-wrap {
            min-height: 220px;
        }

        .analytics-chart-box {
            height: 180px;
            min-width: 54px;
            flex-basis: 54px;
        }
    }

    @media (max-width: 760px) {
        .analytics-period-control {
            align-items: stretch !important;
        }

        .analytics-period-control > div,
        .analytics-period-control select {
            width: 100%;
        }

        .analytics-hero-actions {
            width: 100%;
        }

        .analytics-hero-actions .analytics-button {
            flex: 1 1 100%;
            width: 100%;
        }

        .analytics-card {
            padding: 14px !important;
        }

        .analytics-card-title {
            font-size: 21px !important;
        }

        .analytics-chart-wrap {
            padding: 14px 10px 10px;
            gap: 8px;
        }

        .analytics-chart-box {
            min-width: 48px;
            flex-basis: 48px;
        }

        .analytics-product-month-grid-v2 {
            grid-template-columns: 1fr;
        }

        .analytics-page table {
            min-width: 620px !important;
        }
    }

    @media (max-width: 520px) {
        .analytics-hero-title {
            font-size: 29px !important;
        }

        .analytics-summary-total-value {
            font-size: 27px;
        }

        .analytics-summary-mini-value,
        .analytics-product-insight-value {
            font-size: 20px;
        }

        .analytics-product-mini-row {
            grid-template-columns: 24px minmax(0, 1fr);
        }

        .analytics-product-mini-row > div:last-child {
            grid-column: 2;
            text-align: left !important;
        }
    }

    @media (max-width: 460px) {
        .analytics-metric-grid,
        .analytics-summary-stat-strip {
            grid-template-columns: 1fr !important;
        }
    }
`;

const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `S/ ${amount.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatNumber = (value) => {
    const amount = Number(value || 0);
    return amount.toLocaleString("es-PE", {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
};

const formatMonth = (value) => {
    if (!value) return "-";
    const date = new Date(`${value}-01T00:00:00`);
    return date.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
};

const getErrorMessage = (error) => {
    return error?.response?.data?.error || error?.response?.data?.msg || error?.message || "No se pudo cargar la informacion.";
};

const getPaymentRangeLabel = (range) => {
    return PAYMENT_RANGES.find((item) => item.value === range)?.label || range;
};

const getProductRangeLabel = (range) => {
    return PRODUCT_RANGES.find((item) => item.value === range)?.label || range;
};

const getSellerRangeFromPaymentRange = (range) => {
    if (range === "30d" || range === "month") return "1m";
    return "7d";
};

const SectionCard = ({ title, description, children, rightContent }) => (
    <section className="analytics-card" style={styles.card}>
        <div className="analytics-section-header" style={styles.sectionHeader}>
            <div>
                <h2 className="analytics-card-title" style={styles.cardTitle}>{title}</h2>
                {description && <p style={styles.cardHelp}>{description}</p>}
            </div>
            {rightContent}
        </div>
        {children}
    </section>
);

const RangeSelect = ({ value, onChange, options }) => (
    <select style={styles.select} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

const ActionButton = ({ children, variant = "secondary", onClick }) => {
    const variantStyle = variant === "primary" ? styles.primaryButton : variant === "back" ? styles.backButton : styles.secondaryButton;

    return (
        <button className="analytics-button" type="button" onClick={onClick} style={{ ...styles.button, ...variantStyle }}>
            {children}
        </button>
    );
};

const MetricCard = ({ label, value }) => (
    <div style={styles.metricCard}>
        <div style={styles.metricLabel}>{label}</div>
        <div style={styles.metricValue}>{value}</div>
    </div>
);

const LoadingBlock = () => <div style={styles.empty}>Cargando informacion...</div>;

const EmptyBlock = ({ message = "No hay datos para mostrar." }) => <div style={styles.empty}>{message}</div>;

const PaymentMethodCards = ({ data }) => {
    const rows = data || [];
    const maxAmount = Math.max(...rows.map((row) => Number(row.monto_total || 0)), 0);

    if (!rows.length) {
        return <EmptyBlock message="No hay pagos registrados en este periodo." />;
    }

    return (
        <div className="analytics-payment-grid">
            {rows.map((row, index) => {
                const palette = PAYMENT_COLORS[index % PAYMENT_COLORS.length];
                const amount = Number(row.monto_total || 0);
                const width = maxAmount > 0 ? Math.max((amount / maxAmount) * 100, 4) : 0;

                return (
                    <article key={`${row.tipo_venta_id}-${row.medio_pago}`} className="analytics-payment-card" style={{ background: palette.background }}>
                        <div className="analytics-payment-card-title">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                                <span className="analytics-dot" style={{ background: palette.accent }} />
                                <strong style={{ color: "#331b16", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.medio_pago}</strong>
                            </div>
                            <span style={{ ...styles.badge, background: palette.soft, color: palette.accent, borderColor: palette.soft }}>
                                {formatNumber(row.pagos_count)} pagos
                            </span>
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "900", color: palette.accent }}>{formatCurrency(amount)}</div>
                        <div style={{ ...styles.smallText, marginTop: "4px" }}>{formatNumber(row.ventas_count)} venta(s)</div>
                        <div className="analytics-progress">
                            <div className="analytics-progress-fill" style={{ width: `${width}%`, background: palette.accent }} />
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

const getStatusPalette = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedStatus.includes("COMPLET")) {
        return { accent: "#15803d", background: "rgba(21, 128, 61, 0.1)", label: "Completadas" };
    }

    if (normalizedStatus.includes("ANUL")) {
        return { accent: "#b91c1c", background: "rgba(185, 28, 28, 0.1)", label: "Anuladas" };
    }

    if (normalizedStatus.includes("PROCES") || normalizedStatus.includes("PEND")) {
        return { accent: "#d97706", background: "rgba(217, 119, 6, 0.12)", label: "No completadas" };
    }

    return { accent: "#475569", background: "rgba(71, 85, 105, 0.1)", label: status || "Otro estado" };
};

const SummaryStatBand = ({ totals }) => (
    <div className="analytics-summary-overview">
        <div className="analytics-summary-total-card">
            <div className="analytics-summary-total-label">Total vendido completado</div>
            <div className="analytics-summary-total-value">{formatCurrency(totals.monto_total)}</div>
            <div className="analytics-summary-total-meta">
                {formatNumber(totals.ventas_count)} venta(s) completada(s) en el periodo seleccionado.
            </div>
        </div>

        <div className="analytics-summary-stat-strip">
            <div className="analytics-summary-mini-stat">
                <div className="analytics-summary-mini-label">Unidades</div>
                <div className="analytics-summary-mini-value">{formatNumber(totals.unidades_count)}</div>
            </div>
            <div className="analytics-summary-mini-stat">
                <div className="analytics-summary-mini-label">Pagos</div>
                <div className="analytics-summary-mini-value">{formatNumber(totals.pagos_count)}</div>
            </div>
            <div className="analytics-summary-mini-stat">
                <div className="analytics-summary-mini-label">Monto pagado</div>
                <div className="analytics-summary-mini-value">{formatCurrency(totals.monto_pagado)}</div>
            </div>
        </div>
    </div>
);

const PaymentMethodSummaryList = ({ data }) => {
    const rows = data || [];
    const maxAmount = Math.max(...rows.map((row) => Number(row.monto_total || 0)), 0);

    if (!rows.length) {
        return <EmptyBlock message="No hay pagos registrados en este periodo." />;
    }

    return (
        <div>
            <div className="analytics-subsection-title">Medios de pago</div>
            <div className="analytics-payment-summary-list">
                {rows.map((row, index) => {
                    const palette = PAYMENT_COLORS[index % PAYMENT_COLORS.length];
                    const amount = Number(row.monto_total || 0);
                    const width = maxAmount > 0 ? Math.max((amount / maxAmount) * 100, 4) : 0;

                    return (
                        <div key={`${row.tipo_venta_id}-${row.medio_pago}`} className="analytics-payment-summary-row">
                            <div className="analytics-payment-summary-main">
                                <div className="analytics-payment-summary-name">
                                    <span className="analytics-dot" style={{ background: palette.accent }} />
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.medio_pago}</span>
                                </div>
                                <div className="analytics-payment-summary-meta">
                                    {formatNumber(row.ventas_count)} venta(s) / {formatNumber(row.pagos_count)} pago(s)
                                </div>
                                <div className="analytics-payment-summary-track">
                                    <div className="analytics-payment-summary-fill" style={{ width: `${width}%`, background: palette.accent }} />
                                </div>
                            </div>
                            <div className="analytics-payment-summary-value">{formatCurrency(amount)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SalesStatusSummary = ({ data }) => {
    const rows = data || [];
    const maxCount = Math.max(...rows.map((row) => Number(row.ventas_count || 0)), 0);

    if (!rows.length) {
        return <EmptyBlock message="No hay estados de venta para este periodo." />;
    }

    return (
        <div>
            <div className="analytics-subsection-title">Estado de ventas</div>
            <div className="analytics-status-list">
                {rows.map((row) => {
                    const palette = getStatusPalette(row.estado);
                    const count = Number(row.ventas_count || 0);
                    const width = maxCount > 0 ? Math.max((count / maxCount) * 100, 4) : 0;

                    return (
                        <div key={`${row.estado_id}-${row.estado}`} className="analytics-status-row" style={{ background: palette.background }}>
                            <div className="analytics-status-main">
                                <div className="analytics-status-name">
                                    <span className="analytics-dot" style={{ background: palette.accent }} />
                                    <span>{palette.label}</span>
                                </div>
                                <div className="analytics-status-meta">
                                    Estado original: {row.estado} / {formatNumber(row.porcentaje)}% del periodo
                                </div>
                                <div className="analytics-status-track">
                                    <div className="analytics-status-fill" style={{ width: `${width}%`, background: palette.accent }} />
                                </div>
                            </div>
                            <div className="analytics-status-value">
                                {formatNumber(count)} venta(s)
                                <div style={{ ...styles.smallText, marginTop: "4px" }}>{formatCurrency(row.monto_total)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SalesByDayChart = ({ data }) => {
    const rows = data || [];
    const maxValue = Math.max(...rows.map((row) => Number(row.monto_total || 0)), 0);

    if (!rows.length) {
        return <EmptyBlock message="No hay ventas en el periodo seleccionado." />;
    }

    return (
        <div className="analytics-chart-wrap">
            {rows.map((row) => {
                const amount = Number(row.monto_total || 0);
                const height = maxValue > 0 ? Math.max((amount / maxValue) * 170, 10) : 10;

                return (
                    <div key={row.fecha} className="analytics-chart-box">
                        <div className="analytics-chart-amount">{formatCurrency(amount)}</div>
                        <div className="analytics-chart-bar" style={{ height: `${height}px` }} />
                        <div className="analytics-chart-label">{formatDate(row.fecha)}</div>
                    </div>
                );
            })}
        </div>
    );
};

const SellerPanel = ({ data, loading, error, rangeLabel }) => {
    const sellers = data?.sellers || [];
    const topByUnits = data?.top_by_units;
    const topByProfit = data?.top_by_profit;
    const maxProfit = Math.max(...sellers.map((seller) => Number(seller.ganancia_total || 0)), 0);

    return (
        <SectionCard
            title="Vendedores"
            description={`Rendimiento asociado al periodo ${rangeLabel}.`}
        >
            {error && <div style={styles.error}>{error}</div>}
            {loading ? (
                <LoadingBlock />
            ) : (
                <div className="analytics-stack">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                        <div style={styles.highlightCard}>
                            <div style={styles.highlightTitle}>Mas productos vendidos</div>
                            <div style={styles.highlightValue}>{topByUnits?.nomvendedor || "-"}</div>
                            <div style={styles.highlightMeta}>{formatNumber(topByUnits?.productos_vendidos)} producto(s)</div>
                        </div>
                        <div style={{ ...styles.highlightCard, background: "linear-gradient(135deg, #eaf7ef 0%, #d7f2df 100%)", borderColor: "#aad9b7" }}>
                            <div style={{ ...styles.highlightTitle, color: "#166534" }}>Mas ganancia</div>
                            <div style={styles.highlightValue}>{topByProfit?.nomvendedor || "-"}</div>
                            <div style={styles.highlightMeta}>{formatCurrency(topByProfit?.ganancia_total)}</div>
                        </div>
                    </div>

                    {sellers.length ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {sellers.slice(0, 5).map((seller) => {
                                const profit = Number(seller.ganancia_total || 0);
                                const width = maxProfit > 0 ? Math.max((profit / maxProfit) * 100, 4) : 0;

                                return (
                                    <div key={seller.idvend || seller.nomvendedor} style={{ background: "#fff7e8", border: "1px solid #ead9bd", borderRadius: "16px", padding: "13px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                                            <strong style={{ color: "#331b16" }}>{seller.nomvendedor}</strong>
                                            <strong style={{ color: "#15803d" }}>{formatCurrency(profit)}</strong>
                                        </div>
                                        <div style={{ ...styles.smallText, marginTop: "5px" }}>
                                            {formatNumber(seller.productos_vendidos)} productos / {formatNumber(seller.ventas_count)} ventas / margen {formatNumber(seller.margen_pct)}%
                                        </div>
                                        <div className="analytics-progress">
                                            <div className="analytics-progress-fill" style={{ width: `${width}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyBlock message="No hay vendedores para mostrar." />
                    )}
                </div>
            )}
        </SectionCard>
    );
};

const ProductInsightCards = ({ salesProducts, profitProducts, monthlyData, productsRangeLabel, profitRangeLabel }) => {
    const topSales = salesProducts?.[0];
    const topProfit = profitProducts?.[0];
    const firstMonth = monthlyData?.[0];
    const monthLeader = firstMonth?.products?.[0];

    return (
        <div className="analytics-product-insights">
            <article className="analytics-product-insight analytics-product-insight-sales">
                <div>
                    <div className="analytics-product-insight-label">Mas vendido</div>
                    <div className="analytics-product-insight-value">{topSales?.nomproducto || "Sin datos"}</div>
                </div>
                <div className="analytics-product-insight-meta">
                    {topSales ? `${formatNumber(topSales.cantidad_total)} und. / ${formatCurrency(topSales.monto_venta)} en ${productsRangeLabel}` : "Sin ventas en el periodo."}
                </div>
            </article>

            <article className="analytics-product-insight analytics-product-insight-profit">
                <div>
                    <div className="analytics-product-insight-label" style={{ color: "#166534" }}>Mayor ganancia</div>
                    <div className="analytics-product-insight-value">{topProfit?.nomproducto || "Sin datos"}</div>
                </div>
                <div className="analytics-product-insight-meta">
                    {topProfit ? `${formatCurrency(topProfit.ganancia_total)} / margen ${formatNumber(topProfit.margen_pct)}% en ${profitRangeLabel}` : "Sin ganancia para mostrar."}
                </div>
            </article>

            <article className="analytics-product-insight analytics-product-insight-month">
                <div>
                    <div className="analytics-product-insight-label" style={{ color: "#6b21a8" }}>Mes destacado</div>
                    <div className="analytics-product-insight-value">{monthLeader?.nomproducto || "Sin datos"}</div>
                </div>
                <div className="analytics-product-insight-meta">
                    {monthLeader && firstMonth ? `${formatMonth(firstMonth.month)} / ${formatNumber(monthLeader.cantidad_total)} und.` : "Selecciona meses para comparar."}
                </div>
            </article>
        </div>
    );
};

const ProductsSalesChart = ({ products }) => {
    const rows = products || [];
    const maxUnits = Math.max(...rows.map((product) => Number(product.cantidad_total || 0)), 0);

    if (!rows.length) return <EmptyBlock message="No hay productos vendidos en este periodo." />;

    return (
        <div className="analytics-product-chart-list">
            {rows.map((product, index) => {
                const units = Number(product.cantidad_total || 0);
                const width = maxUnits > 0 ? Math.max((units / maxUnits) * 100, 4) : 0;

                return (
                    <article key={product.idprod || `${product.nomproducto}-${index}`} className="analytics-product-row-card">
                        <div className="analytics-product-row-main">
                            <span style={styles.rank}>{index + 1}</span>
                            <div style={{ minWidth: 0 }}>
                                <div className="analytics-product-name" title={product.nomproducto}>{product.nomproducto}</div>
                                <div className="analytics-product-meta">
                                    {formatNumber(product.ventas_count)} venta(s) / {formatCurrency(product.monto_venta)} vendido
                                </div>
                            </div>
                            <div className="analytics-product-value">{formatNumber(units)} und.</div>
                        </div>
                        <div className="analytics-product-track">
                            <div className="analytics-product-fill-sales" style={{ width: `${width}%` }} />
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

const ProductsProfitChart = ({ products }) => {
    const rows = products || [];
    const maxProfit = Math.max(...rows.map((product) => Number(product.ganancia_total || 0)), 0);

    if (!rows.length) return <EmptyBlock message="No hay ganancia registrada en este periodo." />;

    return (
        <div className="analytics-product-chart-list">
            {rows.map((product, index) => {
                const sale = Number(product.monto_venta || 0);
                const cost = Number(product.costo_total || 0);
                const profit = Number(product.ganancia_total || 0);
                const profitWidth = maxProfit > 0 ? Math.max((profit / maxProfit) * 100, 4) : 0;
                const costWidth = sale > 0 ? Math.min((cost / sale) * 100, 100) : 0;
                const gainWidth = sale > 0 ? Math.max(Math.min((profit / sale) * 100, 100), 0) : 0;

                return (
                    <article key={product.idprod || `${product.nomproducto}-${index}`} className="analytics-product-row-card">
                        <div className="analytics-product-row-main">
                            <span style={{ ...styles.rank, background: "#166534" }}>{index + 1}</span>
                            <div style={{ minWidth: 0 }}>
                                <div className="analytics-product-name" title={product.nomproducto}>{product.nomproducto}</div>
                                <div className="analytics-product-meta">
                                    {formatNumber(product.cantidad_total)} und. / margen {formatNumber(product.margen_pct)}%
                                </div>
                            </div>
                            <div className="analytics-product-value" style={{ color: "#166534" }}>{formatCurrency(profit)}</div>
                        </div>
                        <div className="analytics-product-track">
                            <div className="analytics-product-fill-profit" style={{ width: `${profitWidth}%` }} />
                        </div>
                        <div className="analytics-profit-stack">
                            <div className="analytics-profit-stack-row">
                                <span>Costo</span>
                                <div className="analytics-profit-stack-track">
                                    <div className="analytics-profit-stack-fill-cost" style={{ width: `${costWidth}%` }} />
                                </div>
                                <span>{formatCurrency(cost)}</span>
                            </div>
                            <div className="analytics-profit-stack-row">
                                <span>Ganancia</span>
                                <div className="analytics-profit-stack-track">
                                    <div className="analytics-profit-stack-fill-gain" style={{ width: `${gainWidth}%` }} />
                                </div>
                                <span>{formatCurrency(profit)}</span>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

const MonthlyProducts = ({ months }) => {
    if (!months?.length) return <EmptyBlock message="No hay meses para mostrar." />;

    return (
        <div className="analytics-product-month-grid-v2">
            {months.map((month) => {
                const products = month.products || [];
                const monthUnits = products.reduce((total, product) => total + Number(product.cantidad_total || 0), 0);
                const monthSales = products.reduce((total, product) => total + Number(product.monto_venta || 0), 0);
                const maxUnits = Math.max(...products.map((product) => Number(product.cantidad_total || 0)), 0);
                const leader = products[0];

                return (
                    <article key={month.month} className="analytics-product-month-card-v2">
                        <div className="analytics-product-month-header">
                            <div>
                                <div className="analytics-product-month-title">{formatMonth(month.month)}</div>
                                <div style={styles.smallText}>{formatNumber(monthUnits)} und. / {formatCurrency(monthSales)}</div>
                            </div>
                            <span style={styles.badge}>Top {products.length}</span>
                        </div>

                        {leader && (
                            <div className="analytics-product-month-leader">
                                <div style={{ ...styles.smallText, fontWeight: "900", textTransform: "uppercase" }}>Lider del mes</div>
                                <div style={{ color: "#331b16", fontWeight: "900", marginTop: "5px" }}>{leader.nomproducto}</div>
                                <div style={styles.smallText}>{formatNumber(leader.cantidad_total)} und. / {formatCurrency(leader.monto_venta)}</div>
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                            {products.map((product, index) => {
                                const units = Number(product.cantidad_total || 0);
                                const width = maxUnits > 0 ? Math.max((units / maxUnits) * 100, 4) : 0;

                                return (
                                    <div key={`${month.month}-${product.idprod}-${index}`}>
                                        <div className="analytics-product-mini-row">
                                            <span style={{ ...styles.rank, width: "26px", height: "26px", fontSize: "11px", background: index === 0 ? "#7f1d1d" : "#d97706" }}>{index + 1}</span>
                                            <div style={{ minWidth: 0 }}>
                                                <div className="analytics-product-name" title={product.nomproducto}>{product.nomproducto}</div>
                                                <div style={styles.smallText}>{formatCurrency(product.monto_venta)}</div>
                                            </div>
                                            <strong style={{ color: "#7f1d1d", whiteSpace: "nowrap" }}>{formatNumber(units)} und.</strong>
                                        </div>
                                        <div className="analytics-product-mini-track">
                                            <div className="analytics-product-mini-fill" style={{ width: `${width}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </article>
                );
            })}
        </div>
    );
};


const Analytics = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeView, setActiveView] = useState(VIEW_MODES.SUMMARY);

    const [paymentRange, setPaymentRange] = useState("today");
    const [productsRange, setProductsRange] = useState("7d");
    const [profitRange, setProfitRange] = useState("7d");
    const [monthlyMonths, setMonthlyMonths] = useState("12");

    const [paymentSummary, setPaymentSummary] = useState(null);
    const [sellersPerformance, setSellersPerformance] = useState(null);
    const [topProducts, setTopProducts] = useState(null);
    const [profitProducts, setProfitProducts] = useState(null);
    const [monthlyTopProducts, setMonthlyTopProducts] = useState(null);

    const [loading, setLoading] = useState({
        payment: false,
        sellers: false,
        products: false,
        profit: false,
        monthly: false,
    });

    const [errors, setErrors] = useState({
        payment: "",
        sellers: "",
        products: "",
        profit: "",
        monthly: "",
    });

    const sellerRange = useMemo(() => getSellerRangeFromPaymentRange(paymentRange), [paymentRange]);
    const paymentTotals = paymentSummary?.totals || {};

    useEffect(() => {
        const storedAuthData = sessionStorage.getItem("authData");
        if (!storedAuthData) {
            navigate("/");
            return;
        }

        try {
            const parsedAuthData = JSON.parse(storedAuthData);
            if (parsedAuthData.role !== "admin") {
                navigate("/no-autorizado");
                return;
            }
            setIsAuthorized(true);
        } catch (error) {
            console.error("Error parseando authData:", error);
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (!isAuthorized) return;
        if (![VIEW_MODES.SUMMARY, VIEW_MODES.PAYMENT_DETAIL].includes(activeView)) return;

        const fetchPaymentSummary = async () => {
            setLoading((prev) => ({ ...prev, payment: true }));
            setErrors((prev) => ({ ...prev, payment: "" }));
            try {
                const data = await analyticsService.getPaymentSummary(paymentRange);
                setPaymentSummary(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, payment: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, payment: false }));
            }
        };

        fetchPaymentSummary();
    }, [activeView, isAuthorized, paymentRange]);

    useEffect(() => {
        if (!isAuthorized) return;
        if (activeView !== VIEW_MODES.SUMMARY) return;

        const fetchSellersPerformance = async () => {
            setLoading((prev) => ({ ...prev, sellers: true }));
            setErrors((prev) => ({ ...prev, sellers: "" }));
            try {
                const data = await analyticsService.getSellersPerformance(sellerRange, 8);
                setSellersPerformance(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, sellers: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, sellers: false }));
            }
        };

        fetchSellersPerformance();
    }, [activeView, isAuthorized, sellerRange]);

    useEffect(() => {
        if (!isAuthorized) return;
        if (activeView !== VIEW_MODES.PRODUCTS) return;

        const fetchTopProducts = async () => {
            setLoading((prev) => ({ ...prev, products: true }));
            setErrors((prev) => ({ ...prev, products: "" }));
            try {
                const data = await analyticsService.getTopProducts(productsRange, 12);
                setTopProducts(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, products: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, products: false }));
            }
        };

        fetchTopProducts();
    }, [activeView, isAuthorized, productsRange]);

    useEffect(() => {
        if (!isAuthorized) return;
        if (activeView !== VIEW_MODES.PRODUCTS) return;

        const fetchProfitProducts = async () => {
            setLoading((prev) => ({ ...prev, profit: true }));
            setErrors((prev) => ({ ...prev, profit: "" }));
            try {
                const data = await analyticsService.getTopProfitProducts(profitRange, 12);
                setProfitProducts(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, profit: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, profit: false }));
            }
        };

        fetchProfitProducts();
    }, [activeView, isAuthorized, profitRange]);

    useEffect(() => {
        if (!isAuthorized) return;
        if (activeView !== VIEW_MODES.PRODUCTS) return;

        const fetchMonthlyTopProducts = async () => {
            setLoading((prev) => ({ ...prev, monthly: true }));
            setErrors((prev) => ({ ...prev, monthly: "" }));
            try {
                const data = await analyticsService.getMonthlyTopProducts(Number(monthlyMonths), 5);
                setMonthlyTopProducts(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, monthly: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, monthly: false }));
            }
        };

        fetchMonthlyTopProducts();
    }, [activeView, isAuthorized, monthlyMonths]);

    if (!isAuthorized) {
        return (
            <main className="analytics-page" style={styles.page}>
                <style>{css}</style>
                <div style={styles.shell}>
                    <EmptyBlock message="Validando acceso..." />
                </div>
            </main>
        );
    }

    const renderHeroActions = () => {
        if (activeView === VIEW_MODES.PRODUCTS) {
            return (
                <div className="analytics-hero-actions">
                    <ActionButton variant="primary" onClick={() => setActiveView(VIEW_MODES.SUMMARY)}>Volver al resumen</ActionButton>
                </div>
            );
        }

        if (activeView === VIEW_MODES.PAYMENT_DETAIL) {
            return (
                <div className="analytics-hero-actions">
                    <ActionButton variant="primary" onClick={() => setActiveView(VIEW_MODES.SUMMARY)}>Volver al resumen</ActionButton>
                    <ActionButton onClick={() => setActiveView(VIEW_MODES.PRODUCTS)}>Analiticas de productos</ActionButton>
                </div>
            );
        }

        return (
            <div className="analytics-hero-actions">
                <ActionButton variant="primary" onClick={() => setActiveView(VIEW_MODES.PAYMENT_DETAIL)}>Mas informacion de pagos</ActionButton>
                <ActionButton onClick={() => setActiveView(VIEW_MODES.PRODUCTS)}>Analiticas de productos</ActionButton>
            </div>
        );
    };

    const heroTitle = activeView === VIEW_MODES.PRODUCTS ? "Analiticas de productos" : activeView === VIEW_MODES.PAYMENT_DETAIL ? "Detalle de pagos" : "Analiticas";
    const heroSubtitle = activeView === VIEW_MODES.PRODUCTS
        ? "Productos mas vendidos, productos con mayor ganancia y comportamiento por mes en una vista enfocada."
        : activeView === VIEW_MODES.PAYMENT_DETAIL
            ? "Detalle del periodo seleccionado por dia y por medio de pago."
            : "Resumen rapido de ventas, medios de pago y rendimiento de vendedores.";

    return (
        <main className="analytics-page" style={styles.page}>
            <style>{css}</style>
            <div style={styles.shell}>
                <header style={styles.hero}>
                    <div className="analytics-hero-top" style={styles.heroTop}>
                        <div>
                            <h1 className="analytics-hero-title" style={styles.title}>{heroTitle}</h1>
                            <p style={styles.subtitle}>{heroSubtitle}</p>
                        </div>
                        {renderHeroActions()}
                    </div>

                    {activeView !== VIEW_MODES.PRODUCTS && (
                        <div className="analytics-period-control" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
                            <div>
                                <div style={{ fontWeight: "900", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.7px" }}>Periodo del resumen</div>
                                <div style={{ color: "rgba(255, 250, 240, 0.78)", fontSize: "13px", marginTop: "4px" }}>
                                    El mismo periodo controla pagos, ventas por dia y el bloque de vendedores.
                                </div>
                            </div>
                            <RangeSelect value={paymentRange} onChange={setPaymentRange} options={PAYMENT_RANGES} />
                        </div>
                    )}
                </header>

                {activeView === VIEW_MODES.SUMMARY && (
                    <div className="analytics-main-grid">
                        <div className="analytics-stack">
                            <SectionCard
                                title="Resumen por medio de pago"
                                description={`Periodo seleccionado: ${getPaymentRangeLabel(paymentRange)}.`}
                                rightContent={<button className="analytics-row-link" type="button" onClick={() => setActiveView(VIEW_MODES.PAYMENT_DETAIL)}>Ver detalle</button>}
                            >
                                {errors.payment && <div style={styles.error}>{errors.payment}</div>}
                                {loading.payment ? (
                                    <LoadingBlock />
                                ) : (
                                    <>
                                        <SummaryStatBand totals={paymentTotals} />

                                        {Number(paymentTotals.ventas_sin_pago_o_descuadradas_count || 0) > 0 && (
                                            <div style={styles.error}>
                                                Hay {formatNumber(paymentTotals.ventas_sin_pago_o_descuadradas_count)} venta(s) sin pago o con pagos descuadrados por {formatCurrency(paymentTotals.monto_sin_pago_o_descuadrado)}.
                                            </div>
                                        )}

                                        <div className="analytics-summary-content-grid">
                                            <PaymentMethodSummaryList data={paymentSummary?.by_payment_method || []} />
                                            <SalesStatusSummary data={paymentSummary?.sales_status || []} />
                                        </div>
                                    </>
                                )}
                            </SectionCard>

                            <SectionCard title="Ventas por dia" description="Evolucion simple del monto vendido en el periodo seleccionado.">
                                {errors.payment && <div style={styles.error}>{errors.payment}</div>}
                                {loading.payment ? <LoadingBlock /> : <SalesByDayChart data={paymentSummary?.sales_by_day || []} />}
                            </SectionCard>
                        </div>

                        <SellerPanel
                            data={sellersPerformance}
                            loading={loading.sellers}
                            error={errors.sellers}
                            rangeLabel={getPaymentRangeLabel(paymentRange)}
                        />
                    </div>
                )}

                {activeView === VIEW_MODES.PAYMENT_DETAIL && (
                    <div className="analytics-stack">
                        <SectionCard
                            title="Detalle general de pagos"
                            description={`Periodo seleccionado: ${getPaymentRangeLabel(paymentRange)}.`}
                        >
                            {errors.payment && <div style={styles.error}>{errors.payment}</div>}
                            {loading.payment ? (
                                <LoadingBlock />
                            ) : (
                                <>
                                    <div className="analytics-metric-grid" style={styles.metricGrid}>
                                        <MetricCard label="Ventas" value={formatNumber(paymentTotals.ventas_count)} />
                                        <MetricCard label="Unidades" value={formatNumber(paymentTotals.unidades_count)} />
                                        <MetricCard label="Pagos" value={formatNumber(paymentTotals.pagos_count)} />
                                        <MetricCard label="Monto vendido" value={formatCurrency(paymentTotals.monto_total)} />
                                    </div>
                                    <PaymentMethodCards data={paymentSummary?.by_payment_method || []} />
                                </>
                            )}
                        </SectionCard>

                        <SectionCard title="Detalle diario por medio de pago" description="Cada fila representa cuanto se cobro por medio de pago en cada dia.">
                            {loading.payment ? (
                                <LoadingBlock />
                            ) : (paymentSummary?.payment_by_day || []).length ? (
                                <div style={styles.tableContainer}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Fecha</th>
                                                <th style={styles.th}>Medio</th>
                                                <th style={styles.th}>Ventas</th>
                                                <th style={styles.th}>Pagos</th>
                                                <th style={styles.th}>Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentSummary.payment_by_day.map((row, index) => (
                                                <tr key={`${row.fecha}-${row.tipo_venta_id}-${index}`}>
                                                    <td style={styles.td}>{formatDate(row.fecha)}</td>
                                                    <td style={styles.td}><strong>{row.medio_pago}</strong></td>
                                                    <td style={styles.td}>{formatNumber(row.ventas_count)}</td>
                                                    <td style={styles.td}>{formatNumber(row.pagos_count)}</td>
                                                    <td style={styles.td}><strong>{formatCurrency(row.monto_total)}</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyBlock />
                            )}
                        </SectionCard>
                    </div>
                )}

                {activeView === VIEW_MODES.PRODUCTS && (
                    <div className="analytics-stack">
                        <SectionCard
                            title="Panel de productos"
                            description="Primero revisa los lideres del periodo y luego baja al ranking visual. Las barras comparan productos entre si."
                        >
                            <div className="analytics-product-control-panel">
                                <div className="analytics-product-filter-card">
                                    <div>
                                        <div className="analytics-product-filter-label">Mas vendidos</div>
                                        <div className="analytics-product-filter-help">Ordenado por unidades.</div>
                                    </div>
                                    <RangeSelect value={productsRange} onChange={setProductsRange} options={PRODUCT_RANGES} />
                                </div>
                                <div className="analytics-product-filter-card">
                                    <div>
                                        <div className="analytics-product-filter-label">Mas ganancia</div>
                                        <div className="analytics-product-filter-help">Venta menos costo.</div>
                                    </div>
                                    <RangeSelect value={profitRange} onChange={setProfitRange} options={PRODUCT_RANGES} />
                                </div>
                                <div className="analytics-product-filter-card">
                                    <div>
                                        <div className="analytics-product-filter-label">Por mes</div>
                                        <div className="analytics-product-filter-help">Comparativa mensual.</div>
                                    </div>
                                    <RangeSelect value={monthlyMonths} onChange={setMonthlyMonths} options={MONTH_OPTIONS} />
                                </div>
                            </div>

                            <ProductInsightCards
                                salesProducts={topProducts?.products || []}
                                profitProducts={profitProducts?.products || []}
                                monthlyData={monthlyTopProducts?.months || []}
                                productsRangeLabel={getProductRangeLabel(productsRange)}
                                profitRangeLabel={getProductRangeLabel(profitRange)}
                            />
                        </SectionCard>

                        <div className="analytics-product-board">
                            <SectionCard
                                title="Ranking visual: mas vendidos"
                                description={`Top por unidades vendidas en ${getProductRangeLabel(productsRange)}.`}
                            >
                                {errors.products && <div style={styles.error}>{errors.products}</div>}
                                {loading.products ? <LoadingBlock /> : <ProductsSalesChart products={topProducts?.products || []} />}
                            </SectionCard>

                            <SectionCard
                                title="Ranking visual: mas ganancia"
                                description={`Ganancia por producto en ${getProductRangeLabel(profitRange)}. Incluye costo, venta y margen.`}
                            >
                                {errors.profit && <div style={styles.error}>{errors.profit}</div>}
                                {loading.profit ? <LoadingBlock /> : <ProductsProfitChart products={profitProducts?.products || []} />}
                            </SectionCard>
                        </div>

                        <SectionCard
                            title="Productos mas vendidos por mes"
                            description="Cada tarjeta resume un mes, marca el lider y muestra barras proporcionales para comparar rapido."
                        >
                            {errors.monthly && <div style={styles.error}>{errors.monthly}</div>}
                            {loading.monthly ? <LoadingBlock /> : <MonthlyProducts months={monthlyTopProducts?.months || []} />}
                        </SectionCard>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Analytics;
