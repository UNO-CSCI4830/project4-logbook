import { BaseService } from './Base';
import { ApiClient } from './ApiClient';
import { Appliance } from '@/lib/models/Appliance';

export class ApplianceService extends BaseService<Appliance> {
  constructor(api = new ApiClient()) {
    super(api, '/api/appliances', Appliance);
  }
}
