export function generateId(length: number = 10) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randChar = () => chars[Math.floor(Math.random() * chars.length)];
    const id = 'X'.repeat(length).replace(/X/g, randChar);
    return id;
}

export function ensureArray<T>(obj: any | Array<any>): Array<T> {
    return (Array.isArray(obj) ? obj : [obj]) as Array<T>;
}

export function getTs() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}