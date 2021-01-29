import { Location } from './interfaces/location';
import { ProductionPlanItem } from './interfaces/production-plan-item';

export class ProductionPlanTransformer {
    dropLocation(Locations: Location[]): ProductionPlanItem[]{
        let Items: ProductionPlanItem[] = [];

        for(const l of Locations){
            for(const p of l.Parts){
                Items.push(p);
            }
        }
        return Items;
    }
}
