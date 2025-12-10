import { Appliance } from '@/lib/models/Appliance';

describe('Entity', () => {
  /**
   * Test Method: Validates that fromJSON creates a proper instance */
  test('test_fromJSON_withValidJSON', () => {
    // Arrange
    const jsonData = {
      id: 1,
      name: 'Test Appliance',
      brand: 'TestBrand',
      model: 'Model123',
      category: 'Kitchen',
      warrantyMonths: 12,
    };

 
    const appliance = Appliance.fromJSON(jsonData);

    // Test apppliance instance properties 
    expect(appliance).toBeInstanceOf(Appliance);
    expect(appliance.id).toBe(1);
    expect(appliance.name).toBe('Test Appliance');
    expect(appliance.brand).toBe('TestBrand');
    expect(appliance.model).toBe('Model123');
    expect(appliance.category).toBe('Kitchen');
    expect(appliance.warrantyMonths).toBe(12);
  });
});
