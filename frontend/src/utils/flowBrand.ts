export const getFlowSupportEmail = () => {
    const email = (globalThis as any)?.frappe?.boot?.flow_brand?.support_email
    return typeof email === "string" ? email : ""
}
