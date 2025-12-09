import { Entity } from './Entity';

export class Appliance extends Entity<number> {
  name = '';
  category?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;   // yyyy-mm-dd
  warrantyMonths?: number;
  conditionText?: string;
  notes?: string;
  alertDate?: string;      // yyyy-mm-dd
  alertStatus?: string;    // ACTIVE, SNOOZED, CANCELLED
  snoozeUntil?: string;    // yyyy-mm-dd
  recurringInterval?: string;  // NONE, MONTHLY, YEARLY, CUSTOM
  recurringIntervalDays?: number;  // For custom intervals

  /** Override fromJSON to handle date conversion from backend */
  static fromJSON(json: any): Appliance {
    const instance = new Appliance();
    Object.assign(instance, json);

    // Convert Date objects or timestamps to yyyy-mm-dd strings
    if (json.alertDate) {
      instance.alertDate = this.toDateString(json.alertDate);
    }
    if (json.purchaseDate) {
      instance.purchaseDate = this.toDateString(json.purchaseDate);
    }

    return instance;
  }

  /** Convert Date object or timestamp to yyyy-mm-dd string */
  private static toDateString(value: any): string {
    // LocalDate from backend comes as simple string "yyyy-mm-dd"
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return value;
    }

    // Handle any other format (legacy Date objects, ISO strings, etc.)
    if (typeof value === 'string' && value.includes('T')) {
      return value.split('T')[0];
    }

    // Fallback for Date objects
    const date = new Date(value);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Setters for appliance properties */
  setName(name: string): void {
    this.name = name;
  }

  setCategory(category: string): void {
    this.category = category;
  }

  setBrand(brand: string): void {
    this.brand = brand;
  }

  setModel(model: string): void {
    this.model = model;
  }

  setSerialNumber(serialNumber: string): void {
    this.serialNumber = serialNumber;
  }

  setPurchaseDate(purchaseDate: string): void {
    this.purchaseDate = purchaseDate;
  }

  setWarrantyMonths(warrantyMonths: number): void {
    this.warrantyMonths = warrantyMonths;
  }

  setConditionText(conditionText: string): void {
    this.conditionText = conditionText;
  }

  setNotes(notes: string): void {
    this.notes = notes;
  }

  setAlertDate(alertDate: string): void {
    this.alertDate = alertDate;
  }

  /** name required, warrantyMonths ≥ 0, date */
  override validate(): string[] {
    const errs: string[] = [];
    if (!this.name?.trim()) errs.push('Name is required.');
    if (!this.brand?.trim()) errs.push('Brand is required.');
    if (!this.model?.trim()) errs.push('Model is required.');
    if (this.warrantyMonths != null && this.warrantyMonths < 0) errs.push('Warranty must be ≥ 0.');
    return errs;
  }

  /** Example: strip empty strings before sending */
  override toPayload() {
    const raw: any = {
      id: this.id,
      name: this.name,
      category: this.category,
      brand: this.brand,
      model: this.model,
      serialNumber: this.serialNumber,
      purchaseDate: this.purchaseDate,
      warrantyMonths: this.warrantyMonths,
      conditionText: this.conditionText,
      notes: this.notes,
      alertDate: this.alertDate,
      recurringInterval: this.recurringInterval,
      recurringIntervalDays: this.recurringIntervalDays
    };

    Object.keys(raw).forEach(k => raw[k] === '' && delete raw[k]);
    return raw;
  }


}
