export function formatDateLocalYyyyMmDd(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function toHyphenatedLowercase(str: string): string {
    return str.trim().toLocaleLowerCase().replaceAll(/\s+/g, '-');
}

export function generatePassword() {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(12))));
}
