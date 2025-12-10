import { ApiClient } from './ApiClient';
import { User } from '@/lib/models/User';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export class UserService {
  private api: ApiClient;

  constructor(api = new ApiClient()) {
    this.api = api;
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.http.get('/api/users/me', {
      headers: this.getAuthHeader()
    });
    return new User(response.data.name, response.data.email, undefined, response.data.id);
  }

  async updateProfile(request: UpdateProfileRequest): Promise<User> {
    const response = await this.api.http.put('/api/users/me', request, {
      headers: this.getAuthHeader()
    });
    return new User(response.data.name, response.data.email, undefined, response.data.id);
  }

  async changePassword(request: ChangePasswordRequest): Promise<string> {
    const response = await this.api.http.put('/api/users/me/password', request, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}
