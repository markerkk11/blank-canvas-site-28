/**
 * Service for fetching operator icons from Ding.com's image repository
 * URL Pattern: https://imagerepo.ding.com/logo/{OPERATOR_NAME}/default.png
 * Fallback: https://imagerepo.ding.com/logo/{OPERATOR_NAME}.png
 */

interface OperatorIconCache {
  [key: string]: string | null;
}

class DingOperatorIconsService {
  private static cache: OperatorIconCache = {};
  private static readonly BASE_URL = 'https://imagerepo.ding.com/logo';
  private static readonly CORS_PROXY = 'https://api.allorigins.win/raw?url=';
  
  /**
   * Get operator icon URL from Ding.com
   * @param operatorName - Name of the operator (e.g., "ETECSA", "Vodafone")
   * @param countryCode - Optional country code for country-specific logos
   * @returns Promise<string | null> - URL of the operator logo or null if not found
   */
  static async getOperatorIcon(operatorName: string, countryCode?: string): Promise<string | null> {
    if (!operatorName) return null;
    
    // Normalize operator name for API call
    const normalizedName = operatorName.toUpperCase().replace(/\s+/g, '_');
    const cacheKey = countryCode ? `${normalizedName}_${countryCode}` : normalizedName;
    
    // Check cache first
    if (this.cache[cacheKey] !== undefined) {
      return this.cache[cacheKey];
    }
    
    // Try different URL patterns
    const urlsToTry = [
      // Pattern 1: With country code
      ...(countryCode ? [`${this.BASE_URL}/${normalizedName}/${countryCode}/default.png`] : []),
      ...(countryCode ? [`${this.BASE_URL}/${normalizedName}/${countryCode}.png`] : []),
      
      // Pattern 2: Default logo
      `${this.BASE_URL}/${normalizedName}/default.png`,
      
      // Pattern 3: Direct logo
      `${this.BASE_URL}/${normalizedName}.png`,
      
      // Pattern 4: Lowercase
      `${this.BASE_URL}/${normalizedName.toLowerCase()}/default.png`,
      `${this.BASE_URL}/${normalizedName.toLowerCase()}.png`,
      
      // Pattern 5: Original name with spaces as underscores
      `${this.BASE_URL}/${operatorName.replace(/\s+/g, '_')}/default.png`,
      `${this.BASE_URL}/${operatorName.replace(/\s+/g, '_')}.png`,
    ];
    
    for (const url of urlsToTry) {
      try {
        // Try direct request first
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          this.cache[cacheKey] = url;
          return url;
        }
      } catch (error) {
        // If direct request fails, try with CORS proxy
        try {
          const proxiedUrl = `${this.CORS_PROXY}${encodeURIComponent(url)}`;
          const proxyResponse = await fetch(proxiedUrl, { method: 'HEAD' });
          if (proxyResponse.ok) {
            this.cache[cacheKey] = proxiedUrl;
            return proxiedUrl;
          }
        } catch (proxyError) {
          // Continue to next URL
          continue;
        }
      }
    }
    
    // No logo found
    this.cache[cacheKey] = null;
    return null;
  }
  
  /**
   * Get operator icon with size parameters
   * @param operatorName - Name of the operator
   * @param countryCode - Optional country code
   * @param width - Image width (default: 100)
   * @param height - Image height (default: 100)
   * @returns Promise<string | null>
   */
  static async getOperatorIconWithSize(
    operatorName: string, 
    countryCode?: string, 
    width: number = 100, 
    height: number = 100
  ): Promise<string | null> {
    const baseUrl = await this.getOperatorIcon(operatorName, countryCode);
    if (!baseUrl) return null;
    
    // Add size parameters
    const url = new URL(baseUrl);
    url.searchParams.set('width', width.toString());
    url.searchParams.set('height', height.toString());
    
    return url.toString();
  }
  
  /**
   * Preload operator icons for a list of operators
   * @param operators - Array of operator names
   * @param countryCode - Optional country code
   */
  static async preloadOperatorIcons(operators: string[], countryCode?: string): Promise<void> {
    const promises = operators.map(operator => this.getOperatorIcon(operator, countryCode));
    await Promise.allSettled(promises);
  }
  
  /**
   * Clear the icon cache
   */
  static clearCache(): void {
    this.cache = {};
  }
}

export default DingOperatorIconsService;