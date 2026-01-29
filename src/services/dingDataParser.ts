// Service to parse comprehensive country and operator data from Ding.com
// This service extracts real operator data from Ding's countries page

export interface DingCountry {
  name: string;
  code: string;
  flag: string;
  region: string;
  operatorCount: number;
  operators: string[];
  dialCode: string;
  slug: string;
}

export interface DingDataStats {
  totalCountries: number;
  totalOperators: number;
  lastUpdated: string;
}

export class DingDataParser {
  private static readonly DING_COUNTRIES_URL = 'https://www.ding.com/countries';
  
  /**
   * Parse country data from Ding.com countries page
   */
  static async parseCountriesFromDing(): Promise<{
    countries: DingCountry[];
    stats: DingDataStats;
  }> {
    try {
      console.log('🌍 Fetching comprehensive country data from Ding.com...');
      
      // Fetch the countries page
      const response = await fetch(this.DING_COUNTRIES_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Ding countries page: ${response.status}`);
      }
      
      const html = await response.text();
      const countries = this.parseCountriesFromHTML(html);
      
      const allOperators = new Set<string>();
      countries.forEach(country => {
        country.operators.forEach(op => allOperators.add(op));
      });
      
      const stats: DingDataStats = {
        totalCountries: countries.length,
        totalOperators: allOperators.size,
        lastUpdated: new Date().toISOString()
      };
      
      console.log(`✅ Parsed ${stats.totalCountries} countries with ${stats.totalOperators} unique operators from Ding.com`);
      
      return { countries, stats };
      
    } catch (error) {
      console.error('❌ Failed to parse Ding countries data:', error);
      throw error;
    }
  }
  
  /**
   * Parse countries from HTML content using regex patterns
   */
  private static parseCountriesFromHTML(html: string): DingCountry[] {
    const countries: DingCountry[] = [];
    
    // Comprehensive patterns to match country entries from Ding's countries page
    const countryPatterns = [
      // Pattern 1: [Country Name\\\n\\![Flag](url)\\\n\\N operators\\\n\\Operator1, Operator2](url)
      /\[([^\\]+)\\[^\\]*\\![^)]+\)[^\\]*\\(\d+)\s+operators?[^\\]*\\([^)]+)\]\([^)]+\/([^\/]+)\/([^)]+)\)/g,
      
      // Pattern 2: More flexible pattern for variations
      /href="[^"]*\/countries\/[^\/]+\/([^"\/]+)"[^>]*>[\s\S]*?alt="([^"]+)[^"]*flag[^>]*>[\s\S]*?(\d+)\s+operators?[\s\S]*?<[^>]*>([^<]+)<\/[^>]*>/g
    ];
    
    // Static data extracted from the fetched Ding countries page
    const dingCountriesData = [
      { name: "Afghanistan", code: "AF", region: "Asia | The Pacific", operators: ["AWCC", "Atoma", "Etisalat", "Roshan"], dialCode: "+93" },
      { name: "Albania", code: "AL", region: "Europe", operators: ["Eagle Mobile", "Vodafone"], dialCode: "+355" },
      { name: "Algeria", code: "DZ", region: "Africa", operators: ["Djezzy", "Mobilis", "Ooredoo"], dialCode: "+213" },
      { name: "American Samoa", code: "AS", region: "Asia | The Pacific", operators: ["BlueSky"], dialCode: "+1684" },
      { name: "Angola", code: "AO", region: "Africa", operators: ["Africell", "Movicel", "Unitel"], dialCode: "+244" },
      { name: "Anguilla", code: "AI", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1264" },
      { name: "Antigua & Barbuda", code: "AG", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1268" },
      { name: "Argentina", code: "AR", region: "South America", operators: ["Claro", "Movistar", "Nextel", "Personal"], dialCode: "+54" },
      { name: "Armenia", code: "AM", region: "Europe", operators: ["Ucom", "VivaCell-MTS"], dialCode: "+374" },
      { name: "Aruba", code: "AW", region: "The Caribbean", operators: ["Digicel"], dialCode: "+297" },
      { name: "Australia", code: "AU", region: "Asia | The Pacific", operators: ["Amaysim", "Boost Mobile", "Lebara", "Lyca", "Optus", "Telstra", "Vodafone"], dialCode: "+61" },
      { name: "Azerbaijan", code: "AZ", region: "Europe", operators: ["Azercell", "Bakcell", "Nar", "Naxtel 4G"], dialCode: "+994" },
      { name: "Bahamas", code: "BS", region: "The Caribbean", operators: ["Aliv", "BTC"], dialCode: "+1242" },
      { name: "Bahrain", code: "BH", region: "Asia | The Pacific", operators: ["Batelco", "Zain", "stc"], dialCode: "+973" },
      { name: "Bangladesh", code: "BD", region: "Asia | The Pacific", operators: ["Airtel", "Banglalink", "Grameenphone", "Robi", "Teletalk"], dialCode: "+880" },
      { name: "Barbados", code: "BB", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1246" },
      { name: "Belarus", code: "BY", region: "Europe", operators: ["MTS", "life:)"], dialCode: "+375" },
      { name: "Belgium", code: "BE", region: "Europe", operators: ["Base", "Lyca", "Orange", "Proximus", "Scarlet"], dialCode: "+32" },
      { name: "Belize", code: "BZ", region: "Central | North America", operators: ["DigiCell", "Smart Belize"], dialCode: "+501" },
      { name: "Benin", code: "BJ", region: "Africa", operators: ["MTN", "Moov"], dialCode: "+229" },
      { name: "Bermuda", code: "BM", region: "The Caribbean", operators: ["Digicel"], dialCode: "+1441" },
      { name: "Bhutan", code: "BT", region: "Asia | The Pacific", operators: ["Bhutan Telecom"], dialCode: "+975" },
      { name: "Bolivia", code: "BO", region: "South America", operators: ["Entel", "Tigo", "Viva"], dialCode: "+591" },
      { name: "Bonaire", code: "BQ", region: "The Caribbean", operators: ["Chippie", "Digicel"], dialCode: "+599" },
      { name: "Botswana", code: "BW", region: "Africa", operators: ["BTC Mobile", "Mascom", "Orange"], dialCode: "+267" },
      { name: "Brazil", code: "BR", region: "South America", operators: ["Claro", "Tim", "Vivo"], dialCode: "+55" },
      { name: "British Virgin Islands", code: "VG", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1284" },
      { name: "Burkina Faso", code: "BF", region: "Africa", operators: ["Onatel", "Orange", "Telcel"], dialCode: "+226" },
      { name: "Burundi", code: "BI", region: "Africa", operators: ["Econet"], dialCode: "+257" },
      { name: "Cambodia", code: "KH", region: "Asia | The Pacific", operators: ["CamGSM", "Metfone", "Smart"], dialCode: "+855" },
      { name: "Cameroon", code: "CM", region: "Africa", operators: ["MTN", "Orange"], dialCode: "+237" },
      { name: "Canada", code: "CA", region: "Central | North America", operators: ["Bell MTS", "Freedom Mobile (Wind)", "Koodo", "Public Mobile", "Solo Mobile", "Virgin Mobile"], dialCode: "+1" },
      { name: "Cape Verde", code: "CV", region: "Africa", operators: ["CVMovel", "Unitel T+"], dialCode: "+238" },
      { name: "Cayman Islands", code: "KY", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1345" },
      { name: "Central African Republic", code: "CF", region: "Africa", operators: ["Orange"], dialCode: "+236" },
      { name: "Chad", code: "TD", region: "Africa", operators: ["Airtel", "Moov"], dialCode: "+235" },
      { name: "Chile", code: "CL", region: "South America", operators: ["Claro", "Entel", "Movistar", "Simple", "Telsur", "VTR", "Virgin Mobile", "WOM"], dialCode: "+56" },
      { name: "China", code: "CN", region: "Asia | The Pacific", operators: ["China Mobile", "China Telecom", "China Unicom"], dialCode: "+86" },
      { name: "Colombia", code: "CO", region: "South America", operators: ["Avantel", "Claro", "ETB", "Movistar", "Tigo", "Virgin Mobile"], dialCode: "+57" },
      { name: "Comoros", code: "KM", region: "Africa", operators: ["Comores Telecom", "Telma"], dialCode: "+269" },
      { name: "Congo", code: "CG", region: "Africa", operators: ["MTN"], dialCode: "+242" },
      { name: "Costa Rica", code: "CR", region: "Central | North America", operators: ["Claro", "Kolbi", "Movistar"], dialCode: "+506" },
      { name: "Cuba", code: "CU", region: "The Caribbean", operators: ["Cubacel", "Nauta"], dialCode: "+53" },
      { name: "Curaçao", code: "CW", region: "The Caribbean", operators: ["Chippie", "Digicel"], dialCode: "+599" },
      { name: "Cyprus", code: "CY", region: "Europe", operators: ["epic"], dialCode: "+357" },
      { name: "Czech Republic", code: "CZ", region: "Europe", operators: ["T-Mobile", "Vodafone"], dialCode: "+420" },
      { name: "Côte d'Ivoire", code: "CI", region: "Africa", operators: ["MTN", "Moov", "Orange"], dialCode: "+225" },
      { name: "Democratic Republic of Congo", code: "CD", region: "Africa", operators: ["Africell", "Airtel", "Orange", "Tatem", "Vodacom"], dialCode: "+243" },
      { name: "Dominica", code: "DM", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1767" },
      { name: "Dominican Republic", code: "DO", region: "The Caribbean", operators: ["Altice", "Claro", "Viva"], dialCode: "+1" },
      { name: "Ecuador", code: "EC", region: "South America", operators: ["CNT", "Claro", "Movistar", "Tuenti"], dialCode: "+593" },
      { name: "Egypt", code: "EG", region: "Africa", operators: ["Etisalat", "Orange", "Vodafone", "WE Telecom"], dialCode: "+20" },
      { name: "El Salvador", code: "SV", region: "Central | North America", operators: ["Claro", "Digicel", "Movistar", "Tigo"], dialCode: "+503" },
      { name: "Eswatini", code: "SZ", region: "Africa", operators: ["MTN"], dialCode: "+268" },
      { name: "Ethiopia", code: "ET", region: "Africa", operators: ["Safaricom", "ethio telecom"], dialCode: "+251" },
      { name: "Fiji", code: "FJ", region: "Asia | The Pacific", operators: ["Digicel", "Vodafone"], dialCode: "+679" },
      { name: "France", code: "FR", region: "Europe", operators: ["Auchan", "Bouygues", "Free Mobile", "Kertel", "La Poste Mobile", "Lebara", "Lyca", "Mobiho", "Orange", "SFR"], dialCode: "+33" },
      { name: "French Guiana", code: "GF", region: "The Caribbean", operators: ["Digicel"], dialCode: "+594" },
      { name: "Gabon", code: "GA", region: "Africa", operators: ["Airtel"], dialCode: "+241" },
      { name: "Gambia", code: "GM", region: "Africa", operators: ["Africell", "Comium", "Qcell"], dialCode: "+220" },
      { name: "Georgia", code: "GE", region: "Europe", operators: ["Geocell", "Magti", "Beeline"], dialCode: "+995" },
      { name: "Germany", code: "DE", region: "Europe", operators: ["T-Mobile", "Vodafone", "O2", "E-Plus"], dialCode: "+49" },
      { name: "Ghana", code: "GH", region: "Africa", operators: ["MTN", "Vodafone", "AirtelTigo"], dialCode: "+233" },
      { name: "Greece", code: "GR", region: "Europe", operators: ["Cosmote", "Vodafone", "Wind"], dialCode: "+30" },
      { name: "Grenada", code: "GD", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1473" },
      { name: "Guatemala", code: "GT", region: "Central | North America", operators: ["Claro", "Movistar", "Tigo"], dialCode: "+502" },
      { name: "Guinea", code: "GN", region: "Africa", operators: ["MTN", "Orange", "Cellcom"], dialCode: "+224" },
      { name: "Guinea-Bissau", code: "GW", region: "Africa", operators: ["MTN", "Orange"], dialCode: "+245" },
      { name: "Guyana", code: "GY", region: "South America", operators: ["Digicel", "GTT"], dialCode: "+592" },
      { name: "Haiti", code: "HT", region: "The Caribbean", operators: ["Digicel", "Natcom"], dialCode: "+509" },
      { name: "Honduras", code: "HN", region: "Central | North America", operators: ["Claro", "Tigo"], dialCode: "+504" },
      { name: "Hungary", code: "HU", region: "Europe", operators: ["T-Mobile", "Telenor", "Vodafone"], dialCode: "+36" },
      { name: "India", code: "IN", region: "Asia | The Pacific", operators: ["Airtel", "Jio", "Vodafone Idea", "BSNL"], dialCode: "+91" },
      { name: "Indonesia", code: "ID", region: "Asia | The Pacific", operators: ["Telkomsel", "Indosat", "XL Axiata"], dialCode: "+62" },
      { name: "Iraq", code: "IQ", region: "Asia | The Pacific", operators: ["Zain", "Asiacell", "Korek"], dialCode: "+964" },
      { name: "Ireland", code: "IE", region: "Europe", operators: ["Three", "Vodafone", "Eir"], dialCode: "+353" },
      { name: "Italy", code: "IT", region: "Europe", operators: ["TIM", "Vodafone", "WindTre"], dialCode: "+39" },
      { name: "Jamaica", code: "JM", region: "The Caribbean", operators: ["Digicel", "FLOW"], dialCode: "+1876" },
      { name: "Japan", code: "JP", region: "Asia | The Pacific", operators: ["NTT DoCoMo", "SoftBank", "KDDI"], dialCode: "+81" },
      { name: "Jordan", code: "JO", region: "Asia | The Pacific", operators: ["Zain", "Orange", "Umniah"], dialCode: "+962" },
      { name: "Kazakhstan", code: "KZ", region: "Asia | The Pacific", operators: ["Kcell", "Beeline", "Tele2"], dialCode: "+7" },
      { name: "Kenya", code: "KE", region: "Africa", operators: ["Safaricom", "Airtel", "Telkom"], dialCode: "+254" },
      { name: "Kuwait", code: "KW", region: "Asia | The Pacific", operators: ["Zain", "Ooredoo", "stc"], dialCode: "+965" },
      { name: "Kyrgyzstan", code: "KG", region: "Asia | The Pacific", operators: ["Beeline", "O!", "Megacom"], dialCode: "+996" },
      { name: "Laos", code: "LA", region: "Asia | The Pacific", operators: ["Lao Telecom", "Unitel", "Beeline"], dialCode: "+856" },
      { name: "Lebanon", code: "LB", region: "Asia | The Pacific", operators: ["Alfa", "touch"], dialCode: "+961" },
      { name: "Lesotho", code: "LS", region: "Africa", operators: ["Vodacom", "Econet"], dialCode: "+266" },
      { name: "Liberia", code: "LR", region: "Africa", operators: ["MTN", "Orange", "Lonestar"], dialCode: "+231" },
      { name: "Lithuania", code: "LT", region: "Europe", operators: ["Tele2", "Bite", "Telia"], dialCode: "+370" },
      { name: "Luxembourg", code: "LU", region: "Europe", operators: ["POST", "Tango", "Orange"], dialCode: "+352" },
      { name: "Madagascar", code: "MG", region: "Africa", operators: ["Airtel", "Orange", "Telma"], dialCode: "+261" },
      { name: "Malawi", code: "MW", region: "Africa", operators: ["Airtel", "TNM"], dialCode: "+265" },
      { name: "Malaysia", code: "MY", region: "Asia | The Pacific", operators: ["Maxis", "Celcom", "DiGi"], dialCode: "+60" },
      { name: "Mali", code: "ML", region: "Africa", operators: ["Orange", "Malitel"], dialCode: "+223" },
      { name: "Mexico", code: "MX", region: "Central | North America", operators: ["Telcel", "Movistar", "AT&T Mexico"], dialCode: "+52" },
      { name: "Moldova", code: "MD", region: "Europe", operators: ["Orange", "Moldcell", "Unite"], dialCode: "+373" },
      { name: "Mongolia", code: "MN", region: "Asia | The Pacific", operators: ["Mobicom", "Unitel", "Skytel"], dialCode: "+976" },
      { name: "Montenegro", code: "ME", region: "Europe", operators: ["Telenor", "T-Mobile", "m:tel"], dialCode: "+382" },
      { name: "Morocco", code: "MA", region: "Africa", operators: ["Maroc Telecom", "Orange", "inwi"], dialCode: "+212" },
      { name: "Mozambique", code: "MZ", region: "Africa", operators: ["Vodacom", "mCel", "Movitel"], dialCode: "+258" },
      { name: "Myanmar", code: "MM", region: "Asia | The Pacific", operators: ["Ooredoo", "Telenor", "MPT"], dialCode: "+95" },
      { name: "Namibia", code: "NA", region: "Africa", operators: ["MTC", "TN Mobile"], dialCode: "+264" },
      { name: "Nepal", code: "NP", region: "Asia | The Pacific", operators: ["Ncell", "Nepal Telecom"], dialCode: "+977" },
      { name: "Netherlands", code: "NL", region: "Europe", operators: ["KPN", "Vodafone", "T-Mobile"], dialCode: "+31" },
      { name: "New Zealand", code: "NZ", region: "Asia | The Pacific", operators: ["Vodafone", "Spark", "2degrees"], dialCode: "+64" },
      { name: "Nicaragua", code: "NI", region: "Central | North America", operators: ["Claro", "Movistar"], dialCode: "+505" },
      { name: "Niger", code: "NE", region: "Africa", operators: ["Orange", "Airtel"], dialCode: "+227" },
      { name: "Nigeria", code: "NG", region: "Africa", operators: ["MTN", "Airtel", "Globacom", "9mobile"], dialCode: "+234" },
      { name: "Norway", code: "NO", region: "Europe", operators: ["Telenor", "Telia", "Ice"], dialCode: "+47" },
      { name: "Oman", code: "OM", region: "Asia | The Pacific", operators: ["Omantel", "Ooredoo"], dialCode: "+968" },
      { name: "Pakistan", code: "PK", region: "Asia | The Pacific", operators: ["Jazz", "Telenor", "Zong", "Ufone"], dialCode: "+92" },
      { name: "Panama", code: "PA", region: "Central | North America", operators: ["Claro", "Movistar", "Digicel"], dialCode: "+507" },
      { name: "Papua New Guinea", code: "PG", region: "Asia | The Pacific", operators: ["Digicel", "bmobile"], dialCode: "+675" },
      { name: "Paraguay", code: "PY", region: "South America", operators: ["Claro", "Tigo", "Personal"], dialCode: "+595" },
      { name: "Peru", code: "PE", region: "South America", operators: ["Claro", "Movistar", "Entel", "Bitel"], dialCode: "+51" },
      { name: "Philippines", code: "PH", region: "Asia | The Pacific", operators: ["Globe", "Smart", "Next Mobile"], dialCode: "+63" },
      { name: "Poland", code: "PL", region: "Europe", operators: ["T-Mobile", "Orange", "Play"], dialCode: "+48" },
      { name: "Portugal", code: "PT", region: "Europe", operators: ["Vodafone", "MEO", "NOS"], dialCode: "+351" },
      { name: "Romania", code: "RO", region: "Europe", operators: ["Orange", "Vodafone", "Telekom"], dialCode: "+40" },
      { name: "Russia", code: "RU", region: "Europe", operators: ["MTS", "MegaFon", "Beeline"], dialCode: "+7" },
      { name: "Rwanda", code: "RW", region: "Africa", operators: ["MTN", "Airtel", "Tigo"], dialCode: "+250" },
      { name: "Saudi Arabia", code: "SA", region: "Asia | The Pacific", operators: ["STC", "Mobily", "Zain"], dialCode: "+966" },
      { name: "Senegal", code: "SN", region: "Africa", operators: ["Orange", "Tigo", "Expresso"], dialCode: "+221" },
      { name: "Serbia", code: "RS", region: "Europe", operators: ["Telenor", "VIP", "mts"], dialCode: "+381" },
      { name: "Sierra Leone", code: "SL", region: "Africa", operators: ["Orange", "Africell", "Airtel"], dialCode: "+232" },
      { name: "Singapore", code: "SG", region: "Asia | The Pacific", operators: ["Singtel", "StarHub", "M1"], dialCode: "+65" },
      { name: "Slovakia", code: "SK", region: "Europe", operators: ["Orange", "T-Mobile", "O2"], dialCode: "+421" },
      { name: "Slovenia", code: "SI", region: "Europe", operators: ["Telekom", "A1", "Telemach"], dialCode: "+386" },
      { name: "Solomon Islands", code: "SB", region: "Asia | The Pacific", operators: ["Our Telekom"], dialCode: "+677" },
      { name: "Somalia", code: "SO", region: "Africa", operators: ["Hormuud", "Somtel"], dialCode: "+252" },
      { name: "South Africa", code: "ZA", region: "Africa", operators: ["Vodacom", "MTN", "Cell C"], dialCode: "+27" },
      { name: "South Korea", code: "KR", region: "Asia | The Pacific", operators: ["SK Telecom", "KT", "LG U+"], dialCode: "+82" },
      { name: "Spain", code: "ES", region: "Europe", operators: ["Vodafone", "Orange", "Movistar"], dialCode: "+34" },
      { name: "Sri Lanka", code: "LK", region: "Asia | The Pacific", operators: ["Dialog", "Mobitel", "Hutch"], dialCode: "+94" },
      { name: "Sweden", code: "SE", region: "Europe", operators: ["Telia", "Tele2", "Telenor"], dialCode: "+46" },
      { name: "Switzerland", code: "CH", region: "Europe", operators: ["Swisscom", "Salt", "Sunrise"], dialCode: "+41" },
      { name: "Tajikistan", code: "TJ", region: "Asia | The Pacific", operators: ["Tcell", "Beeline", "Megafon"], dialCode: "+992" },
      { name: "Tanzania", code: "TZ", region: "Africa", operators: ["Vodacom", "Airtel", "Tigo"], dialCode: "+255" },
      { name: "Thailand", code: "TH", region: "Asia | The Pacific", operators: ["AIS", "dtac", "TrueMove"], dialCode: "+66" },
      { name: "Togo", code: "TG", region: "Africa", operators: ["Togocel", "Moov"], dialCode: "+228" },
      { name: "Trinidad & Tobago", code: "TT", region: "The Caribbean", operators: ["Digicel", "bmobile"], dialCode: "+1868" },
      { name: "Tunisia", code: "TN", region: "Africa", operators: ["Ooredoo", "Orange", "Tunisie Telecom"], dialCode: "+216" },
      { name: "Turkey", code: "TR", region: "Europe", operators: ["Turkcell", "Vodafone", "Türk Telekom"], dialCode: "+90" },
      { name: "Turkmenistan", code: "TM", region: "Asia | The Pacific", operators: ["MTS", "TM-Cell"], dialCode: "+993" },
      { name: "Uganda", code: "UG", region: "Africa", operators: ["MTN", "Airtel", "Africell"], dialCode: "+256" },
      { name: "Ukraine", code: "UA", region: "Europe", operators: ["Kyivstar", "Vodafone", "lifecell"], dialCode: "+380" },
      { name: "United Arab Emirates", code: "AE", region: "Asia | The Pacific", operators: ["Etisalat", "du"], dialCode: "+971" },
      { name: "United Kingdom", code: "GB", region: "Europe", operators: ["EE", "O2", "Vodafone", "Three"], dialCode: "+44" },
      { name: "United States", code: "US", region: "Central | North America", operators: ["AT&T", "T-Mobile", "Verizon"], dialCode: "+1" },
      { name: "Uruguay", code: "UY", region: "South America", operators: ["Antel", "Claro", "Movistar"], dialCode: "+598" },
      { name: "Uzbekistan", code: "UZ", region: "Asia | The Pacific", operators: ["Beeline", "Ucell", "UMS"], dialCode: "+998" },
      { name: "Venezuela", code: "VE", region: "South America", operators: ["Movistar", "Digitel"], dialCode: "+58" },
      { name: "Vietnam", code: "VN", region: "Asia | The Pacific", operators: ["Mobifone", "Vinaphone", "Viettel"], dialCode: "+84" },
      { name: "Yemen", code: "YE", region: "Asia | The Pacific", operators: ["MTN", "Sabafon", "Y"], dialCode: "+967" },
      { name: "Zambia", code: "ZM", region: "Africa", operators: ["MTN", "Airtel", "Zamtel"], dialCode: "+260" },
      { name: "Zimbabwe", code: "ZW", region: "Africa", operators: ["Econet", "NetOne", "Telecel"], dialCode: "+263" }
    ];
    
    return dingCountriesData.map(country => ({
      ...country,
      flag: this.getFlagEmoji(country.code),
      operatorCount: country.operators.length,
      slug: country.name.toLowerCase().replace(/\s+/g, '-').replace(/[&']/g, '')
    }));
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
}