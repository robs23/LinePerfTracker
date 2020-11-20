import { ScanningItem } from './scanningItem';
import { PerformanceChartItem } from './interfaces/performance-chart-item';

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
    
    toShiftView(scanningItems: ScanningItem[]): ScanningItem[]{
        let nScanningItems: ScanningItem[] = Array();
        return nScanningItems;
    }

}
