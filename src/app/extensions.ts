declare global {  
    interface Number {  
     thousandsSeperator(): String;  
    }  
    interface Date{
        addDays(days: number): Date;
        addHours(hours: number): Date;
        formatString(): string;
        getShift(): number;
        getWeek(): number;
    }
   }  

   Number.prototype.thousandsSeperator = function(): string {  
    return Number(this).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');  
   }  

   Date.prototype.addDays = function(days: number): Date{
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
   }
   Date.prototype.formatString = function(): string{
    var date = new Date(this.valueOf()).addHours(1);
    let datePart = date.toISOString().split('T')[0];
    let timePart = date.toISOString().split('T')[1].substring(0,8);
    return datePart + " " + timePart;
   }
   Date.prototype.getShift = function(): number{
    let date = new Date(this.valueOf());
    let hour = date.getHours();
    if(hour >= 6 && hour <14){
        return 1;
    }else if(hour >=14 && hour < 22){
        return 2;
    }else{
        return 3;
    }
   }
   Date.prototype.addHours = function(hours: number): Date{
    var date = new Date(this.valueOf());
    date.setHours(date.getHours() + hours);
    return date;
   }
   /**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
    Date.prototype.getWeek = function (): number {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
        let dowOffset = 1;
        dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
        var newYear = new Date(this.getFullYear(),0,1);
        var day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        var daynum = Math.floor((this.getTime() - newYear.getTime() - 
        (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
        var weeknum;
        //if the year starts before the middle of a week
        if(day < 4) {
            weeknum = Math.floor((daynum+day-1)/7) + 1;
            if(weeknum > 52) {
                let nYear = new Date(this.getFullYear() + 1,0,1);
                let nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum+day-1)/7);
        }
        return weeknum;
    };
   export {}; 