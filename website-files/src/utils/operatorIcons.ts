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

// Utility for getting operator icons with proper import paths
export const getOperatorIcon = (operatorName: string): string | null => {
  const name = operatorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  // Map operators to their imported SVG icons
  const iconMap: { [key: string]: string } = {
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
    // Cuba operators
    'etecsa': VodafoneIcon, // Use Vodafone icon as placeholder
    'cubacel': OrangeIcon, // Use Orange icon as placeholder
    // Zimbabwe operators
    'econet': MtnIcon, // Use MTN icon
    'netone': TMobileIcon, // Use T-Mobile icon
    'telecel': ClaroIcon, // Use Claro icon
    // Bangladesh operators
    'grameenphone': JioIcon, // Use Jio icon for similar color scheme
    'robi': OrangeIcon, // Use Orange icon
    'banglalink': TMobileIcon, // Use T-Mobile for similar colors
    // Ghana operators
    'airteltigo': AirtelIcon, // Use Airtel icon
    // Jamaica operators
    'digicel': ClaroIcon, // Use Claro icon for similar style
    'flow': VodafoneIcon, // Use Vodafone icon
    // Add more operators as needed
  };
  
  return iconMap[name] || null;
};