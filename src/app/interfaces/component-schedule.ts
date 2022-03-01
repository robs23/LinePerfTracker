import { DeliveryItem } from './delivery-item';
import { PlannedComponent } from './planned-component';

export interface ComponentSchedule {
    PRODUCT_NR: string,
    PRODUCT_NAME: string,
    STOCK: number,
    SELECTED_PERIOD_START: Date,
    SELECTED_PERIOD_END: Date
    SCHEDULE: PlannedComponent[],
    DELIVERIES: DeliveryItem[]
}
