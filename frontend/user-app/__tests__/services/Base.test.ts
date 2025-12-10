import { BaseService } from "@/lib/services/Base";
import { ApiClient } from "@/lib/services/ApiClient";
import { Appliance } from "@/lib/models/Appliance";

// Create a test class since BaseService is abstract
class TestApplianceService extends BaseService<Appliance> {
  constructor(api: ApiClient) {
    super(api, "/api/appliances", Appliance);
  }
}

describe("BaseService.create", () => {
  let service: TestApplianceService;
  let mockApi: any;
  let appliance: Appliance;

  beforeEach(() => {
    mockApi = {
      http: {
        post: jest.fn().mockResolvedValue({
          data: { name: "Sony TV",
          brand: "Sony",
          model: "X900H",
          warrantyMonths: 24 } 
        })
      }
    };

    service = new TestApplianceService(mockApi as unknown as ApiClient);

    appliance = new Appliance();
    appliance.setName("SonyTV");
    appliance.setBrand("Sony");
    appliance.setModel("X900H");
    appliance.setWarrantyMonths(24);
  });
// Test Method 4: Validates that create throws a validation error when required fields are missing
  test("throw_validation_error_when_required_fields_fails", async () => {
    appliance.setName("");

    await expect(service.create(appliance))
      .rejects
      .toThrow("Name is required.");
  });
// Test Method : Validates that create sends correct payload and processes response
  test("validate_correct_payload_and_processes_response", async () => {
    const result = await service.create(appliance);

    expect(mockApi.http.post).toHaveBeenCalledWith(
      "/api/appliances", expect.any(Object)
    );
    expect(result).toBeInstanceOf(Appliance);
    expect(result.name).toBe("Sony TV");
    expect(result.brand).toBe("Sony");
    expect(result.model).toBe("X900H");
    expect(result.warrantyMonths).toBe(24)
  });
});