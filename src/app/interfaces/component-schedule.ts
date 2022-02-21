import { PlannedComponent } from './planned-component';

export interface ComponentSchedule {
    PRODUCT_NR: number,
    PRODUCT_NAME: number,
    SELECTED_PERIOD_START: string,
    SELECTED_PERIOD_END: string
    SCHEDULE: PlannedComponent[]
}
