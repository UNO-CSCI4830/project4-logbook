import { Appliance } from '@/lib/models/Appliance';

describe('Appliance', () => {

  /* Test Method 1: Validates that an appliance with all required fields passes validation */
  
  test('test_validate_withValidData', () => {
    //Arrange - Test valid data
    const validAppliance = new Appliance();
    validAppliance.setName('Samsung Refrigerator');
    validAppliance.setBrand('Samsung');
    validAppliance.setModel('RF28R7351SR');
    validAppliance.setWarrantyMonths(12);

    //  Test invalid data for missing required fields
    const validErrors = validAppliance.validate();
    
    expect(validErrors).toHaveLength(0);
  });
  /* Test Method 2: Validates that an appliance with missing field and negative warnnranties produce an error */
  test('test_validate_withInvalidData', () => {
    // Arrange - Test invalid data
    const invalidAppliance = new Appliance();

     //  Test negative warranty
    const negativeWarrantyAppliance = new Appliance();
    negativeWarrantyAppliance.setName('LG Washer');
    negativeWarrantyAppliance.setBrand('LG');
    negativeWarrantyAppliance.setModel('WM9000HVA');
    negativeWarrantyAppliance.setWarrantyMonths(-5);

    // Act
    const invalidErrors = invalidAppliance.validate();
    const negativeWarrantyErrors = negativeWarrantyAppliance.validate();
    
    // Invalid data should return errors for missing fields
    expect(invalidErrors.length).toBeGreaterThan(0);
    expect(invalidErrors).toContain('Name is required.');
    expect(invalidErrors).toContain('Brand is required.');
    expect(invalidErrors).toContain('Model is required.');
    
    //Negative warranty should be caught
    expect(negativeWarrantyErrors).toContain('Warranty must be ≥ 0.');
  });

  /**
   * Test Method 3: Validates that toPayload() strips empty strings */
  test.only('test_toPayload_withEmptyStrings', () => {
    // Arrange
    const appliance = new Appliance();
    appliance.setName('Bosch Dishwasher');
    appliance.setBrand('Bosch');
    appliance.setModel('SHPM88Z75N');
    appliance.setCategory(''); 
    appliance.setSerialNumber(''); 
    appliance.setWarrantyMonths(24);

 
    const payload = appliance.toPayload();

    // Test that empty string fields are omitted from payload
    expect(payload.name).toBe('Bosch Dishwasher');
    expect(payload.brand).toBe('Bosch');
    expect(payload.model).toBe('SHPM88Z75N');
    expect(payload.warrantyMonths).toBe(24);
    expect(payload).not.toHaveProperty('category');
    expect(payload).not.toHaveProperty('serialNumber');
  });
});
