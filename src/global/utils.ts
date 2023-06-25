export function generateId(length: number = 10) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randChar = () => chars[Math.floor(Math.random() * chars.length)];
    const id = 'X'.repeat(length).replace(/X/g, randChar);
    return id;
}