import { BaseService } from './Base';
import { ApiClient } from './ApiClient';
import { Appliance } from '@/lib/models/Appliance';

export class ApplianceService extends BaseService<Appliance> {
  constructor(api = new ApiClient()) {
    // TODO: Get userId from logged in user context instead of hardcoding
    const userId = 1; // Hardcoded for now - should come from auth
    super(api, `/api/${userId}/appliances`, Appliance);
  }
}
