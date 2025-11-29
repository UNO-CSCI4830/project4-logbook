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
    const raw = { id: this.id, name: this.name, category: this.category, brand: this.brand,
      model: this.model, serialNumber: this.serialNumber, purchaseDate: this.purchaseDate,
      warrantyMonths: this.warrantyMonths, conditionText: this.conditionText, notes: this.notes,
      alertDate: this.alertDate };
    Object.keys(raw).forEach(k => (raw as any)[k] === '' && delete (raw as any)[k]);
    return raw;
  }


}
