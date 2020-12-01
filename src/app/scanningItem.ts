import { stringify } from '@angular/compiler/src/util';

export class ScanningItem {
    Id: number;
    ScanningHour: number;
    Date: Date;
    Quantity: number;
    QuantityKg: number;
    QuantityFromFoil: number;
    QuantityFromBoxes: number;
    FoilLossPercentage: number;
    AssumedFoilLossPercentage: number;
    FoilLossPercentageDiff: number;
    Speed: number;
    AssumedSpeed: number;
    EanType: number;
    ChangeOvers: number;
    SpeedDiff: number;
    Zfin: number;
    ConfirmedKg: number;
    Contaminated: number;
    GE: number;
    NetWeight: number;
    BoxCount: number;
}
