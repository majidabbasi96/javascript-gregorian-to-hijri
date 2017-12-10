'use strict';
class HijriDate{
	//Set default values
	constructor(adjustment){
		this.adjustment = adjustment;
		this.nameDaysWeek = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
		this.monthNames = new Array("Muharram","Safar","Rabi-Al-Awwal","Rabi-Al-Thani", "Jumada-Al-Awwal","Jumada-Al-Thani","Rajab","Shaban ", "Ramadan","Shawwal","Zul-Qa'dah","Zul-Hijjah");
	}
	
	//Returns mathematic mod
	getGmod(n,m){
		return ((n%m)+m)%m;
	}
	
	//Convert Gregorian date to Hijri
	convertGregorianToHijri(year, month, day){
		let date = new Date();
		date.setFullYear(year, month, day);
		console.log(this.adjustment);
		if(this.adjustment) {
			let adjustmentMilisecond = 1000 * 60 * 60 * 24 * this.adjustment; 
			let dateMilisecond = date.getTime() + adjustmentMilisecond;
			date = new Date(dateMilisecond);
		}
		
		let currentDay = date.getDate();
		let currentMonth = date.getMonth();
		let currentYear = date.getFullYear();
		
		let m = currentMonth + 1;
		let y = currentYear;
		if(m < 3) {
			y -= 1;
			m += 12;
		}
		
		let a = Math.floor(y / 100.);
		let b = 2 - a + Math.floor(a / 4.);
		if(y < 1583) b = 0;
		if(y == 1582) {
			if(m > 10)  b = -10;
			if(m == 10) {
				b = 0;
				if(currentDay > 4) b = -10;
			}
		}		
		
		const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + currentDay + b - 1524;
		
		b = 0;
		if(jd > 2299160){
			a = Math.floor((jd - 1867216.25) / 36524.25);
			b = 1 + a - Math.floor(a / 4.);
		}
		const bb = jd + b + 1524;
		let cc = Math.floor((bb - 122.1) / 365.25);
		const dd = Math.floor(365.25 * cc);
		const ee = Math.floor((bb - dd) / 30.6001);
		currentDay =(bb - dd) - Math.floor(30.6001 * ee);
		currentMonth = ee - 1;
		if(ee>13) {
			cc += 1;
			currentMonth = ee-13;
		}
		currentYear = cc-4716;
		
		let wd;
		if(this.adjustment) {
			wd = this.getGmod(jd + 1 - this.adjustment, 7) + 1;
		} else {
			wd = this.getGmod(jd + 1, 7) + 1;
		}
		
		const icurrentYear = 10631. / 30.;
		const epochastro = 1948084;
		
		const shift1 = 8.01 / 60.;
		
		let z = jd - epochastro;
		const cyc = Math.floor(z / 10631.);
		z = z - 10631 * cyc;
		let j = Math.floor((z-shift1) / icurrentYear);
		const iy = 30*cyc+j;
		z = z - Math.floor( j *icurrentYear + shift1);
		let im = Math.floor((z + 28.5001) / 29.5);
		if(im == 13) im = 12;
		const id = z-Math.floor(29.5001*im-29);
		
		let hijriDateResult = new Array(8);
		
		//calculated day (CE)
		hijriDateResult[0] = day; 
		//calculated month (CE)
		hijriDateResult[1] = month-1; 
		//calculated year (CE)
		hijriDateResult[2] = year; 
		//julian day number
		hijriDateResult[3] = jd-1; 
		//weekday number
		hijriDateResult[4] = wd-1; 
		//islamic date
		hijriDateResult[5] = id; 
		//islamic month
		hijriDateResult[6] = im-1; 
		//islamic year
		hijriDateResult[7] = iy; 

		return hijriDateResult;
	}
	
	//Return Date String According to convertGregorianToHijri Result
	getDateString(hijriDateResult){
		return this.nameDaysWeek[hijriDateResult[4]] + ", " + hijriDateResult[5] + " " + this.monthNames[hijriDateResult[6]] + " " + hijriDateResult[7];
	}
	
	//Return Month Name According to convertGregorianToHijri Result
	getMonth(hijriDateResult){
		return this.monthNames[hijriDateResult[6]];
	}
	
	//Return Year Name According to convertGregorianToHijri Result
	getYear(hijriDateResult){
		return hijriDateResult[7];
	}
}