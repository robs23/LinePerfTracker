declare global {  
    interface Number {  
     thousandsSeperator(): String;  
    }  
    interface Date{
        addDays(days: number): Date;
        formatString(): string;
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
    var date = new Date(this.valueOf());
    let datePart = date.toISOString().split('T')[0];
    let timePart = date.toISOString().split('T')[1].substring(0,8);
    return datePart + " " + timePart;
   }
   export {}; 