// Comprehensive mobile operators service using MCC-MNC data
// This service provides real data about mobile operators by country

export interface MobileOperator {
  mcc: string;
  mnc: string;
  network: string;
  iso: string;
  country: string;
  countryCode: string;
}

export interface CountryWithOperators {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  region: string;
  operators: string[];
  operatorCount: number;
}

// REST Countries API endpoint (supports CORS)
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,cca2,region,idd,flag';

export class MobileOperatorsService {
  private static mccMncData: MobileOperator[] = [];
  
  /**
   * Initialize with comprehensive MCC-MNC data
   */
  private static initializeMccMncData() {
    // This is a subset of the real MCC-MNC data from GitHub
    // In production, this would be loaded from the full dataset
    this.mccMncData = [
      // United States
      { mcc: "310", mnc: "150", network: "AT&T Wireless", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "310", mnc: "160", network: "T-Mobile", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "311", mnc: "480", network: "Verizon", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "310", mnc: "410", network: "AT&T", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "310", mnc: "120", network: "Sprint", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "311", mnc: "490", network: "Cricket", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "310", mnc: "260", network: "Boost Mobile", iso: "us", country: "United States", countryCode: "1" },
      { mcc: "311", mnc: "660", network: "Metro PCS", iso: "us", country: "United States", countryCode: "1" },
      
      // Canada
      { mcc: "302", mnc: "610", network: "Bell Mobility", iso: "ca", country: "Canada", countryCode: "1" },
      { mcc: "302", mnc: "720", network: "Rogers", iso: "ca", country: "Canada", countryCode: "1" },
      { mcc: "302", mnc: "220", network: "Telus", iso: "ca", country: "Canada", countryCode: "1" },
      { mcc: "302", mnc: "320", network: "Mobilicity", iso: "ca", country: "Canada", countryCode: "1" },
      { mcc: "302", mnc: "370", network: "Fido", iso: "ca", country: "Canada", countryCode: "1" },
      
      // Mexico
      { mcc: "334", mnc: "020", network: "Telcel", iso: "mx", country: "Mexico", countryCode: "52" },
      { mcc: "334", mnc: "030", network: "Movistar", iso: "mx", country: "Mexico", countryCode: "52" },
      { mcc: "334", mnc: "050", network: "AT&T Mexico", iso: "mx", country: "Mexico", countryCode: "52" },
      { mcc: "334", mnc: "090", network: "Unefon", iso: "mx", country: "Mexico", countryCode: "52" },
      
      // India
      { mcc: "404", mnc: "10", network: "Airtel", iso: "in", country: "India", countryCode: "91" },
      { mcc: "405", mnc: "874", network: "Jio", iso: "in", country: "India", countryCode: "91" },
      { mcc: "404", mnc: "20", network: "Vodafone Idea", iso: "in", country: "India", countryCode: "91" },
      { mcc: "404", mnc: "01", network: "BSNL", iso: "in", country: "India", countryCode: "91" },
      { mcc: "404", mnc: "11", network: "Vi", iso: "in", country: "India", countryCode: "91" },
      
      // United Kingdom
      { mcc: "234", mnc: "30", network: "EE", iso: "gb", country: "United Kingdom", countryCode: "44" },
      { mcc: "234", mnc: "10", network: "O2", iso: "gb", country: "United Kingdom", countryCode: "44" },
      { mcc: "234", mnc: "15", network: "Vodafone", iso: "gb", country: "United Kingdom", countryCode: "44" },
      { mcc: "234", mnc: "33", network: "Three", iso: "gb", country: "United Kingdom", countryCode: "44" },
      { mcc: "234", mnc: "20", network: "giffgaff", iso: "gb", country: "United Kingdom", countryCode: "44" },
      { mcc: "234", mnc: "03", network: "Lebara", iso: "gb", country: "United Kingdom", countryCode: "44" },
      
      // Australia
      { mcc: "505", mnc: "01", network: "Telstra", iso: "au", country: "Australia", countryCode: "61" },
      { mcc: "505", mnc: "02", network: "Optus", iso: "au", country: "Australia", countryCode: "61" },
      { mcc: "505", mnc: "03", network: "Vodafone", iso: "au", country: "Australia", countryCode: "61" },
      { mcc: "505", mnc: "06", network: "3", iso: "au", country: "Australia", countryCode: "61" },
      
      // Germany
      { mcc: "262", mnc: "01", network: "T-Mobile", iso: "de", country: "Germany", countryCode: "49" },
      { mcc: "262", mnc: "02", network: "Vodafone", iso: "de", country: "Germany", countryCode: "49" },
      { mcc: "262", mnc: "03", network: "O2", iso: "de", country: "Germany", countryCode: "49" },
      { mcc: "262", mnc: "07", network: "O2 Germany", iso: "de", country: "Germany", countryCode: "49" },
      
      // France
      { mcc: "208", mnc: "01", network: "Orange", iso: "fr", country: "France", countryCode: "33" },
      { mcc: "208", mnc: "10", network: "SFR", iso: "fr", country: "France", countryCode: "33" },
      { mcc: "208", mnc: "20", network: "Bouygues", iso: "fr", country: "France", countryCode: "33" },
      { mcc: "208", mnc: "15", network: "Free", iso: "fr", country: "France", countryCode: "33" },
      
      // Brazil
      { mcc: "724", mnc: "05", network: "Vivo", iso: "br", country: "Brazil", countryCode: "55" },
      { mcc: "724", mnc: "02", network: "TIM", iso: "br", country: "Brazil", countryCode: "55" },
      { mcc: "724", mnc: "03", network: "Claro", iso: "br", country: "Brazil", countryCode: "55" },
      { mcc: "724", mnc: "31", network: "Oi", iso: "br", country: "Brazil", countryCode: "55" },
      { mcc: "724", mnc: "04", network: "Nextel", iso: "br", country: "Brazil", countryCode: "55" },
      
      // Nigeria
      { mcc: "621", mnc: "30", network: "MTN", iso: "ng", country: "Nigeria", countryCode: "234" },
      { mcc: "621", mnc: "20", network: "Airtel", iso: "ng", country: "Nigeria", countryCode: "234" },
      { mcc: "621", mnc: "50", network: "Globacom", iso: "ng", country: "Nigeria", countryCode: "234" },
      { mcc: "621", mnc: "60", network: "9mobile", iso: "ng", country: "Nigeria", countryCode: "234" },
      
      // South Africa
      { mcc: "655", mnc: "01", network: "Vodacom", iso: "za", country: "South Africa", countryCode: "27" },
      { mcc: "655", mnc: "10", network: "MTN", iso: "za", country: "South Africa", countryCode: "27" },
      { mcc: "655", mnc: "07", network: "Cell C", iso: "za", country: "South Africa", countryCode: "27" },
      { mcc: "655", mnc: "02", network: "Telkom Mobile", iso: "za", country: "South Africa", countryCode: "27" },
      
      // Japan
      { mcc: "440", mnc: "10", network: "NTT DoCoMo", iso: "jp", country: "Japan", countryCode: "81" },
      { mcc: "440", mnc: "20", network: "SoftBank", iso: "jp", country: "Japan", countryCode: "81" },
      { mcc: "441", mnc: "70", network: "KDDI", iso: "jp", country: "Japan", countryCode: "81" },
      { mcc: "440", mnc: "03", network: "au", iso: "jp", country: "Japan", countryCode: "81" },
      
      // China
      { mcc: "460", mnc: "00", network: "China Mobile", iso: "cn", country: "China", countryCode: "86" },
      { mcc: "460", mnc: "01", network: "China Unicom", iso: "cn", country: "China", countryCode: "86" },
      { mcc: "460", mnc: "03", network: "China Telecom", iso: "cn", country: "China", countryCode: "86" },
      { mcc: "460", mnc: "11", network: "China Telecom", iso: "cn", country: "China", countryCode: "86" },
      
      // Spain
      { mcc: "214", mnc: "01", network: "Vodafone", iso: "es", country: "Spain", countryCode: "34" },
      { mcc: "214", mnc: "03", network: "Orange", iso: "es", country: "Spain", countryCode: "34" },
      { mcc: "214", mnc: "07", network: "Movistar", iso: "es", country: "Spain", countryCode: "34" },
      { mcc: "214", mnc: "04", network: "Yoigo", iso: "es", country: "Spain", countryCode: "34" },
      
      // Italy
      { mcc: "222", mnc: "01", network: "TIM", iso: "it", country: "Italy", countryCode: "39" },
      { mcc: "222", mnc: "10", network: "Vodafone", iso: "it", country: "Italy", countryCode: "39" },
      { mcc: "222", mnc: "99", network: "WindTre", iso: "it", country: "Italy", countryCode: "39" },
      { mcc: "222", mnc: "88", network: "Wind", iso: "it", country: "Italy", countryCode: "39" },
      
      // Russia
      { mcc: "250", mnc: "01", network: "MTS", iso: "ru", country: "Russia", countryCode: "7" },
      { mcc: "250", mnc: "02", network: "MegaFon", iso: "ru", country: "Russia", countryCode: "7" },
      { mcc: "250", mnc: "99", network: "Beeline", iso: "ru", country: "Russia", countryCode: "7" },
      { mcc: "250", mnc: "20", network: "Tele2", iso: "ru", country: "Russia", countryCode: "7" },
      
      // Turkey
      { mcc: "286", mnc: "01", network: "Turkcell", iso: "tr", country: "Turkey", countryCode: "90" },
      { mcc: "286", mnc: "02", network: "Vodafone", iso: "tr", country: "Turkey", countryCode: "90" },
      { mcc: "286", mnc: "03", network: "Türk Telekom", iso: "tr", country: "Turkey", countryCode: "90" },
      { mcc: "286", mnc: "04", network: "Avea", iso: "tr", country: "Turkey", countryCode: "90" },
      
      // Argentina
      { mcc: "722", mnc: "07", network: "Movistar", iso: "ar", country: "Argentina", countryCode: "54" },
      { mcc: "722", mnc: "10", network: "Claro", iso: "ar", country: "Argentina", countryCode: "54" },
      { mcc: "722", mnc: "20", network: "Personal", iso: "ar", country: "Argentina", countryCode: "54" },
      { mcc: "722", mnc: "310", network: "Nextel", iso: "ar", country: "Argentina", countryCode: "54" },
      
      // Egypt
      { mcc: "602", mnc: "01", network: "Orange", iso: "eg", country: "Egypt", countryCode: "20" },
      { mcc: "602", mnc: "02", network: "Vodafone", iso: "eg", country: "Egypt", countryCode: "20" },
      { mcc: "602", mnc: "03", network: "Etisalat", iso: "eg", country: "Egypt", countryCode: "20" },
      { mcc: "602", mnc: "04", network: "WE", iso: "eg", country: "Egypt", countryCode: "20" },
      
      // Thailand
      { mcc: "520", mnc: "01", network: "AIS", iso: "th", country: "Thailand", countryCode: "66" },
      { mcc: "520", mnc: "18", network: "dtac", iso: "th", country: "Thailand", countryCode: "66" },
      { mcc: "520", mnc: "99", network: "TrueMove", iso: "th", country: "Thailand", countryCode: "66" },
      { mcc: "520", mnc: "05", network: "True", iso: "th", country: "Thailand", countryCode: "66" },
      
      // Saudi Arabia
      { mcc: "420", mnc: "01", network: "STC", iso: "sa", country: "Saudi Arabia", countryCode: "966" },
      { mcc: "420", mnc: "03", network: "Mobily", iso: "sa", country: "Saudi Arabia", countryCode: "966" },
      { mcc: "420", mnc: "04", network: "Zain", iso: "sa", country: "Saudi Arabia", countryCode: "966" },
      { mcc: "420", mnc: "07", network: "Virgin Mobile", iso: "sa", country: "Saudi Arabia", countryCode: "966" },
      
      // UAE
      { mcc: "424", mnc: "02", network: "Etisalat", iso: "ae", country: "United Arab Emirates", countryCode: "971" },
      { mcc: "424", mnc: "03", network: "du", iso: "ae", country: "United Arab Emirates", countryCode: "971" },
      { mcc: "424", mnc: "04", network: "Virgin Mobile", iso: "ae", country: "United Arab Emirates", countryCode: "971" },
      
      // Indonesia
      { mcc: "510", mnc: "01", network: "Telkomsel", iso: "id", country: "Indonesia", countryCode: "62" },
      { mcc: "510", mnc: "21", network: "Indosat", iso: "id", country: "Indonesia", countryCode: "62" },
      { mcc: "510", mnc: "11", network: "XL Axiata", iso: "id", country: "Indonesia", countryCode: "62" },
      { mcc: "510", mnc: "10", network: "Telkomsel", iso: "id", country: "Indonesia", countryCode: "62" },
      { mcc: "510", mnc: "89", network: "3", iso: "id", country: "Indonesia", countryCode: "62" },
      
      // Philippines
      { mcc: "515", mnc: "02", network: "Globe", iso: "ph", country: "Philippines", countryCode: "63" },
      { mcc: "515", mnc: "03", network: "Smart", iso: "ph", country: "Philippines", countryCode: "63" },
      { mcc: "515", mnc: "88", network: "Next Mobile", iso: "ph", country: "Philippines", countryCode: "63" },
      { mcc: "515", mnc: "01", network: "Globe", iso: "ph", country: "Philippines", countryCode: "63" },
      { mcc: "515", mnc: "05", network: "Sun Cellular", iso: "ph", country: "Philippines", countryCode: "63" },
      
      // Malaysia
      { mcc: "502", mnc: "12", network: "Maxis", iso: "my", country: "Malaysia", countryCode: "60" },
      { mcc: "502", mnc: "13", network: "Celcom", iso: "my", country: "Malaysia", countryCode: "60" },
      { mcc: "502", mnc: "16", network: "DiGi", iso: "my", country: "Malaysia", countryCode: "60" },
      { mcc: "502", mnc: "18", network: "U Mobile", iso: "my", country: "Malaysia", countryCode: "60" },
      
      // Vietnam
      { mcc: "452", mnc: "01", network: "Mobifone", iso: "vn", country: "Vietnam", countryCode: "84" },
      { mcc: "452", mnc: "02", network: "Vinaphone", iso: "vn", country: "Vietnam", countryCode: "84" },
      { mcc: "452", mnc: "04", network: "Viettel", iso: "vn", country: "Vietnam", countryCode: "84" },
      { mcc: "452", mnc: "05", network: "Vietnamobile", iso: "vn", country: "Vietnam", countryCode: "84" },
      
      // South Korea
      { mcc: "450", mnc: "05", network: "SK Telecom", iso: "kr", country: "South Korea", countryCode: "82" },
      { mcc: "450", mnc: "06", network: "KT", iso: "kr", country: "South Korea", countryCode: "82" },
      { mcc: "450", mnc: "08", network: "LG U+", iso: "kr", country: "South Korea", countryCode: "82" },
      { mcc: "450", mnc: "11", network: "LG Telecom", iso: "kr", country: "South Korea", countryCode: "82" },
      
      // Poland
      { mcc: "260", mnc: "01", network: "T-Mobile", iso: "pl", country: "Poland", countryCode: "48" },
      { mcc: "260", mnc: "02", network: "Orange", iso: "pl", country: "Poland", countryCode: "48" },
      { mcc: "260", mnc: "06", network: "Play", iso: "pl", country: "Poland", countryCode: "48" },
      { mcc: "260", mnc: "03", network: "Plus", iso: "pl", country: "Poland", countryCode: "48" },
      
      // Netherlands
      { mcc: "204", mnc: "08", network: "KPN", iso: "nl", country: "Netherlands", countryCode: "31" },
      { mcc: "204", mnc: "04", network: "Vodafone", iso: "nl", country: "Netherlands", countryCode: "31" },
      { mcc: "204", mnc: "20", network: "T-Mobile", iso: "nl", country: "Netherlands", countryCode: "31" },
      { mcc: "204", mnc: "12", network: "Telfort", iso: "nl", country: "Netherlands", countryCode: "31" },
      
      // Belgium
      { mcc: "206", mnc: "01", network: "Proximus", iso: "be", country: "Belgium", countryCode: "32" },
      { mcc: "206", mnc: "10", network: "Orange", iso: "be", country: "Belgium", countryCode: "32" },
      { mcc: "206", mnc: "20", network: "Base", iso: "be", country: "Belgium", countryCode: "32" },
      { mcc: "206", mnc: "05", network: "Telenet", iso: "be", country: "Belgium", countryCode: "32" },
      
      // Angola
      { mcc: "631", mnc: "02", network: "Unitel", iso: "ao", country: "Angola", countryCode: "244" },
      { mcc: "631", mnc: "04", network: "Movicel", iso: "ao", country: "Angola", countryCode: "244" },
      { mcc: "631", mnc: "05", network: "Africell Angola", iso: "ao", country: "Angola", countryCode: "244" },
      
      // Ghana
      { mcc: "620", mnc: "01", network: "MTN", iso: "gh", country: "Ghana", countryCode: "233" },
      { mcc: "620", mnc: "02", network: "Vodafone", iso: "gh", country: "Ghana", countryCode: "233" },
      { mcc: "620", mnc: "06", network: "AirtelTigo", iso: "gh", country: "Ghana", countryCode: "233" },
      
      // Kenya
      { mcc: "639", mnc: "02", network: "Safaricom", iso: "ke", country: "Kenya", countryCode: "254" },
      { mcc: "639", mnc: "03", network: "Airtel", iso: "ke", country: "Kenya", countryCode: "254" },
      { mcc: "639", mnc: "07", network: "Telkom Kenya", iso: "ke", country: "Kenya", countryCode: "254" },
      { mcc: "639", mnc: "05", network: "Orange", iso: "ke", country: "Kenya", countryCode: "254" },
      
      // Ethiopia
      { mcc: "636", mnc: "01", network: "Ethio Telecom", iso: "et", country: "Ethiopia", countryCode: "251" },
      { mcc: "636", mnc: "02", network: "Safaricom Ethiopia", iso: "et", country: "Ethiopia", countryCode: "251" },
      
      // Tanzania
      { mcc: "640", mnc: "02", network: "Airtel", iso: "tz", country: "Tanzania", countryCode: "255" },
      { mcc: "640", mnc: "04", network: "Vodacom", iso: "tz", country: "Tanzania", countryCode: "255" },
      { mcc: "640", mnc: "05", network: "Tigo", iso: "tz", country: "Tanzania", countryCode: "255" },
      { mcc: "640", mnc: "08", network: "Halotel", iso: "tz", country: "Tanzania", countryCode: "255" },
      
      // Morocco
      { mcc: "604", mnc: "01", network: "IAM", iso: "ma", country: "Morocco", countryCode: "212" },
      { mcc: "604", mnc: "02", network: "Orange", iso: "ma", country: "Morocco", countryCode: "212" },
      { mcc: "604", mnc: "00", network: "inwi", iso: "ma", country: "Morocco", countryCode: "212" },
      
      // Algeria
      { mcc: "603", mnc: "01", network: "Mobilis", iso: "dz", country: "Algeria", countryCode: "213" },
      { mcc: "603", mnc: "02", network: "Djezzy", iso: "dz", country: "Algeria", countryCode: "213" },
      { mcc: "603", mnc: "03", network: "Ooredoo", iso: "dz", country: "Algeria", countryCode: "213" },
      
      // Cuba
      { mcc: "368", mnc: "01", network: "ETECSA", iso: "cu", country: "Cuba", countryCode: "53" },
      { mcc: "368", mnc: "02", network: "Cubacel", iso: "cu", country: "Cuba", countryCode: "53" },
      
      // Zimbabwe
      { mcc: "648", mnc: "01", network: "NetOne", iso: "zw", country: "Zimbabwe", countryCode: "263" },
      { mcc: "648", mnc: "03", network: "Telecel", iso: "zw", country: "Zimbabwe", countryCode: "263" },
      { mcc: "648", mnc: "04", network: "Econet", iso: "zw", country: "Zimbabwe", countryCode: "263" },
      
      // Jamaica
      { mcc: "338", mnc: "50", network: "Digicel", iso: "jm", country: "Jamaica", countryCode: "1876" },
      { mcc: "338", mnc: "20", network: "FLOW", iso: "jm", country: "Jamaica", countryCode: "1876" },
      { mcc: "338", mnc: "180", network: "Cable & Wireless", iso: "jm", country: "Jamaica", countryCode: "1876" },
      
      // Bangladesh
      { mcc: "470", mnc: "01", network: "Grameenphone", iso: "bd", country: "Bangladesh", countryCode: "880" },
      { mcc: "470", mnc: "02", network: "Robi", iso: "bd", country: "Bangladesh", countryCode: "880" },
      { mcc: "470", mnc: "03", network: "Banglalink", iso: "bd", country: "Bangladesh", countryCode: "880" },
      { mcc: "470", mnc: "07", network: "Teletalk", iso: "bd", country: "Bangladesh", countryCode: "880" },
      
      // Pakistan
      { mcc: "410", mnc: "01", network: "Jazz", iso: "pk", country: "Pakistan", countryCode: "92" },
      { mcc: "410", mnc: "03", network: "Ufone", iso: "pk", country: "Pakistan", countryCode: "92" },
      { mcc: "410", mnc: "04", network: "Zong", iso: "pk", country: "Pakistan", countryCode: "92" },
      { mcc: "410", mnc: "06", network: "Telenor", iso: "pk", country: "Pakistan", countryCode: "92" },
      
      // Sri Lanka
      { mcc: "413", mnc: "01", network: "Mobitel", iso: "lk", country: "Sri Lanka", countryCode: "94" },
      { mcc: "413", mnc: "02", network: "Dialog", iso: "lk", country: "Sri Lanka", countryCode: "94" },
      { mcc: "413", mnc: "03", network: "Etisalat", iso: "lk", country: "Sri Lanka", countryCode: "94" },
      { mcc: "413", mnc: "08", network: "Hutch", iso: "lk", country: "Sri Lanka", countryCode: "94" },
      
      // Singapore
      { mcc: "525", mnc: "01", network: "SingTel", iso: "sg", country: "Singapore", countryCode: "65" },
      { mcc: "525", mnc: "02", network: "SingTel", iso: "sg", country: "Singapore", countryCode: "65" },
      { mcc: "525", mnc: "03", network: "M1", iso: "sg", country: "Singapore", countryCode: "65" },
      { mcc: "525", mnc: "05", network: "StarHub", iso: "sg", country: "Singapore", countryCode: "65" },
      
      // Hong Kong
      { mcc: "454", mnc: "00", network: "CSL", iso: "hk", country: "Hong Kong", countryCode: "852" },
      { mcc: "454", mnc: "10", network: "3 Hong Kong", iso: "hk", country: "Hong Kong", countryCode: "852" },
      { mcc: "454", mnc: "06", network: "SmarTone", iso: "hk", country: "Hong Kong", countryCode: "852" },
      { mcc: "454", mnc: "16", network: "PCCW", iso: "hk", country: "Hong Kong", countryCode: "852" },
      
      // New Zealand
      { mcc: "530", mnc: "01", network: "Vodafone", iso: "nz", country: "New Zealand", countryCode: "64" },
      { mcc: "530", mnc: "05", network: "Spark", iso: "nz", country: "New Zealand", countryCode: "64" },
      { mcc: "530", mnc: "24", network: "2degrees", iso: "nz", country: "New Zealand", countryCode: "64" },
      
      // Afghanistan
      { mcc: "412", mnc: "01", network: "AWCC", iso: "af", country: "Afghanistan", countryCode: "93" },
      { mcc: "412", mnc: "20", network: "Roshan", iso: "af", country: "Afghanistan", countryCode: "93" },
      { mcc: "412", mnc: "40", network: "Etisalat Afghanistan", iso: "af", country: "Afghanistan", countryCode: "93" },
      { mcc: "412", mnc: "50", network: "Atoma", iso: "af", country: "Afghanistan", countryCode: "93" },
      
      // Colombia
      { mcc: "732", mnc: "101", network: "Claro", iso: "co", country: "Colombia", countryCode: "57" },
      { mcc: "732", mnc: "103", network: "Tigo", iso: "co", country: "Colombia", countryCode: "57" },
      { mcc: "732", mnc: "111", network: "Movistar", iso: "co", country: "Colombia", countryCode: "57" },
      { mcc: "732", mnc: "130", network: "Avantel", iso: "co", country: "Colombia", countryCode: "57" },
      
      // Chile
      { mcc: "730", mnc: "01", network: "Entel", iso: "cl", country: "Chile", countryCode: "56" },
      { mcc: "730", mnc: "02", network: "Movistar", iso: "cl", country: "Chile", countryCode: "56" },
      { mcc: "730", mnc: "03", network: "Claro", iso: "cl", country: "Chile", countryCode: "56" },
      { mcc: "730", mnc: "10", network: "WOM", iso: "cl", country: "Chile", countryCode: "56" },
      
      // Peru
      { mcc: "716", mnc: "06", network: "Movistar", iso: "pe", country: "Peru", countryCode: "51" },
      { mcc: "716", mnc: "10", network: "Claro", iso: "pe", country: "Peru", countryCode: "51" },
      { mcc: "716", mnc: "15", network: "Bitel", iso: "pe", country: "Peru", countryCode: "51" },
      { mcc: "716", mnc: "17", network: "Entel", iso: "pe", country: "Peru", countryCode: "51" },
      
      // Ecuador
      { mcc: "740", mnc: "01", network: "Claro", iso: "ec", country: "Ecuador", countryCode: "593" },
      { mcc: "740", mnc: "00", network: "Movistar", iso: "ec", country: "Ecuador", countryCode: "593" },
      { mcc: "740", mnc: "02", network: "CNT EP", iso: "ec", country: "Ecuador", countryCode: "593" },
      
      // Venezuela
      { mcc: "734", mnc: "01", network: "Digitel", iso: "ve", country: "Venezuela", countryCode: "58" },
      { mcc: "734", mnc: "02", network: "Movilnet", iso: "ve", country: "Venezuela", countryCode: "58" },
      { mcc: "734", mnc: "04", network: "Movistar", iso: "ve", country: "Venezuela", countryCode: "58" },
      
      // Bolivia
      { mcc: "736", mnc: "01", network: "Entel", iso: "bo", country: "Bolivia", countryCode: "591" },
      { mcc: "736", mnc: "02", network: "Tigo", iso: "bo", country: "Bolivia", countryCode: "591" },
      { mcc: "736", mnc: "03", network: "Viva", iso: "bo", country: "Bolivia", countryCode: "591" },
      
      // Paraguay
      { mcc: "744", mnc: "01", network: "Tigo", iso: "py", country: "Paraguay", countryCode: "595" },
      { mcc: "744", mnc: "02", network: "Claro", iso: "py", country: "Paraguay", countryCode: "595" },
      { mcc: "744", mnc: "04", network: "Personal", iso: "py", country: "Paraguay", countryCode: "595" },
      
      // Uruguay
      { mcc: "748", mnc: "01", network: "Antel", iso: "uy", country: "Uruguay", countryCode: "598" },
      { mcc: "748", mnc: "07", network: "Movistar", iso: "uy", country: "Uruguay", countryCode: "598" },
      { mcc: "748", mnc: "10", network: "Claro", iso: "uy", country: "Uruguay", countryCode: "598" },
      
      // Guatemala
      { mcc: "704", mnc: "01", network: "Claro", iso: "gt", country: "Guatemala", countryCode: "502" },
      { mcc: "704", mnc: "02", network: "Tigo", iso: "gt", country: "Guatemala", countryCode: "502" },
      { mcc: "704", mnc: "03", network: "Movistar", iso: "gt", country: "Guatemala", countryCode: "502" },
      
      // El Salvador
      { mcc: "706", mnc: "01", network: "Claro", iso: "sv", country: "El Salvador", countryCode: "503" },
      { mcc: "706", mnc: "02", network: "Digicel", iso: "sv", country: "El Salvador", countryCode: "503" },
      { mcc: "706", mnc: "03", network: "Movistar", iso: "sv", country: "El Salvador", countryCode: "503" },
      { mcc: "706", mnc: "04", network: "Tigo", iso: "sv", country: "El Salvador", countryCode: "503" },
      
      // Honduras
      { mcc: "708", mnc: "01", network: "Claro", iso: "hn", country: "Honduras", countryCode: "504" },
      { mcc: "708", mnc: "02", network: "Tigo", iso: "hn", country: "Honduras", countryCode: "504" },
      { mcc: "708", mnc: "40", network: "Digicel", iso: "hn", country: "Honduras", countryCode: "504" },
      
      // Nicaragua
      { mcc: "710", mnc: "21", network: "Claro", iso: "ni", country: "Nicaragua", countryCode: "505" },
      { mcc: "710", mnc: "30", network: "Movistar", iso: "ni", country: "Nicaragua", countryCode: "505" },
      
      // Costa Rica
      { mcc: "712", mnc: "01", network: "ICE", iso: "cr", country: "Costa Rica", countryCode: "506" },
      { mcc: "712", mnc: "02", network: "ICE", iso: "cr", country: "Costa Rica", countryCode: "506" },
      { mcc: "712", mnc: "03", network: "Claro", iso: "cr", country: "Costa Rica", countryCode: "506" },
      { mcc: "712", mnc: "04", network: "Movistar", iso: "cr", country: "Costa Rica", countryCode: "506" },
      
      // Panama
      { mcc: "714", mnc: "01", network: "Claro", iso: "pa", country: "Panama", countryCode: "507" },
      { mcc: "714", mnc: "02", network: "Movistar", iso: "pa", country: "Panama", countryCode: "507" },
      { mcc: "714", mnc: "03", network: "Digicel", iso: "pa", country: "Panama", countryCode: "507" },
      { mcc: "714", mnc: "04", network: "Tigo", iso: "pa", country: "Panama", countryCode: "507" },
      
      // Dominican Republic
      { mcc: "370", mnc: "01", network: "Orange", iso: "do", country: "Dominican Republic", countryCode: "1" },
      { mcc: "370", mnc: "02", network: "Claro", iso: "do", country: "Dominican Republic", countryCode: "1" },
      { mcc: "370", mnc: "03", network: "Tricom", iso: "do", country: "Dominican Republic", countryCode: "1" },
      { mcc: "370", mnc: "04", network: "Viva", iso: "do", country: "Dominican Republic", countryCode: "1" },
      
      // Puerto Rico
      { mcc: "330", mnc: "110", network: "Claro", iso: "pr", country: "Puerto Rico", countryCode: "1" },
      { mcc: "330", mnc: "120", network: "AT&T", iso: "pr", country: "Puerto Rico", countryCode: "1" },
      
      // Ireland
      { mcc: "272", mnc: "01", network: "Vodafone", iso: "ie", country: "Ireland", countryCode: "353" },
      { mcc: "272", mnc: "02", network: "3 Ireland", iso: "ie", country: "Ireland", countryCode: "353" },
      { mcc: "272", mnc: "03", network: "Eir", iso: "ie", country: "Ireland", countryCode: "353" },
      { mcc: "272", mnc: "05", network: "3 Ireland", iso: "ie", country: "Ireland", countryCode: "353" },
      
      // Austria
      { mcc: "232", mnc: "01", network: "A1", iso: "at", country: "Austria", countryCode: "43" },
      { mcc: "232", mnc: "03", network: "T-Mobile", iso: "at", country: "Austria", countryCode: "43" },
      { mcc: "232", mnc: "05", network: "3", iso: "at", country: "Austria", countryCode: "43" },
      { mcc: "232", mnc: "10", network: "3", iso: "at", country: "Austria", countryCode: "43" },
      
      // Switzerland
      { mcc: "228", mnc: "01", network: "Swisscom", iso: "ch", country: "Switzerland", countryCode: "41" },
      { mcc: "228", mnc: "02", network: "Sunrise", iso: "ch", country: "Switzerland", countryCode: "41" },
      { mcc: "228", mnc: "03", network: "Salt", iso: "ch", country: "Switzerland", countryCode: "41" },
      
      // Portugal
      { mcc: "268", mnc: "01", network: "Vodafone", iso: "pt", country: "Portugal", countryCode: "351" },
      { mcc: "268", mnc: "03", network: "NOS", iso: "pt", country: "Portugal", countryCode: "351" },
      { mcc: "268", mnc: "06", network: "MEO", iso: "pt", country: "Portugal", countryCode: "351" },
      
      // Czech Republic
      { mcc: "230", mnc: "01", network: "T-Mobile", iso: "cz", country: "Czech Republic", countryCode: "420" },
      { mcc: "230", mnc: "02", network: "O2", iso: "cz", country: "Czech Republic", countryCode: "420" },
      { mcc: "230", mnc: "03", network: "Vodafone", iso: "cz", country: "Czech Republic", countryCode: "420" },
      
      // Hungary
      { mcc: "216", mnc: "01", network: "Telenor", iso: "hu", country: "Hungary", countryCode: "36" },
      { mcc: "216", mnc: "30", network: "T-Mobile", iso: "hu", country: "Hungary", countryCode: "36" },
      { mcc: "216", mnc: "70", network: "Vodafone", iso: "hu", country: "Hungary", countryCode: "36" },
      
      // Romania
      { mcc: "226", mnc: "01", network: "Vodafone", iso: "ro", country: "Romania", countryCode: "40" },
      { mcc: "226", mnc: "02", network: "Vodafone", iso: "ro", country: "Romania", countryCode: "40" },
      { mcc: "226", mnc: "03", network: "Orange", iso: "ro", country: "Romania", countryCode: "40" },
      { mcc: "226", mnc: "05", network: "Digi.Mobil", iso: "ro", country: "Romania", countryCode: "40" },
      { mcc: "226", mnc: "10", network: "Orange", iso: "ro", country: "Romania", countryCode: "40" },
      
      // Bulgaria
      { mcc: "284", mnc: "01", network: "A1 Bulgaria", iso: "bg", country: "Bulgaria", countryCode: "359" },
      { mcc: "284", mnc: "03", network: "Vivacom", iso: "bg", country: "Bulgaria", countryCode: "359" },
      { mcc: "284", mnc: "05", network: "Telenor", iso: "bg", country: "Bulgaria", countryCode: "359" },
      
      // Greece
      { mcc: "202", mnc: "01", network: "Cosmote", iso: "gr", country: "Greece", countryCode: "30" },
      { mcc: "202", mnc: "05", network: "Vodafone", iso: "gr", country: "Greece", countryCode: "30" },
      { mcc: "202", mnc: "09", network: "Wind", iso: "gr", country: "Greece", countryCode: "30" },
      { mcc: "202", mnc: "10", network: "Wind", iso: "gr", country: "Greece", countryCode: "30" },
      
      // Croatia
      { mcc: "219", mnc: "01", network: "T-Mobile", iso: "hr", country: "Croatia", countryCode: "385" },
      { mcc: "219", mnc: "02", network: "Tele2", iso: "hr", country: "Croatia", countryCode: "385" },
      { mcc: "219", mnc: "10", network: "A1 Hrvatska", iso: "hr", country: "Croatia", countryCode: "385" },
      
      // Serbia
      { mcc: "220", mnc: "01", network: "Telenor", iso: "rs", country: "Serbia", countryCode: "381" },
      { mcc: "220", mnc: "02", network: "Telenor", iso: "rs", country: "Serbia", countryCode: "381" },
      { mcc: "220", mnc: "03", network: "mt:s", iso: "rs", country: "Serbia", countryCode: "381" },
      { mcc: "220", mnc: "05", network: "VIP", iso: "rs", country: "Serbia", countryCode: "381" },
      
      // Ukraine
      { mcc: "255", mnc: "01", network: "Kyivstar", iso: "ua", country: "Ukraine", countryCode: "380" },
      { mcc: "255", mnc: "02", network: "Beeline", iso: "ua", country: "Ukraine", countryCode: "380" },
      { mcc: "255", mnc: "03", network: "Kyivstar", iso: "ua", country: "Ukraine", countryCode: "380" },
      { mcc: "255", mnc: "06", network: "lifecell", iso: "ua", country: "Ukraine", countryCode: "380" },
      { mcc: "255", mnc: "07", network: "3Mob", iso: "ua", country: "Ukraine", countryCode: "380" },
      
      // Belarus
      { mcc: "257", mnc: "01", network: "velcom", iso: "by", country: "Belarus", countryCode: "375" },
      { mcc: "257", mnc: "02", network: "MTS", iso: "by", country: "Belarus", countryCode: "375" },
      { mcc: "257", mnc: "04", network: "life:)", iso: "by", country: "Belarus", countryCode: "375" },
      
      // Lithuania
      { mcc: "246", mnc: "01", network: "Omnitel", iso: "lt", country: "Lithuania", countryCode: "370" },
      { mcc: "246", mnc: "02", network: "Bite", iso: "lt", country: "Lithuania", countryCode: "370" },
      { mcc: "246", mnc: "03", network: "Tele2", iso: "lt", country: "Lithuania", countryCode: "370" },
      
      // Latvia
      { mcc: "247", mnc: "01", network: "LMT", iso: "lv", country: "Latvia", countryCode: "371" },
      { mcc: "247", mnc: "02", network: "Tele2", iso: "lv", country: "Latvia", countryCode: "371" },
      { mcc: "247", mnc: "03", network: "Bite", iso: "lv", country: "Latvia", countryCode: "371" },
      
      // Estonia
      { mcc: "248", mnc: "01", network: "EMT", iso: "ee", country: "Estonia", countryCode: "372" },
      { mcc: "248", mnc: "02", network: "Elisa", iso: "ee", country: "Estonia", countryCode: "372" },
      { mcc: "248", mnc: "03", network: "Tele2", iso: "ee", country: "Estonia", countryCode: "372" },
      
      // Finland
      { mcc: "244", mnc: "05", network: "Elisa", iso: "fi", country: "Finland", countryCode: "358" },
      { mcc: "244", mnc: "12", network: "DNA", iso: "fi", country: "Finland", countryCode: "358" },
      { mcc: "244", mnc: "91", network: "Telia", iso: "fi", country: "Finland", countryCode: "358" },
      
      // Sweden
      { mcc: "240", mnc: "01", network: "Telia", iso: "se", country: "Sweden", countryCode: "46" },
      { mcc: "240", mnc: "02", network: "3", iso: "se", country: "Sweden", countryCode: "46" },
      { mcc: "240", mnc: "07", network: "Tele2", iso: "se", country: "Sweden", countryCode: "46" },
      { mcc: "240", mnc: "08", network: "Telenor", iso: "se", country: "Sweden", countryCode: "46" },
      
      // Norway
      { mcc: "242", mnc: "01", network: "Telenor", iso: "no", country: "Norway", countryCode: "47" },
      { mcc: "242", mnc: "02", network: "Telia", iso: "no", country: "Norway", countryCode: "47" },
      { mcc: "242", mnc: "05", network: "Tele2", iso: "no", country: "Norway", countryCode: "47" },
      
      // Denmark
      { mcc: "238", mnc: "01", network: "TDC", iso: "dk", country: "Denmark", countryCode: "45" },
      { mcc: "238", mnc: "02", network: "Telenor", iso: "dk", country: "Denmark", countryCode: "45" },
      { mcc: "238", mnc: "06", network: "3", iso: "dk", country: "Denmark", countryCode: "45" },
      
      // Iceland
      { mcc: "274", mnc: "01", network: "Síminn", iso: "is", country: "Iceland", countryCode: "354" },
      { mcc: "274", mnc: "02", network: "Vodafone", iso: "is", country: "Iceland", countryCode: "354" },
      { mcc: "274", mnc: "11", network: "Nova", iso: "is", country: "Iceland", countryCode: "354" },
      
      // Slovakia
      { mcc: "231", mnc: "01", network: "Orange", iso: "sk", country: "Slovakia", countryCode: "421" },
      { mcc: "231", mnc: "02", network: "Telekom", iso: "sk", country: "Slovakia", countryCode: "421" },
      { mcc: "231", mnc: "04", network: "T-Mobile", iso: "sk", country: "Slovakia", countryCode: "421" },
      { mcc: "231", mnc: "06", network: "O2", iso: "sk", country: "Slovakia", countryCode: "421" },
      
      // Slovenia
      { mcc: "293", mnc: "40", network: "Si.mobil", iso: "si", country: "Slovenia", countryCode: "386" },
      { mcc: "293", mnc: "41", network: "Mobitel", iso: "si", country: "Slovenia", countryCode: "386" },
      { mcc: "293", mnc: "64", network: "T-2", iso: "si", country: "Slovenia", countryCode: "386" },
      { mcc: "293", mnc: "70", network: "Tusmobil", iso: "si", country: "Slovenia", countryCode: "386" },
      
      // Israel
      { mcc: "425", mnc: "01", network: "Orange", iso: "il", country: "Israel", countryCode: "972" },
      { mcc: "425", mnc: "02", network: "Cellcom", iso: "il", country: "Israel", countryCode: "972" },
      { mcc: "425", mnc: "03", network: "Pelephone", iso: "il", country: "Israel", countryCode: "972" },
      { mcc: "425", mnc: "07", network: "HOT Mobile", iso: "il", country: "Israel", countryCode: "972" },
      
      // Jordan
      { mcc: "416", mnc: "01", network: "Zain", iso: "jo", country: "Jordan", countryCode: "962" },
      { mcc: "416", mnc: "02", network: "Xpress", iso: "jo", country: "Jordan", countryCode: "962" },
      { mcc: "416", mnc: "03", network: "Umniah", iso: "jo", country: "Jordan", countryCode: "962" },
      
      // Lebanon
      { mcc: "415", mnc: "01", network: "Alfa", iso: "lb", country: "Lebanon", countryCode: "961" },
      { mcc: "415", mnc: "03", network: "touch", iso: "lb", country: "Lebanon", countryCode: "961" },
      
      // Iraq
      { mcc: "418", mnc: "05", network: "Asia Cell", iso: "iq", country: "Iraq", countryCode: "964" },
      { mcc: "418", mnc: "20", network: "Zain", iso: "iq", country: "Iraq", countryCode: "964" },
      { mcc: "418", mnc: "30", network: "Zain", iso: "iq", country: "Iraq", countryCode: "964" },
      { mcc: "418", mnc: "40", network: "Korek", iso: "iq", country: "Iraq", countryCode: "964" },
      
      // Kuwait
      { mcc: "419", mnc: "02", network: "Zain", iso: "kw", country: "Kuwait", countryCode: "965" },
      { mcc: "419", mnc: "03", network: "Ooredoo", iso: "kw", country: "Kuwait", countryCode: "965" },
      { mcc: "419", mnc: "04", network: "Viva", iso: "kw", country: "Kuwait", countryCode: "965" },
      
      // Qatar
      { mcc: "427", mnc: "01", network: "Ooredoo", iso: "qa", country: "Qatar", countryCode: "974" },
      { mcc: "427", mnc: "02", network: "Vodafone", iso: "qa", country: "Qatar", countryCode: "974" },
      
      // Bahrain
      { mcc: "426", mnc: "01", network: "Batelco", iso: "bh", country: "Bahrain", countryCode: "973" },
      { mcc: "426", mnc: "02", network: "Zain", iso: "bh", country: "Bahrain", countryCode: "973" },
      { mcc: "426", mnc: "04", network: "STC", iso: "bh", country: "Bahrain", countryCode: "973" },
      
      // Oman
      { mcc: "422", mnc: "02", network: "Omantel", iso: "om", country: "Oman", countryCode: "968" },
      { mcc: "422", mnc: "03", network: "Ooredoo", iso: "om", country: "Oman", countryCode: "968" },
    ];
  }

  /**
   * Get region from country code
   */
  private static getRegion(iso: string): string {
    const regionMap: Record<string, string> = {
      // North America & Caribbean
      'us': 'Central | North America', 'ca': 'Central | North America', 'mx': 'Central | North America', 'cu': 'The Caribbean', 'jm': 'The Caribbean',
      
      // Europe
      'gb': 'Europe', 'de': 'Europe', 'fr': 'Europe', 'es': 'Europe', 'it': 'Europe', 
      'nl': 'Europe', 'be': 'Europe', 'pl': 'Europe', 'ru': 'Europe', 'tr': 'Europe',
      
      // Asia & Pacific
      'in': 'Asia | The Pacific', 'au': 'Asia | The Pacific', 'jp': 'Asia | The Pacific', 
      'cn': 'Asia | The Pacific', 'th': 'Asia | The Pacific', 'id': 'Asia | The Pacific',
      'ph': 'Asia | The Pacific', 'my': 'Asia | The Pacific', 'vn': 'Asia | The Pacific',
      'kr': 'Asia | The Pacific', 'sa': 'Asia | The Pacific', 'ae': 'Asia | The Pacific',
      'bd': 'Asia | The Pacific',
      
      // Africa
      'ng': 'Africa', 'za': 'Africa', 'eg': 'Africa', 'zw': 'Africa', 'gh': 'Africa', 'ao': 'Africa',
      'ke': 'Africa', 'et': 'Africa', 'tz': 'Africa', 'ma': 'Africa', 'dz': 'Africa',
      
      // South America
      'br': 'South America', 'ar': 'South America', 'co': 'South America', 'cl': 'South America',
      'pe': 'South America', 'ec': 'South America', 've': 'South America', 'bo': 'South America',
      'py': 'South America', 'uy': 'South America',
      
      // Central America & Caribbean
      'gt': 'Central | North America', 'sv': 'Central | North America', 'hn': 'Central | North America',
      'ni': 'Central | North America', 'cr': 'Central | North America', 'pa': 'Central | North America',
      'do': 'The Caribbean', 'pr': 'The Caribbean',
      
      // Middle East
      'il': 'Asia | The Pacific', 'jo': 'Asia | The Pacific', 'lb': 'Asia | The Pacific',
      'iq': 'Asia | The Pacific', 'kw': 'Asia | The Pacific', 'qa': 'Asia | The Pacific',
      'bh': 'Asia | The Pacific', 'om': 'Asia | The Pacific',
      
      // Europe Extended
      'ie': 'Europe', 'at': 'Europe', 'ch': 'Europe', 'pt': 'Europe', 'cz': 'Europe',
      'hu': 'Europe', 'ro': 'Europe', 'bg': 'Europe', 'gr': 'Europe', 'hr': 'Europe',
      'rs': 'Europe', 'ua': 'Europe', 'by': 'Europe', 'lt': 'Europe', 'lv': 'Europe',
      'ee': 'Europe', 'fi': 'Europe', 'se': 'Europe', 'no': 'Europe', 'dk': 'Europe',
      'is': 'Europe', 'sk': 'Europe', 'si': 'Europe',
      
      // Asia Pacific Extended
      'hk': 'Asia | The Pacific', 'nz': 'Asia | The Pacific', 'af': 'Asia | The Pacific',
      'lk': 'Asia | The Pacific', 'sg': 'Asia | The Pacific'
    };
    
    return regionMap[iso.toLowerCase()] || 'Other';
  }

  /**
   * Get flag emoji from country ISO code
   */
  private static getFlagEmoji(iso: string): string {
    if (!iso || iso.length !== 2) return '🏳️';
    
    try {
      return iso
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
    } catch {
      return '🏳️';
    }
  }

  /**
   * Fetch all countries with their mobile operators
   */
  static async fetchCountriesWithOperators(): Promise<{
    countries: CountryWithOperators[];
    stats: {
      totalCountries: number;
      totalOperators: number;
      countriesWithOperators: number;
      lastUpdated: string;
    };
  }> {
    try {
      console.log('🌍 Loading comprehensive mobile operators data...');
      console.log('🔗 API Endpoint:', REST_COUNTRIES_API);

      // Use REST Countries + MCC-MNC data
        
        // Fallback: Enhanced service with REST Countries + MCC-MNC
        if (this.mccMncData.length === 0) {
          this.initializeMccMncData();
        }

        console.log('📡 Fetching countries from REST Countries API...');
        const res = await fetch(REST_COUNTRIES_API, { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log('📊 API Response status:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`REST Countries API failed: ${res.status} ${res.statusText}`);
        }

        type RestCountry = {
          name: { common: string };
          cca2: string;
          region?: string;
          idd?: { root?: string; suffixes?: string[] };
          flag?: string;
        };

        const restCountries: RestCountry[] = await res.json();
        console.log('✅ Successfully fetched', restCountries.length, 'countries from REST Countries API');

        const operatorsByIso = new Map<string, Set<string>>();
        this.mccMncData.forEach((op) => {
          const key = op.iso.toLowerCase();
          if (!operatorsByIso.has(key)) operatorsByIso.set(key, new Set());
          operatorsByIso.get(key)!.add(op.network);
        });

        const normalizeRegion = (iso2: string, apiRegion?: string, dialRoot?: string): string => {
          const mapped = this.getRegion(iso2);
          if (mapped !== 'Other') return mapped;
          switch ((apiRegion || '').toLowerCase()) {
            case 'europe':
              return 'Europe';
            case 'africa':
              return 'Africa';
            case 'asia':
            case 'oceania':
            case 'antarctic':
              return 'Asia | The Pacific';
            case 'americas':
              return dialRoot?.startsWith('+5') ? 'South America' : 'Central | North America';
            default:
              return 'Other';
          }
        };

        const countries: CountryWithOperators[] = restCountries
          .filter((c) => {
            const iso2 = (c.cca2 || '').toUpperCase();
            // Filter out Antarctica and Heard Island and McDonald Islands
            return iso2 !== 'AQ' && iso2 !== 'HM';
          })
          .map((c) => {
            const iso2 = (c.cca2 || '').toUpperCase();
            const isoLower = iso2.toLowerCase();
            const ops = Array.from(operatorsByIso.get(isoLower) ?? []).sort();

            const dialRoot = c.idd?.root || '';
            const dialSuffix = c.idd?.suffixes?.[0] || '';
            let dialCodeRaw = `${dialRoot || ''}${dialSuffix || ''}`.trim();
            
            // Override for specific countries
            if (iso2 === 'US') {
              dialCodeRaw = '+1';
            }

            return {
              name: c.name?.common || iso2,
              code: iso2,
              flag: this.getFlagEmoji(iso2),
              dialCode: dialCodeRaw || '',
              region: normalizeRegion(iso2, c.region, dialRoot),
              operators: ops,
              operatorCount: ops.length,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        const totalOperators = this.mccMncData.length;
        const stats = {
          totalCountries: countries.length,
          totalOperators,
          countriesWithOperators: Array.from(operatorsByIso.keys()).length,
          lastUpdated: new Date().toISOString(),
        };

        // console.log(`✅ Loaded ${stats.totalCountries} countries; operators mapped for ${stats.countriesWithOperators} countries (${stats.totalOperators} operator entries)`);
        return { countries, stats };
        
    } catch (error) {
      console.error('❌ All data sources failed, using MCC-MNC fallback only:', error);

      // Final fallback: MCC-MNC data only
      if (this.mccMncData.length === 0) {
        this.initializeMccMncData();
      }

      const countriesMap = new Map<string, {
        name: string;
        code: string;
        countryCode: string;
        operators: Set<string>;
      }>();

      this.mccMncData.forEach((operator) => {
        const key = operator.iso.toLowerCase();
        if (!countriesMap.has(key)) {
          countriesMap.set(key, {
            name: operator.country,
            code: operator.iso.toUpperCase(),
            countryCode: operator.countryCode,
            operators: new Set(),
          });
        }
        countriesMap.get(key)!.operators.add(operator.network);
      });

      const countries: CountryWithOperators[] = Array.from(countriesMap.values())
        .map((country) => ({
          name: country.name,
          code: country.code,
          flag: this.getFlagEmoji(country.code),
          dialCode: `+${country.countryCode}`,
          region: this.getRegion(country.code),
          operators: Array.from(country.operators).sort(),
          operatorCount: country.operators.size,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      const totalOperators = this.mccMncData.length;
      const stats = {
        totalCountries: countries.length,
        totalOperators,
        countriesWithOperators: countries.length,
        lastUpdated: new Date().toISOString(),
      };

      return { countries, stats };
    }
  }
}