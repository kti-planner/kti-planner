import z from 'zod';

export function formatDateLocalYyyyMmDd(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function formatDateLocalHhMm(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatDateLocalYyyyMmDdHhMm(date: Date): string {
    return `${formatDateLocalYyyyMmDd(date)}T${formatDateLocalHhMm(date)}`;
}

export function toHyphenatedLowercase(str: string): string {
    return str.trim().toLocaleLowerCase().replaceAll(/\s+/g, '-');
}

export function generatePassword() {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(12))));
}

export const dateStringSchema = z.iso.date().transform(str => {
    return new Date(`${str}T00:00:00`);
});

export const dateTimeStringSchema = z.iso.datetime({ local: true }).transform(str => {
    return new Date(str);
});
