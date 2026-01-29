// Import operator icons as ES6 modules for proper bundling
import VodafoneIcon from '@/assets/icons/folder/Vodafone.svg';
import OrangeIcon from '@/assets/icons/folder/Orange.svg';
import MtnIcon from '@/assets/icons/folder/MTN.svg';
import AttIcon from '@/assets/icons/folder/AT_T.svg';
import TMobileIcon from '@/assets/icons/folder/T-Mobile.svg';
import VerizonIcon from '@/assets/icons/folder/Verizon.svg';
import ClaroIcon from '@/assets/icons/folder/Claro.svg';
import MovistarIcon from '@/assets/icons/folder/Movistar.svg';
import JioIcon from '@/assets/icons/folder/Jio.svg';
import AirtelIcon from '@/assets/icons/folder/Airtel.svg';
import ViIcon from '@/assets/icons/folder/Vi.svg';
import EtecsaIcon from '@/assets/icons/folder/ETECSA.png';
import EconetIcon from '@/assets/icons/folder/Econet.png';
import NetOneIcon from '@/assets/icons/folder/NetOne.png';


// Fallback local icons mapping
const localIconMap: { [key: string]: string } = {
  'vodafone': VodafoneIcon,
  'orange': OrangeIcon,
  'mtn': MtnIcon,
  'att': AttIcon,
  'at&t': AttIcon,
  'tmobile': TMobileIcon,
  't-mobile': TMobileIcon,
  'verizon': VerizonIcon,
  'claro': ClaroIcon,
  'movistar': MovistarIcon,
  'jio': JioIcon,
  'airtel': AirtelIcon,
  'vi': ViIcon,
  // Local custom icons
  'etecsa': EtecsaIcon,
  'cubacel': EtecsaIcon,
  'econet': EconetIcon,
  'netone': NetOneIcon,
  'telecel': MtnIcon,
  // Fallback mappings for other operators
  'grameenphone': JioIcon,
  'robi': OrangeIcon,
  'banglalink': TMobileIcon,
  'airteltigo': AirtelIcon,
  'digicel': ClaroIcon,
  'flow': VodafoneIcon,
};

/**
 * Get operator icon with fallback to local icons
 * First tries to fetch from Ding.com, then falls back to local icons
 */
export const getOperatorIcon = async (operatorName: string, countryCode?: string): Promise<string | null> => {
  if (!operatorName) return null;
  
  // Build direct Ding image URL without fetch (avoid CORS issues with HEAD)
  const base = 'https://imagerepo.ding.com/logo';
  const normalized = operatorName.toUpperCase().replace(/\s+/g, '_');
  const candidates = [
    ...(countryCode ? [`${base}/${normalized}/${countryCode}/default.png`, `${base}/${normalized}/${countryCode}.png`] : []),
    `${base}/${normalized}/default.png`,
    `${base}/${normalized}.png`,
  ];
  try {
    const url = new URL(candidates[0]);
    url.searchParams.set('width', '64');
    url.searchParams.set('height', '64');
    return url.toString();
  } catch (_) {
    // If URL construction fails for any reason, fall back to local icon
  }
  
  // Fallback to local icons
  const name = operatorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return localIconMap[name] || null;
};

/**
 * Synchronous version that returns local icons only
 * Use this for immediate rendering with local fallbacks
 */
export const getOperatorIconSync = (operatorName: string): string | null => {
  if (!operatorName) return null;
  
  const name = operatorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return localIconMap[name] || null;
};