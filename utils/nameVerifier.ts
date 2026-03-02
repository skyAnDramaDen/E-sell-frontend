export function username_verifier(name: string) {
    const cleaned_username = name.trim().toLowerCase();

    return {
        hasSpace: /\s/.test(cleaned_username),
        isLongEnough: cleaned_username.length >= 5,
        hasInvalidSymbol: /[^a-z0-9]/.test(cleaned_username),
        isValid:
            cleaned_username.length >= 5 &&
            !/\s/.test(cleaned_username) &&
            !/[^a-z0-9]/.test(cleaned_username),
    };
}

export function email_verifier(email: string) {
    if (typeof email !== "string") return false;

    const parts = email.split("@");

    if (parts.length !== 2) return false;

    const local = parts[0];
    const domain = parts[1];

    const localRegex = /^[a-zA-Z0-9._-]+$/;
    if (!localRegex.test(local)) return false;

    if (!domain.includes(".")) return false;

    const domainRegex = /^[a-zA-Z0-9.-]+$/;
    if (!domainRegex.test(domain)) return false;

    if (/^[.-]/.test(domain) || /[.-]$/.test(domain)) return false;

    return true;
}

