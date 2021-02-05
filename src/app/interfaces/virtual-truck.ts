import { ProductionPlanItem } from './production-plan-item'

export interface VirtualTruck {
    L: string,
    ProductionStart: string,
    ProductionEnd: string,
    TotalPallets: number,
    Parts: ProductionPlanItem[]
}
