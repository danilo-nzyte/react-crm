/**
 * Project status enum
 */
export type ProjectStatus = "planned" | "started" | "completed";

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: number;
  is_deleted: boolean;
  created_at: string;
  modified_at: string;
}

/**
 * Customer interface
 */
export interface Customer extends BaseEntity {
  name: string;
}

/**
 * Product interface
 */
export interface Product extends BaseEntity {
  name: string;
  code: string;
  description: string;
  unit_of_measure: string;
}

/**
 * Customer Rate Card interface
 */
export interface CustomerRateCard extends BaseEntity {
  name: string;
  customer_id: number;
  customer_name?: string; // For UI display purposes
}

/**
 * Customer Rate Card Product interface
 */
export interface CustomerRateCardProduct extends BaseEntity {
  name: string;
  customer_rate_card_id: number;
  product_id: number;
  product_name?: string; // For UI display purposes
  cass_rate: number;
  engineer_rate: number;
  reference_1?: string;
  reference_2?: string;
  reference_3?: string;
}

/**
 * Engineer interface
 */
export interface Engineer extends BaseEntity {
  name: string;
}

/**
 * Gang interface
 */
export interface Gang extends BaseEntity {
  name: string;
}

/**
 * Gang Engineer interface
 */
export interface GangEngineer extends BaseEntity {
  name: string;
  gang_id: number;
  engineer_id: number;
  engineer_share: number;
  engineer?: Engineer; // For UI display purposes
}

/**
 * Project interface
 */
export interface Project extends BaseEntity {
  name: string;
  status: ProjectStatus;
  work_log_id: number;
}

/**
 * Work Log interface
 */
export interface WorkLog extends BaseEntity {
  name: string;
  customer_rate_card_id: number;
  gang_id: number;
}

/**
 * Work Log Product interface
 */
export interface WorkLogProduct extends BaseEntity {
  name: string;
  worklog_id: number;
  customer_rate_card_product_id: number;
}

/**
 * Work Log Entry interface
 */
export interface WorkLogEntry extends BaseEntity {
  name: string;
  date: string;
  engineer_id: number;
  gang_id: number;
  gang_engineer_id: number;
  worklog_id: number;
  customer_rate_card_product: number;
  unit_sale: number;
  unit_wage: number;
  is_approved: boolean;
}
