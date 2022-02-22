import { PlannedComponent } from './planned-component';

export interface ComponentSchedule {
    PRODUCT_NR: string,
    PRODUCT_NAME: number,
    SELECTED_PERIOD_START: Date,
    SELECTED_PERIOD_END: Date
    SCHEDULE: PlannedComponent[]
}
