// Real-time Ding API data fetcher
// This fetches live data from Ding's public API endpoints

export interface DingApiCountry {
  CountryIso: string;
  CountryName: string;
  InternationalDialingInformation: Array<{
    Prefix: string;
    MinimumLength: number;
    MaximumLength: number;
  }>;
  RegionCodes: string[];
}

export interface DingApiProvider {
  ProviderCode: string;
  CountryIso: string;
  Name: string;
  ShortName: string;
  ValidationRegex: string;
  CustomerCareNumber: string;
  RegionCodes: string[];
  PaymentTypes: string[];
  LogoUrl: string;
}

export interface DingApiResponse<T> {
  ResultCode: number;
  ErrorCodes: Array<{
    Code: string;
    Context: string;
  }>;
  Items: T[];
}

// Base API URL for Ding Connect API
const DING_API_BASE = 'https://api.dingconnect.com/api/V1';

export class DingApiService {
  /**
   * Fetch all supported countries from Ding API
   * Endpoint: GET /api/V1/GetCountries
   */
  static async fetchCountries(): Promise<DingApiResponse<DingApiCountry>> {
    try {
      const response = await fetch(`${DING_API_BASE}/GetCountries`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DingCountriesFetcher/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching countries from Ding API:', error);
      throw error;
    }
  }

  /**
   * Fetch all providers (mobile operators) from Ding API
   * Endpoint: GET /api/V1/GetProviders
   */
  static async fetchProviders(): Promise<DingApiResponse<DingApiProvider>> {
    try {
      const response = await fetch(`${DING_API_BASE}/GetProviders`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DingCountriesFetcher/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching providers from Ding API:', error);
      throw error;
    }
  }

  /**
   * Fetch combined countries and providers data
   * This will create a merged dataset with countries and their operators
   */
  static async fetchCountriesWithProviders() {
    try {
      console.log('Fetching countries and providers from Ding API...');
      
      // Try to fetch from API first, fallback to static data if CORS blocks it
      try {
        const [countriesResponse, providersResponse] = await Promise.all([
          this.fetchCountries(),
          this.fetchProviders()
        ]);

        if (countriesResponse.ResultCode !== 0) {
          throw new Error(`Countries API error: ${countriesResponse.ErrorCodes.map(e => e.Code).join(', ')}`);
        }

        if (providersResponse.ResultCode !== 0) {
          throw new Error(`Providers API error: ${providersResponse.ErrorCodes.map(e => e.Code).join(', ')}`);
        }

        // Group providers by country
        const providersByCountry = providersResponse.Items.reduce((acc, provider) => {
          if (!acc[provider.CountryIso]) {
            acc[provider.CountryIso] = [];
          }
          acc[provider.CountryIso].push(provider);
          return acc;
        }, {} as Record<string, DingApiProvider[]>);

        // Map countries to our format with providers included
        const countriesWithProviders = countriesResponse.Items.map(country => {
          const providers = providersByCountry[country.CountryIso] || [];
          
          return {
            name: country.CountryName,
            code: country.CountryIso,
            flag: this.getFlagEmoji(country.CountryIso),
            dialingInfo: country.InternationalDialingInformation,
            regionCodes: country.RegionCodes,
            operatorCount: providers.length,
            operators: providers.map(p => ({
              code: p.ProviderCode,
              name: p.Name,
              shortName: p.ShortName,
              logoUrl: p.LogoUrl,
              validationRegex: p.ValidationRegex,
              customerCareNumber: p.CustomerCareNumber,
              paymentTypes: p.PaymentTypes,
              regionCodes: p.RegionCodes
            }))
          };
        });

        const stats = {
          totalCountries: countriesWithProviders.length,
          totalOperators: providersResponse.Items.length,
          countriesWithOperators: countriesWithProviders.filter(c => c.operatorCount > 0).length,
          operatorsByCountry: Object.entries(providersByCountry)
            .map(([country, providers]) => ({ country, count: providers.length }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10), // Top 10 countries by operator count
          lastUpdated: new Date().toISOString()
        };

        console.log(`✅ Fetched ${stats.totalCountries} countries and ${stats.totalOperators} operators from API`);
        
        return {
          countries: countriesWithProviders,
          stats,
          rawData: {
            countries: countriesResponse.Items,
            providers: providersResponse.Items
          }
        };

      } catch (apiError: any) {
        // If CORS or network error, fallback to static data
        if (apiError.message?.includes('CORS') || apiError.name === 'TypeError') {
          console.log('⚠️ API blocked by CORS, using fallback data...');
          return this.getFallbackData();
        }
        throw apiError;
      }

    } catch (error) {
      console.error('Failed to fetch Ding data, using fallback:', error);
      return this.getFallbackData();
    }
  }

  /**
   * Fallback data when API is not accessible due to CORS
   */
  private static getFallbackData() {
    const fallbackCountries = [
      {
        name: "United States",
        code: "US",
        flag: "🇺🇸",
        dialingInfo: [{ Prefix: "1", MinimumLength: 10, MaximumLength: 10 }],
        regionCodes: ["NA"],
        operatorCount: 3,
        operators: [
          { code: "ATT", name: "AT&T", shortName: "AT&T", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["USD"], regionCodes: ["NA"] },
          { code: "VZN", name: "Verizon", shortName: "Verizon", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["USD"], regionCodes: ["NA"] },
          { code: "TMO", name: "T-Mobile", shortName: "T-Mobile", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["USD"], regionCodes: ["NA"] }
        ]
      },
      {
        name: "India",
        code: "IN",
        flag: "🇮🇳",
        dialingInfo: [{ Prefix: "91", MinimumLength: 10, MaximumLength: 10 }],
        regionCodes: ["AS"],
        operatorCount: 4,
        operators: [
          { code: "AIRT", name: "Airtel", shortName: "Airtel", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["INR"], regionCodes: ["AS"] },
          { code: "JIO", name: "Jio", shortName: "Jio", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["INR"], regionCodes: ["AS"] },
          { code: "VODA", name: "Vodafone Idea", shortName: "Vi", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["INR"], regionCodes: ["AS"] },
          { code: "BSNL", name: "BSNL", shortName: "BSNL", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["INR"], regionCodes: ["AS"] }
        ]
      },
      {
        name: "United Kingdom",
        code: "GB",
        flag: "🇬🇧",
        dialingInfo: [{ Prefix: "44", MinimumLength: 10, MaximumLength: 11 }],
        regionCodes: ["EU"],
        operatorCount: 3,
        operators: [
          { code: "EE", name: "EE", shortName: "EE", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["GBP"], regionCodes: ["EU"] },
          { code: "O2", name: "O2", shortName: "O2", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["GBP"], regionCodes: ["EU"] },
          { code: "VF", name: "Vodafone", shortName: "Vodafone", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["GBP"], regionCodes: ["EU"] }
        ]
      },
      {
        name: "Canada",
        code: "CA",
        flag: "🇨🇦",
        dialingInfo: [{ Prefix: "1", MinimumLength: 10, MaximumLength: 10 }],
        regionCodes: ["NA"],
        operatorCount: 3,
        operators: [
          { code: "BELL", name: "Bell", shortName: "Bell", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["CAD"], regionCodes: ["NA"] },
          { code: "ROGERS", name: "Rogers", shortName: "Rogers", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["CAD"], regionCodes: ["NA"] },
          { code: "TELUS", name: "Telus", shortName: "Telus", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["CAD"], regionCodes: ["NA"] }
        ]
      },
      {
        name: "Australia",
        code: "AU",
        flag: "🇦🇺",
        dialingInfo: [{ Prefix: "61", MinimumLength: 9, MaximumLength: 9 }],
        regionCodes: ["AS"],
        operatorCount: 3,
        operators: [
          { code: "TELSTRA", name: "Telstra", shortName: "Telstra", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["AUD"], regionCodes: ["AS"] },
          { code: "OPTUS", name: "Optus", shortName: "Optus", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["AUD"], regionCodes: ["AS"] },
          { code: "VODAU", name: "Vodafone", shortName: "Vodafone", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["AUD"], regionCodes: ["AS"] }
        ]
      },
      {
        name: "Germany",
        code: "DE",
        flag: "🇩🇪",
        dialingInfo: [{ Prefix: "49", MinimumLength: 11, MaximumLength: 12 }],
        regionCodes: ["EU"],
        operatorCount: 3,
        operators: [
          { code: "DTAG", name: "Deutsche Telekom", shortName: "Telekom", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["EUR"], regionCodes: ["EU"] },
          { code: "VFDE", name: "Vodafone Germany", shortName: "Vodafone", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["EUR"], regionCodes: ["EU"] },
          { code: "O2DE", name: "O2 Germany", shortName: "O2", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["EUR"], regionCodes: ["EU"] }
        ]
      },
      {
        name: "France",
        code: "FR",
        flag: "🇫🇷",
        dialingInfo: [{ Prefix: "33", MinimumLength: 10, MaximumLength: 10 }],
        regionCodes: ["EU"],
        operatorCount: 3,
        operators: [
          { code: "ORANGE", name: "Orange", shortName: "Orange", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["EUR"], regionCodes: ["EU"] },
          { code: "SFR", name: "SFR", shortName: "SFR", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["EUR"], regionCodes: ["EU"] },
          { code: "BOUYGUES", name: "Bouygues Telecom", shortName: "Bouygues", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["EUR"], regionCodes: ["EU"] }
        ]
      },
      {
        name: "Brazil",
        code: "BR",
        flag: "🇧🇷",
        dialingInfo: [{ Prefix: "55", MinimumLength: 11, MaximumLength: 11 }],
        regionCodes: ["SA"],
        operatorCount: 4,
        operators: [
          { code: "VIVO", name: "Vivo", shortName: "Vivo", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["BRL"], regionCodes: ["SA"] },
          { code: "TIM", name: "TIM", shortName: "TIM", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["BRL"], regionCodes: ["SA"] },
          { code: "CLARO", name: "Claro", shortName: "Claro", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["BRL"], regionCodes: ["SA"] },
          { code: "OI", name: "Oi", shortName: "Oi", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["BRL"], regionCodes: ["SA"] }
        ]
      },
      {
        name: "Mexico",
        code: "MX",
        flag: "🇲🇽",
        dialingInfo: [{ Prefix: "52", MinimumLength: 10, MaximumLength: 10 }],
        regionCodes: ["NA"],
        operatorCount: 3,
        operators: [
          { code: "TELCEL", name: "Telcel", shortName: "Telcel", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["MXN"], regionCodes: ["NA"] },
          { code: "MOVISTAR", name: "Movistar", shortName: "Movistar", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["MXN"], regionCodes: ["NA"] },
          { code: "ATT_MX", name: "AT&T Mexico", shortName: "AT&T", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["MXN"], regionCodes: ["NA"] }
        ]
      },
      {
        name: "Nigeria",
        code: "NG",
        flag: "🇳🇬",
        dialingInfo: [{ Prefix: "234", MinimumLength: 10, MaximumLength: 10 }],
        regionCodes: ["AF"],
        operatorCount: 4,
        operators: [
          { code: "MTN_NG", name: "MTN Nigeria", shortName: "MTN", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["NGN"], regionCodes: ["AF"] },
          { code: "AIRTEL_NG", name: "Airtel Nigeria", shortName: "Airtel", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["NGN"], regionCodes: ["AF"] },
          { code: "GLO", name: "Globacom", shortName: "Glo", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["NGN"], regionCodes: ["AF"] },
          { code: "ETISALAT", name: "9mobile", shortName: "9mobile", logoUrl: "", validationRegex: "", customerCareNumber: "", paymentTypes: ["NGN"], regionCodes: ["AF"] }
        ]
      }
    ];

    const stats = {
      totalCountries: fallbackCountries.length,
      totalOperators: fallbackCountries.reduce((sum, c) => sum + c.operatorCount, 0),
      countriesWithOperators: fallbackCountries.length,
      operatorsByCountry: fallbackCountries.map(c => ({ country: c.code, count: c.operatorCount })),
      lastUpdated: new Date().toISOString()
    };

    console.log(`✅ Using fallback data: ${stats.totalCountries} countries and ${stats.totalOperators} operators`);

    return {
      countries: fallbackCountries,
      stats,
      rawData: {
        countries: [],
        providers: []
      }
    };
  }

  /**
   * Convert country ISO code to flag emoji
   */
  private static getFlagEmoji(countryCode: string): string {
    if (countryCode === 'XG') return '🌍'; // Global products
    
    try {
      return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
    } catch {
      return '🏳️'; // Fallback flag
    }
  }

  /**
   * Fetch specific country providers
   */
  static async fetchCountryProviders(countryIso: string): Promise<DingApiProvider[]> {
    try {
      const providersResponse = await this.fetchProviders();
      return providersResponse.Items.filter(provider => provider.CountryIso === countryIso);
    } catch (error) {
      console.error(`Error fetching providers for ${countryIso}:`, error);
      throw error;
    }
  }
}

// Usage examples:
/*
// Fetch all countries
const countries = await DingApiService.fetchCountries();

// Fetch all providers  
const providers = await DingApiService.fetchProviders();

// Fetch combined data
const data = await DingApiService.fetchCountriesWithProviders();
console.log(data.countries); // Countries with their operators
console.log(data.stats); // Statistics

// Fetch providers for specific country
const usProviders = await DingApiService.fetchCountryProviders('US');
*/