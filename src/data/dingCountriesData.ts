// Complete list of countries and operators from ding.com
// Fetched from https://ding.com/countries on September 21, 2025

export interface DingCountry {
  name: string;
  code: string;
  flag: string;
  region: string;
  operatorCount: number;
  operators: string[];
}

export const dingCountries: DingCountry[] = [
  {
    name: "Afghanistan",
    code: "AF",
    flag: "🇦🇫",
    region: "Asia",
    operatorCount: 4,
    operators: ["AWCC", "Atoma", "Etisalat", "Roshan"]
  },
  {
    name: "Albania",
    code: "AL", 
    flag: "🇦🇱",
    region: "Europe",
    operatorCount: 2,
    operators: ["Eagle Mobile", "Vodafone"]
  },
  {
    name: "Algeria",
    code: "DZ",
    flag: "🇩🇿",
    region: "Africa",
    operatorCount: 3,
    operators: ["Djezzy", "Mobilis", "Ooredoo"]
  },
  {
    name: "American Samoa",
    code: "AS",
    flag: "🇦🇸",
    region: "Asia",
    operatorCount: 1,
    operators: ["BlueSky"]
  },
  {
    name: "Angola",
    code: "AO",
    flag: "🇦🇴",
    region: "Africa",
    operatorCount: 3,
    operators: ["Africell", "Movicel", "Unitel"]
  },
  {
    name: "Anguilla",
    code: "AI",
    flag: "🇦🇮",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Antigua & Barbuda",
    code: "AG",
    flag: "🇦🇬",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    region: "South America",
    operatorCount: 4,
    operators: ["Claro", "Movistar", "Nextel", "Personal"]
  },
  {
    name: "Armenia",
    code: "AM",
    flag: "🇦🇲",
    region: "Europe",
    operatorCount: 2,
    operators: ["Ucom", "VivaCell-MTS"]
  },
  {
    name: "Aruba",
    code: "AW",
    flag: "🇦🇼",
    region: "Caribbean",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    region: "Asia",
    operatorCount: 7,
    operators: ["Amaysim", "Boost Mobile", "Lebara", "Lyca", "Optus", "Telstra", "Vodafone"]
  },
  {
    name: "Azerbaijan",
    code: "AZ",
    flag: "🇦🇿",
    region: "Europe",
    operatorCount: 4,
    operators: ["Azercell", "Bakcell", "Nar", "Naxtel 4G"]
  },
  {
    name: "Bahamas",
    code: "BS",
    flag: "🇧🇸",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Aliv", "BTC"]
  },
  {
    name: "Bahrain",
    code: "BH",
    flag: "🇧🇭",
    region: "Asia",
    operatorCount: 3,
    operators: ["Batelco", "Zain", "stc"]
  },
  {
    name: "Bangladesh",
    code: "BD",
    flag: "🇧🇩",
    region: "Asia",
    operatorCount: 5,
    operators: ["Airtel", "Banglalink", "Grameenphone", "Robi", "Teletalk"]
  },
  {
    name: "Barbados",
    code: "BB",
    flag: "🇧🇧",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Belarus",
    code: "BY",
    flag: "🇧🇾",
    region: "Europe",
    operatorCount: 2,
    operators: ["MTS", "life:)"]
  },
  {
    name: "Belgium",
    code: "BE",
    flag: "🇧🇪",
    region: "Europe",
    operatorCount: 5,
    operators: ["Base", "Lyca", "Orange", "Proximus", "Scarlet"]
  },
  {
    name: "Belize",
    code: "BZ",
    flag: "🇧🇿",
    region: "Central America",
    operatorCount: 2,
    operators: ["DigiCell", "Smart Belize"]
  },
  {
    name: "Benin",
    code: "BJ",
    flag: "🇧🇯",
    region: "Africa",
    operatorCount: 2,
    operators: ["MTN", "Moov"]
  },
  {
    name: "Bermuda",
    code: "BM",
    flag: "🇧🇲",
    region: "Caribbean",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Bhutan",
    code: "BT",
    flag: "🇧🇹",
    region: "Asia",
    operatorCount: 1,
    operators: ["Bhutan Telecom"]
  },
  {
    name: "Bolivia",
    code: "BO",
    flag: "🇧🇴",
    region: "South America",
    operatorCount: 3,
    operators: ["Entel", "Tigo", "Viva"]
  },
  {
    name: "Bonaire",
    code: "BQ",
    flag: "🇧🇶",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Chippie", "Digicel"]
  },
  {
    name: "Botswana",
    code: "BW",
    flag: "🇧🇼",
    region: "Africa",
    operatorCount: 3,
    operators: ["BTC Mobile", "Mascom", "Orange"]
  },
  {
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    region: "South America",
    operatorCount: 3,
    operators: ["Claro", "Tim", "Vivo"]
  },
  {
    name: "British Virgin Islands",
    code: "VG",
    flag: "🇻🇬",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Burkina Faso",
    code: "BF",
    flag: "🇧🇫",
    region: "Africa",
    operatorCount: 3,
    operators: ["Onatel", "Orange", "Telcel"]
  },
  {
    name: "Burundi",
    code: "BI",
    flag: "🇧🇮",
    region: "Africa",
    operatorCount: 1,
    operators: ["Econet"]
  },
  {
    name: "Cambodia",
    code: "KH",
    flag: "🇰🇭",
    region: "Asia",
    operatorCount: 3,
    operators: ["CamGSM", "Metfone", "Smart"]
  },
  {
    name: "Cameroon",
    code: "CM",
    flag: "🇨🇲",
    region: "Africa",
    operatorCount: 2,
    operators: ["MTN", "Orange"]
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    region: "North America",
    operatorCount: 6,
    operators: ["Bell MTS", "Freedom Mobile (Wind)", "Koodo", "Public Mobile", "Solo Mobile", "Virgin Mobile"]
  },
  {
    name: "Cape Verde",
    code: "CV",
    flag: "🇨🇻",
    region: "Africa",
    operatorCount: 2,
    operators: ["CVMovel", "Unitel T+"]
  },
  {
    name: "Cayman Islands",
    code: "KY",
    flag: "🇰🇾",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Central African Republic",
    code: "CF",
    flag: "🇨🇫",
    region: "Africa",
    operatorCount: 1,
    operators: ["Orange"]
  },
  {
    name: "Chad",
    code: "TD",
    flag: "🇹🇩",
    region: "Africa",
    operatorCount: 2,
    operators: ["Airtel", "Moov"]
  },
  {
    name: "Chile",
    code: "CL",
    flag: "🇨🇱",
    region: "South America",
    operatorCount: 8,
    operators: ["Claro", "Entel", "Movistar", "Simple", "Telsur", "VTR", "Virgin Mobile", "WOM"]
  },
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    region: "Asia",
    operatorCount: 3,
    operators: ["China Mobile", "China Telecom", "China Unicom"]
  },
  {
    name: "Colombia",
    code: "CO",
    flag: "🇨🇴",
    region: "South America",
    operatorCount: 6,
    operators: ["Avantel", "Claro", "ETB", "Movistar", "Tigo", "Virgin Mobile"]
  },
  {
    name: "Comoros",
    code: "KM",
    flag: "🇰🇲",
    region: "Africa",
    operatorCount: 2,
    operators: ["Comores Telecom", "Telma"]
  },
  {
    name: "Congo",
    code: "CG",
    flag: "🇨🇬",
    region: "Africa",
    operatorCount: 1,
    operators: ["MTN"]
  },
  {
    name: "Costa Rica",
    code: "CR",
    flag: "🇨🇷",
    region: "Central America",
    operatorCount: 3,
    operators: ["Claro", "Kolbi", "Movistar"]
  },
  {
    name: "Cuba",
    code: "CU",
    flag: "🇨🇺",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Cubacel", "Nauta"]
  },
  {
    name: "Curaçao",
    code: "CW",
    flag: "🇨🇼",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Chippie", "Digicel"]
  },
  {
    name: "Cyprus",
    code: "CY",
    flag: "🇨🇾",
    region: "Europe",
    operatorCount: 1,
    operators: ["epic"]
  },
  {
    name: "Czech Republic",
    code: "CZ",
    flag: "🇨🇿",
    region: "Europe",
    operatorCount: 2,
    operators: ["T-Mobile", "Vodafone"]
  },
  {
    name: "Côte d'Ivoire",
    code: "CI",
    flag: "🇨🇮",
    region: "Africa",
    operatorCount: 3,
    operators: ["MTN", "Moov", "Orange"]
  },
  {
    name: "Democratic Republic of Congo",
    code: "CD",
    flag: "🇨🇩",
    region: "Africa",
    operatorCount: 5,
    operators: ["Africell", "Airtel", "Orange", "Tatem", "Vodacom"]
  },
  {
    name: "Dominica",
    code: "DM",
    flag: "🇩🇲",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Dominican Republic",
    code: "DO",
    flag: "🇩🇴",
    region: "Caribbean",
    operatorCount: 3,
    operators: ["Altice", "Claro", "Viva"]
  },
  {
    name: "Ecuador",
    code: "EC",
    flag: "🇪🇨",
    region: "South America",
    operatorCount: 4,
    operators: ["CNT", "Claro", "Movistar", "Tuenti"]
  },
  {
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    region: "Africa",
    operatorCount: 4,
    operators: ["Etisalat", "Orange", "Vodafone", "WE Telecom"]
  },
  {
    name: "El Salvador",
    code: "SV",
    flag: "🇸🇻",
    region: "Central America",
    operatorCount: 4,
    operators: ["Claro", "Digicel", "Movistar", "Tigo"]
  },
  {
    name: "Eswatini",
    code: "SZ",
    flag: "🇸🇿",
    region: "Africa",
    operatorCount: 1,
    operators: ["MTN"]
  },
  {
    name: "Ethiopia",
    code: "ET",
    flag: "🇪🇹",
    region: "Africa",
    operatorCount: 2,
    operators: ["Safaricom", "ethio telecom"]
  },
  {
    name: "Fiji",
    code: "FJ",
    flag: "🇫🇯",
    region: "Asia",
    operatorCount: 2,
    operators: ["Digicel", "Vodafone"]
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    region: "Europe",
    operatorCount: 13,
    operators: ["Auchan", "Bouygues", "Free Mobile", "Kertel", "La Poste Mobile", "Lebara", "Lyca", "Mobiho", "Orange", "SFR Classique", "SFR Red", "Syma Mobile", "Virgin Mobile"]
  },
  {
    name: "French Guiana",
    code: "GF",
    flag: "🇬🇫",
    region: "Caribbean",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Gabon",
    code: "GA",
    flag: "🇬🇦",
    region: "Africa",
    operatorCount: 1,
    operators: ["Airtel"]
  },
  {
    name: "Gambia",
    code: "GM",
    flag: "🇬🇲",
    region: "Africa",
    operatorCount: 4,
    operators: ["Africell", "Comium", "Gamcel", "QCell"]
  },
  {
    name: "Georgia",
    code: "GE",
    flag: "🇬🇪",
    region: "Europe",
    operatorCount: 10,
    operators: ["Bali 01", "Bali 99", "Bani", "Beeline", "GPhone", "Geocell", "GlobalCell", "Magticom", "Magtifix", "MyPhone"]
  },
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    region: "Europe",
    operatorCount: 23,
    operators: ["Ay Yildiz", "Base", "Bild Mobil", "Blau", "Blau World", "CallMobile", "Congstar", "Congstar Ebay", "E-Plus", "Fonic", "Fyve", "Ja Mobil", "Klarmobil", "Lebara", "Lidl Connect", "Lyca", "Ortel", "Otelo", "Penny", "Rossmann", "Simply", "Smartmobil", "TeleColumbus"]
  },
  {
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    region: "Africa",
    operatorCount: 4,
    operators: ["AirtelTigo", "Glo", "MTN", "Telecel"]
  },
  {
    name: "Greece",
    code: "GR",
    flag: "🇬🇷",
    region: "Europe",
    operatorCount: 4,
    operators: ["Cosmote", "Q-Telecom", "Vodafone", "Wind"]
  },
  {
    name: "Grenada",
    code: "GD",
    flag: "🇬🇩",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Guadeloupe",
    code: "GP",
    flag: "🇬🇵",
    region: "Caribbean",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Guatemala",
    code: "GT",
    flag: "🇬🇹",
    region: "Central America",
    operatorCount: 2,
    operators: ["Claro", "Tigo"]
  },
  {
    name: "Guinea",
    code: "GN",
    flag: "🇬🇳",
    region: "Africa",
    operatorCount: 3,
    operators: ["Cellcom", "MTN", "Orange"]
  },
  {
    name: "Guinea-Bissau",
    code: "GW",
    flag: "🇬🇼",
    region: "Africa",
    operatorCount: 2,
    operators: ["MTN", "Orange"]
  },
  {
    name: "Guyana",
    code: "GY",
    flag: "🇬🇾",
    region: "South America",
    operatorCount: 2,
    operators: ["Digicel", "GTT"]
  },
  {
    name: "Haiti",
    code: "HT",
    flag: "🇭🇹",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "Natcom"]
  },
  {
    name: "Honduras",
    code: "HN",
    flag: "🇭🇳",
    region: "Central America",
    operatorCount: 3,
    operators: ["Claro", "Hondutel", "Tigo"]
  },
  {
    name: "Hong Kong SAR China",
    code: "HK",
    flag: "🇭🇰",
    region: "Asia",
    operatorCount: 3,
    operators: ["CSL Hong Kong", "China-Mobile Hong Kong", "Telin Hong Kong"]
  },
  {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    region: "Asia",
    operatorCount: 5,
    operators: ["Airtel", "BSNL", "Jio", "MTNL", "Vodafone"]
  },
  {
    name: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    region: "Asia",
    operatorCount: 6,
    operators: ["3", "Axis", "Excelcomindo", "Indosat", "Smartfren", "Telkomsel"]
  },
  {
    name: "Iraq",
    code: "IQ",
    flag: "🇮🇶",
    region: "Asia",
    operatorCount: 2,
    operators: ["Asia Cell Telecom", "Korek"]
  },
  {
    name: "Ireland",
    code: "IE",
    flag: "🇮🇪",
    region: "Europe",
    operatorCount: 4,
    operators: ["Eir", "Lycamobile", "Three", "Vodafone"]
  },
  {
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    region: "Europe",
    operatorCount: 13,
    operators: ["CoopVoce", "DigiMobil", "Fastweb", "Ho Mobile", "Iliad", "Kena Mobile", "Lyca", "Poste Mobile", "Tim", "Tiscali", "Very Mobile", "Vodafone", "Wind"]
  },
  {
    name: "Jamaica",
    code: "JM",
    flag: "🇯🇲",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "Flow"]
  },
  {
    name: "Jordan",
    code: "JO",
    flag: "🇯🇴",
    region: "Asia",
    operatorCount: 3,
    operators: ["Orange", "Umniah", "Zain"]
  },
  {
    name: "Kazakhstan",
    code: "KZ",
    flag: "🇰🇿",
    region: "Asia",
    operatorCount: 5,
    operators: ["Activ", "Altel", "Beeline", "Kcell", "Tele2"]
  },
  {
    name: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    region: "Africa",
    operatorCount: 2,
    operators: ["Airtel", "Safaricom"]
  },
  {
    name: "Kiribati",
    code: "KI",
    flag: "🇰🇮",
    region: "Asia",
    operatorCount: 1,
    operators: ["Vodafone"]
  },
  {
    name: "Kosovo",
    code: "XK",
    flag: "🇽🇰",
    region: "Europe",
    operatorCount: 2,
    operators: ["IPKO", "Vala Mobile"]
  },
  {
    name: "Kuwait",
    code: "KW",
    flag: "🇰🇼",
    region: "Asia",
    operatorCount: 3,
    operators: ["Ooredoo", "Zain", "stc"]
  },
  {
    name: "Kyrgyzstan",
    code: "KG",
    flag: "🇰🇬",
    region: "Asia",
    operatorCount: 3,
    operators: ["Beeline", "Megacom", "O!"]
  },
  {
    name: "Lebanon",
    code: "LB",
    flag: "🇱🇧",
    region: "Asia",
    operatorCount: 2,
    operators: ["Alfa", "Touch"]
  },
  {
    name: "Liberia",
    code: "LR",
    flag: "🇱🇷",
    region: "Africa",
    operatorCount: 2,
    operators: ["Lonestar Cell MTN", "Orange"]
  },
  {
    name: "Lithuania",
    code: "LT",
    flag: "🇱🇹",
    region: "Europe",
    operatorCount: 1,
    operators: ["Tele2"]
  },
  {
    name: "Luxembourg",
    code: "LU",
    flag: "🇱🇺",
    region: "Europe",
    operatorCount: 5,
    operators: ["Airline", "Banana", "Orange", "Post", "Telekaart"]
  },
  {
    name: "Madagascar",
    code: "MG",
    flag: "🇲🇬",
    region: "Africa",
    operatorCount: 2,
    operators: ["Airtel", "Orange"]
  },
  {
    name: "Malawi",
    code: "MW",
    flag: "🇲🇼",
    region: "Africa",
    operatorCount: 2,
    operators: ["Airtel", "TNM"]
  },
  {
    name: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    region: "Asia",
    operatorCount: 3,
    operators: ["Celcom", "DiGi", "Maxis"]
  },
  {
    name: "Mali",
    code: "ML",
    flag: "🇲🇱",
    region: "Africa",
    operatorCount: 3,
    operators: ["Malitel", "Orange", "Telecel"]
  },
  {
    name: "Martinique",
    code: "MQ",
    flag: "🇲🇶",
    region: "Caribbean",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Mauritania",
    code: "MR",
    flag: "🇲🇷",
    region: "Africa",
    operatorCount: 3,
    operators: ["Chinguitel", "Mattel", "Mauritel"]
  },
  {
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    region: "North America",
    operatorCount: 15,
    operators: ["AT&T", "Bait", "Diri", "Flash Mobile", "FreedomPOP", "MiMóvil", "Movistar", "OuiMovil", "Pillofon", "Rincel", "Telcel", "Unefon", "Virgin Mobile", "Weex", "Wildcard"]
  },
  {
    name: "Moldova",
    code: "MD",
    flag: "🇲🇩",
    region: "Europe",
    operatorCount: 3,
    operators: ["Moldcell", "Orange", "Unite"]
  },
  {
    name: "Montserrat",
    code: "MS",
    flag: "🇲🇸",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Morocco",
    code: "MA",
    flag: "🇲🇦",
    region: "Africa",
    operatorCount: 3,
    operators: ["Inwi", "Maroc Telecom", "Orange"]
  },
  {
    name: "Mozambique",
    code: "MZ",
    flag: "🇲🇿",
    region: "Africa",
    operatorCount: 3,
    operators: ["MCel", "Movitel", "Vodacom"]
  },
  {
    name: "Myanmar (Burma)",
    code: "MM",
    flag: "🇲🇲",
    region: "Asia",
    operatorCount: 2,
    operators: ["Ooredoo", "Telenor"]
  },
  {
    name: "Namibia",
    code: "NA",
    flag: "🇳🇦",
    region: "Africa",
    operatorCount: 2,
    operators: ["MTC", "TN Mobile"]
  },
  {
    name: "Nauru",
    code: "NR",
    flag: "🇳🇷",
    region: "Asia",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Nepal",
    code: "NP",
    flag: "🇳🇵",
    region: "Asia",
    operatorCount: 3,
    operators: ["Ncell", "Nepal Telecom", "SmartCell"]
  },
  {
    name: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    region: "Europe",
    operatorCount: 8,
    operators: ["GT", "KPN", "Lebara", "Lyca", "Ortel", "T-Mobile", "Vectone", "Vodafone"]
  },
  {
    name: "Nicaragua",
    code: "NI",
    flag: "🇳🇮",
    region: "Central America",
    operatorCount: 2,
    operators: ["Claro", "Tigo"]
  },
  {
    name: "Niger",
    code: "NE",
    flag: "🇳🇪",
    region: "Africa",
    operatorCount: 3,
    operators: ["Airtel", "Moov", "Zamani Telecom"]
  },
  {
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    region: "Africa",
    operatorCount: 4,
    operators: ["9Mobile", "Airtel", "Glo", "MTN"]
  },
  {
    name: "Oman",
    code: "OM",
    flag: "🇴🇲",
    region: "Asia",
    operatorCount: 5,
    operators: ["Friendi", "Omantel", "Ooredoo", "Red Bull", "Renna"]
  },
  {
    name: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    region: "Asia",
    operatorCount: 5,
    operators: ["Jazz", "Telenor", "Ufone", "Warid", "Zong"]
  },
  {
    name: "Panama",
    code: "PA",
    flag: "🇵🇦",
    region: "Central America",
    operatorCount: 4,
    operators: ["Claro", "Digicel", "Mas Movil Cable & Wireless", "Movistar"]
  },
  {
    name: "Papua New Guinea",
    code: "PG",
    flag: "🇵🇬",
    region: "Asia",
    operatorCount: 2,
    operators: ["Digicel", "Vodafone"]
  },
  {
    name: "Paraguay",
    code: "PY",
    flag: "🇵🇾",
    region: "South America",
    operatorCount: 4,
    operators: ["Claro", "Personal", "Tigo", "Vox"]
  },
  {
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
    region: "South America",
    operatorCount: 4,
    operators: ["Bitel", "Claro", "Entel", "Movistar"]
  },
  {
    name: "Philippines",
    code: "PH",
    flag: "🇵🇭",
    region: "Asia",
    operatorCount: 8,
    operators: ["Cherry Mobile", "DITO", "Globe", "Smart", "Smart Bro", "Smart Talk n Text", "Sun Cellular", "Touch Mobile"]
  },
  {
    name: "Poland",
    code: "PL",
    flag: "🇵🇱",
    region: "Europe",
    operatorCount: 6,
    operators: ["Heyah", "Lyca", "Orange", "Play", "Plus", "T-Mobile"]
  },
  {
    name: "Portugal",
    code: "PT",
    flag: "🇵🇹",
    region: "Europe",
    operatorCount: 6,
    operators: ["Lyca", "MEO", "Moche", "NOS", "UZO", "Vodafone"]
  },
  {
    name: "Puerto Rico",
    code: "PR",
    flag: "🇵🇷",
    region: "Caribbean",
    operatorCount: 3,
    operators: ["AT&T", "Claro", "T-Mobile"]
  },
  {
    name: "Qatar",
    code: "QA",
    flag: "🇶🇦",
    region: "Asia",
    operatorCount: 2,
    operators: ["Ooredoo", "Vodafone"]
  },
  {
    name: "Romania",
    code: "RO",
    flag: "🇷🇴",
    region: "Europe",
    operatorCount: 3,
    operators: ["Orange", "Telekom", "Vodafone"]
  },
  {
    name: "Rwanda",
    code: "RW",
    flag: "🇷🇼",
    region: "Africa",
    operatorCount: 1,
    operators: ["MTN"]
  },
  {
    name: "Samoa",
    code: "WS",
    flag: "🇼🇸",
    region: "Asia",
    operatorCount: 2,
    operators: ["BlueSky", "Digicel"]
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    region: "Asia",
    operatorCount: 8,
    operators: ["Friendi", "Lebara", "Mobily", "Red Bull", "STC-Sawa", "Salam", "Virgin Mobile", "Zain"]
  },
  {
    name: "Senegal",
    code: "SN",
    flag: "🇸🇳",
    region: "Africa",
    operatorCount: 3,
    operators: ["Expresso", "Free", "Orange"]
  },
  {
    name: "Sierra Leone",
    code: "SL",
    flag: "🇸🇱",
    region: "Africa",
    operatorCount: 4,
    operators: ["Africell", "Orange", "QCell", "Sierratel"]
  },
  {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    region: "Asia",
    operatorCount: 3,
    operators: ["M1", "SingTel", "Starhub"]
  },
  {
    name: "Somalia",
    code: "SO",
    flag: "🇸🇴",
    region: "Africa",
    operatorCount: 2,
    operators: ["Hormuud Telecom", "Somtel"]
  },
  {
    name: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    region: "Africa",
    operatorCount: 4,
    operators: ["CellC", "MTN", "Telkom", "Vodacom"]
  },
  {
    name: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    region: "Asia",
    operatorCount: 3,
    operators: ["KT", "LG U+", "SK Telecom"]
  },
  {
    name: "Spain",
    code: "ES",
    flag: "🇪🇸",
    region: "Europe",
    operatorCount: 17,
    operators: ["Best", "DigiMobil", "Euskaltel", "GT", "HablaFacil", "Happy", "Hits", "Lebara", "Llamaya", "Lyca", "MasMovil", "Movistar", "Orange", "Pepephone", "Simyo", "Vodafone", "Yoigo"]
  },
  {
    name: "Sri Lanka",
    code: "LK",
    flag: "🇱🇰",
    region: "Asia",
    operatorCount: 5,
    operators: ["Airtel", "Dialog", "Etisalat", "Hutch", "Mobitel"]
  },
  {
    name: "St. Kitts & Nevis",
    code: "KN",
    flag: "🇰🇳",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "St. Lucia",
    code: "LC",
    flag: "🇱🇨",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "St. Vincent & Grenadines",
    code: "VC",
    flag: "🇻🇨",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Sudan",
    code: "SD",
    flag: "🇸🇩",
    region: "Africa",
    operatorCount: 1,
    operators: ["Zain"]
  },
  {
    name: "Suriname",
    code: "SR",
    flag: "🇸🇷",
    region: "South America",
    operatorCount: 1,
    operators: ["Digicel"]
  },
  {
    name: "Sweden",
    code: "SE",
    flag: "🇸🇪",
    region: "Europe",
    operatorCount: 5,
    operators: ["3", "Comviq", "Halebop", "Tele2", "Telenor"]
  },
  {
    name: "Syria",
    code: "SY",
    flag: "🇸🇾",
    region: "Asia",
    operatorCount: 2,
    operators: ["Syriatel", "MTN"]
  },
  {
    name: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    region: "Africa",
    operatorCount: 5,
    operators: ["Airtel", "Halotel", "Tigo", "TTCL", "Vodacom"]
  },
  {
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    region: "Asia",
    operatorCount: 4,
    operators: ["AIS", "DTAC", "TOT", "True Move"]
  },
  {
    name: "Togo",
    code: "TG",
    flag: "🇹🇬",
    region: "Africa",
    operatorCount: 2,
    operators: ["Moov", "Togocom"]
  },
  {
    name: "Tonga",
    code: "TO",
    flag: "🇹🇴",
    region: "Asia",
    operatorCount: 2,
    operators: ["Digicel", "TCC"]
  },
  {
    name: "Trinidad & Tobago",
    code: "TT",
    flag: "🇹🇹",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Tunisia",
    code: "TN",
    flag: "🇹🇳",
    region: "Africa",
    operatorCount: 3,
    operators: ["Orange", "Ooredoo", "Tunisie Telecom"]
  },
  {
    name: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    region: "Europe",
    operatorCount: 3,
    operators: ["Turkcell", "Vodafone", "Türk Telekom"]
  },
  {
    name: "Turks & Caicos Islands",
    code: "TC",
    flag: "🇹🇨",
    region: "Caribbean",
    operatorCount: 2,
    operators: ["Digicel", "FLOW"]
  },
  {
    name: "Uganda",
    code: "UG",
    flag: "🇺🇬",
    region: "Africa",
    operatorCount: 3,
    operators: ["Airtel", "MTN", "UTL"]
  },
  {
    name: "Ukraine",
    code: "UA",
    flag: "🇺🇦",
    region: "Europe",
    operatorCount: 4,
    operators: ["Kyivstar", "Lifecell", "Vodafone", "3Mob"]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    region: "Asia",
    operatorCount: 3,
    operators: ["Du", "Etisalat", "Virgin Mobile"]
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    region: "Europe",
    operatorCount: 12,
    operators: ["3", "EE", "GT", "Lebara", "Lyca", "O2", "Ortel", "SMARTY", "Tesco Mobile", "Vodafone", "Voxi", "giffgaff"]
  },
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    region: "North America",
    operatorCount: 8,
    operators: ["AT&T", "Consumer Cellular", "Boost Mobile", "Cricket", "Metro", "T-Mobile", "Ultra Mobile", "Verizon"]
  },
  {
    name: "Uruguay",
    code: "UY",
    flag: "🇺🇾",
    region: "South America",
    operatorCount: 2,
    operators: ["Claro", "Movistar"]
  },
  {
    name: "Uzbekistan",
    code: "UZ",
    flag: "🇺🇿",
    region: "Asia",
    operatorCount: 5,
    operators: ["Beeline", "Humans", "Mobiuz", "Perfectum", "Ucell"]
  },
  {
    name: "Vanuatu",
    code: "VU",
    flag: "🇻🇺",
    region: "Asia",
    operatorCount: 2,
    operators: ["Digicel", "Vodafone"]
  },
  {
    name: "Venezuela",
    code: "VE",
    flag: "🇻🇪",
    region: "South America",
    operatorCount: 3,
    operators: ["Digitel", "Movistar", "Movilnet"]
  },
  {
    name: "Vietnam",
    code: "VN",
    flag: "🇻🇳",
    region: "Asia",
    operatorCount: 4,
    operators: ["MobiFone", "Viettel", "Vinaphone", "Vietnamobile"]
  },
  {
    name: "Yemen",
    code: "YE",
    flag: "🇾🇪",
    region: "Asia",
    operatorCount: 3,
    operators: ["Sabafon", "YOU", "MTN"]
  },
  {
    name: "Zambia",
    code: "ZM",
    flag: "🇿🇲",
    region: "Africa",
    operatorCount: 3,
    operators: ["Airtel", "MTN", "Zamtel"]
  },
  {
    name: "Zimbabwe",
    code: "ZW",
    flag: "🇿🇼",
    region: "Africa",
    operatorCount: 3,
    operators: ["Econet", "NetOne", "Telecel"]
  }
];

export const dingRegions = [
  "Africa",
  "Asia", 
  "Caribbean",
  "Central America",
  "Europe",
  "North America",
  "South America"
];

// Statistics
export const dingStats = {
  totalCountries: dingCountries.length,
  totalOperators: dingCountries.reduce((sum, country) => sum + country.operatorCount, 0),
  countriesByRegion: dingRegions.map(region => ({
    region,
    count: dingCountries.filter(country => country.region === region).length
  })),
  topOperators: [
    "Digicel", "Orange", "MTN", "Vodafone", "Claro", "Airtel", "Movistar", "T-Mobile"
  ]
};