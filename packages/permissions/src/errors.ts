export class RoleNotFoundError extends Error {
    constructor(name: unknown) {
        super(`Role ${name} not found`);
    }
}

export class InvalidFallbackRoleError extends Error {
    constructor(name: unknown) {
        super(`Role ${name} cannot be fallback role of itself`);
    }
}
