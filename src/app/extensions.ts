declare global {  
    interface Number {  
     thousandsSeperator(): String;  
    }  
    interface Date{
        addDays(days: number): Date;
        formatString(): string;
        getShift(): number;
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
   export {}; 