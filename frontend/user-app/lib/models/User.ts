import { Entity } from "./Entity";

export class User extends Entity{
    public firstName?: string;
    public lastName?: string;
    public birthday?: string;
    public profilePictureUrl?: string;

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
    setFirstName(firstName: string): void {
        this.firstName = firstName;
    }
    setLastName(lastName: string): void {
        this.lastName = lastName;
    }
    setBirthday(birthday: string): void {
        this.birthday = birthday;
    }
    setProfilePictureUrl(url: string): void {
        this.profilePictureUrl = url;
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
        if (this.firstName) payload.firstName = this.firstName;
        if (this.lastName) payload.lastName = this.lastName;
        if (this.birthday) payload.birthday = this.birthday;
        if (this.profilePictureUrl) payload.profilePictureUrl = this.profilePictureUrl;
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
