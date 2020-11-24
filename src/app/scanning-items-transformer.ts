import { ScanningItem } from './scanningItem';
import { PerformanceChartItem } from './interfaces/performance-chart-item';
import { ShiftItem } from './shiftItem';
import { DataRowOutlet } from '@angular/cdk/table';
import { retryWhen } from 'rxjs/operators';
import { CumulativeItem } from './cumulativeItem';
import { ScanningItemService } from './services/scanningItem.service';

export class ScanningItemsTransformer {

    consolidate(scanningItems: ScanningItem[]): PerformanceChartItem[]{
        let chartItems: PerformanceChartItem[] = Array();
        let prevHour = -1;
        let index = 0;
        let nScanningItems = scanningItems.map((x)=>x);
        nScanningItems = nScanningItems.reverse();
        for(const row of nScanningItems){
            if(row.ScanningHour == prevHour){
                // let's consolidate those hours items
                chartItems[index-1].ge = chartItems[index-1].ge + row.GE;
                console.log("GE: " + chartItems[index-1].ge);
                chartItems[index-1].changeovers = 1;
                chartItems[index-1].foilLossPercentage = (chartItems[index-1].foilLossPercentage + row.FoilLossPercentage)/2;
                chartItems[index-1].quantityKg += row.QuantityKg;
            }else{
                let currentColor: string;
                if(row.ChangeOvers == 1){
                    currentColor = 'rgba(0,191,255,0.2)';
                }else{
                    if(row.Speed >= row.AssumedSpeed){
                        currentColor = 'rgba(0,128,0,0.2)';
                    }else{
                        currentColor = 'rgba(255,0,0,0.2)';
                    }
                }
                const newItem: PerformanceChartItem = { hour: row.ScanningHour, ge: row.GE, foilLossPercentage: row.FoilLossPercentage, changeovers: row.ChangeOvers, quantityKg: row.QuantityKg, backgroundColor: currentColor, borderColor: currentColor.replace('0.2','1') };
                chartItems.push(newItem);
                prevHour = row.ScanningHour;
                index++;
            }
            
        }
        return chartItems;
    }
    
    toShiftView(scanningItems: ScanningItem[]): ShiftItem[]{
        let nScanningItems: ScanningItem[] = Array();
        let shiftItems: ShiftItem[] = Array();
        nScanningItems = scanningItems.map((x) => x);
        nScanningItems = nScanningItems.reverse();
        let prevDate: Date = new Date(1970, 1, 1);
        let prevZfin: number = -1;
        let prevHour: number = -1;
        let prevContaminated: number = -1;
        let prevConfirmed: number = -1;
        let i = 0;

        for(const row of nScanningItems){
            if(this.isSameShift(prevDate, prevHour, row.Date, row.ScanningHour)){
                shiftItems[i-1].ScanningHourLast = row.ScanningHour;
                shiftItems[i-1].Quantity += row.Quantity;
                shiftItems[i-1].QuantityKg += row.QuantityKg;
                shiftItems[i-1].FoilLossPercentage += row.FoilLossPercentage;
                shiftItems[i-1].Speed += row.Speed;
                shiftItems[i-1].AssumedSpeed += row.AssumedSpeed;
                if(row.Zfin != prevZfin){
                    shiftItems[i-1].Zfins += ", " + row.Zfin;
                    shiftItems[i-1].ChangeOvers += row.ChangeOvers;
                }
                shiftItems[i-1].ConfirmedKg += (row.ConfirmedKg/nScanningItems.filter(x=> x.Zfin == row.Zfin && x.ConfirmedKg == row.ConfirmedKg).length);
                shiftItems[i-1].Contaminated += (row.Contaminated/nScanningItems.filter(x=> x.Zfin == row.Zfin && x.Contaminated == row.Contaminated).length);
                if(row.Contaminated != prevContaminated && row.Zfin == prevZfin){
                    shiftItems[i-1].Contaminated += row.Contaminated;
                }else if(row.Contaminated == prevContaminated && row.Zfin == prevZfin){
                    //do nothing
                }else{
                    shiftItems[i-1].Contaminated += row.Contaminated;
                }
                shiftItems[i-1].GE += row.GE;
                if(prevHour != row.ScanningHour){
                    shiftItems[i-1].WorkingHours++;
                }
            }else{
                let name: string;
                if(row.ScanningHour >= 6 && row.ScanningHour <14){
                    name = "I";
                }else if(row.ScanningHour >= 14 && row.ScanningHour < 22){
                    name = "II";
                }else{
                    name = "III";
                }
                //the first row, let's put it to return array without any modifications
                const newItem: ShiftItem = {Id: i+1 ,
                                            ScanningHourFirst: row.ScanningHour,
                                            ScanningHourLast: row.ScanningHour,
                                            Name: name,  
                                            Date: row.Date, 
                                            Quantity: row.Quantity, 
                                            QuantityKg: row.QuantityKg, 
                                            FoilLossPercentage: row.FoilLossPercentage,
                                            Speed: row.Speed, 
                                            AssumedSpeed: row.AssumedSpeed, 
                                            ChangeOvers: 0, 
                                            Zfins: row.Zfin.toString(), 
                                            ConfirmedKg: (row.ConfirmedKg/nScanningItems.filter(x=> x.Zfin == row.Zfin && x.ConfirmedKg == row.ConfirmedKg).length),
                                            Contaminated: (row.Contaminated/nScanningItems.filter(x=> x.Zfin == row.Zfin && x.Contaminated == row.Contaminated).length),
                                            GE: row.GE,
                                            WorkingHours: 1
                                        };
                shiftItems.push(newItem);
                i++;
            }
            prevHour = row.ScanningHour;
            prevDate = row.Date;
            prevConfirmed = row.ConfirmedKg;
            prevZfin = row.Zfin;
            prevContaminated = row.Contaminated;
        }
        for(const item of shiftItems){
            item.FoilLossPercentage = item.FoilLossPercentage / item.WorkingHours;
            item.GE = item.GE / item.WorkingHours;
            item.Speed = item.Speed / item.WorkingHours;
            item.AssumedSpeed = item.AssumedSpeed / item.WorkingHours;
        }
        return shiftItems;
    }

    isSameShift(prevDate: Date, prevHour: number, currDate: Date, currHour: number): boolean{
        let res: boolean = false;
        if(currDate == prevDate){
            if(prevHour >= 6 && prevHour < 14 && currHour >= 6 && currHour < 14){
                //1st shift
                res = true;
            }else if(prevHour >=14 && prevHour < 22 && currHour >= 14 && currHour < 22){
                //2nd shift
                res = true;
            }else if(prevHour >=0 && prevHour < 6 && currHour >= 0 && currHour < 6){
                //3rd shift
                res = true;
            }else if((prevHour == 23 || prevHour == 22) && (currHour == 23 || currHour == 22)){
                //3rd shift
                res = true;
            }
        }else{
            let p = new Date(prevDate);
            let c = new Date(currDate);
            let dur = c.valueOf() - p.valueOf();
            if(dur <= 86400000){
                //it's milisecond equivalent of 1 day
                if((prevHour == 22 || prevHour == 23) && (currHour >= 0 && currHour < 6)){
                    res = true;
                }
            }
        }
        return res;
    }

}
