import { BaseService } from './Base';
import { ApiClient } from './ApiClient';
import { Appliance } from '@/lib/models/Appliance';

export class ApplianceService extends BaseService<Appliance> {
  private userId: number;

  constructor(api = new ApiClient()) {
    // TODO: Get userId from logged in user context instead of hardcoding
    const userId = 1; // Hardcoded for now - should come from auth
    super(api, `/api/${userId}/appliances`, Appliance);
    this.userId = userId;
  }

  async snoozeAlert(applianceId: number, days: number): Promise<Appliance> {
    const response = await this.api.http.post(`${this.basePath}/${applianceId}/alert/snooze?days=${days}`, {});
    return Appliance.fromJSON(response.data);
  }

  async cancelAlert(applianceId: number): Promise<Appliance> {
    const response = await this.api.http.post(`${this.basePath}/${applianceId}/alert/cancel`, {});
    return Appliance.fromJSON(response.data);
  }

  async reactivateAlert(applianceId: number): Promise<Appliance> {
    const response = await this.api.http.post(`${this.basePath}/${applianceId}/alert/reactivate`, {});
    return Appliance.fromJSON(response.data);
  }
}
