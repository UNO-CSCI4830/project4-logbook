import { Entity } from "./Entity";

export class User extends Entity{
    constructor(
        public name: string = '',
        public email: string = '',
        public password?: string,
        id?: number
    ){
        super(id);
    }

    // Setters for user properties
    setName(name: string): void {
        this.name = name;
    } 
    setEmail(email: string): void {
        this.email = email;
    }
    setPassword(password: string): void {
        this.password = password;
    }
    validate(): string[] {
        const errors: string[] = [];
        if (!this.email) errors.push('Email is required');
        if (!this.name) errors.push('Name is required');
        return errors;
    }  
    toPayload(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            name: this.name,
            email: this.email,
        };
        if (this.id !== undefined) payload.id = this.id;
        if (this.password) payload.password = this.password;
        return payload;
    }
}
    
export interface UserCredentials {
    email: string;
    password: string;
}
export interface AuthResponse {
    message: string;
    user?: User;
}
    