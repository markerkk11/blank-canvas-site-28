import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, ChevronDown, Check, User, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { removeBackground } from "@/utils/backgroundRemoval";
import DingHeader from "@/components/DingHeader";
import { useTranslation } from "@/hooks/useTranslation";

// Import operator logos
import vodafoneLogo from "@/assets/operator-logos/vodafone.png";
import orangeLogo from "@/assets/operator-logos/orange.png";
import mtnLogo from "@/assets/operator-logos/mtn.png";
// AT&T logo will be processed from uploaded image
const attLogo = "/lovable-uploads/2d4d7e0c-81ea-4c08-b4ef-81fbd1bb69e0.png";
import tmobileLogo from "@/assets/operator-logos/tmobile.png";
import verizonLogo from "@/assets/operator-logos/verizon.png";
import claroLogo from "@/assets/operator-logos/claro.png";
import movistarLogo from "@/assets/operator-logos/movistar.png";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  region: string;
  operators: string[];
}

interface LocationState {
  country: Country;
  phoneNumber: string;
}

// Countries array - same as in TopUpPage with complete operators data
const countries: Country[] = [
  // Africa
  { code: "DZ", name: "Algeria", flag: "https://flagcdn.com/w40/dz.png", dialCode: "+213", region: "Africa", operators: ["Djezzy", "Mobilis", "Ooredoo"] },
  { code: "AO", name: "Angola", flag: "https://flagcdn.com/w40/ao.png", dialCode: "+244", region: "Africa", operators: ["Africell Angola", "Movicel Angola", "Unitel Angola"] },
  { code: "EG", name: "Egypt", flag: "https://flagcdn.com/w40/eg.png", dialCode: "+20", region: "Africa", operators: ["Orange", "Vodafone", "WE"] },
  { code: "ET", name: "Ethiopia", flag: "https://flagcdn.com/w40/et.png", dialCode: "+251", region: "Africa", operators: ["Ethio Telecom", "Safaricom"] },
  { code: "GH", name: "Ghana", flag: "https://flagcdn.com/w40/gh.png", dialCode: "+233", region: "Africa", operators: ["AirtelTigo", "MTN", "Vodafone"] },
  { code: "KE", name: "Kenya", flag: "https://flagcdn.com/w40/ke.png", dialCode: "+254", region: "Africa", operators: ["Airtel", "Safaricom", "Telkom"] },
  { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w40/ma.png", dialCode: "+212", region: "Africa", operators: ["IAM", "Orange", "inwi"] },
  { code: "NG", name: "Nigeria", flag: "https://flagcdn.com/w40/ng.png", dialCode: "+234", region: "Africa", operators: ["Airtel", "Glo", "MTN", "9mobile"] },
  { code: "ZA", name: "South Africa", flag: "https://flagcdn.com/w40/za.png", dialCode: "+27", region: "Africa", operators: ["Cell C", "MTN", "Vodacom"] },
  { code: "TZ", name: "Tanzania", flag: "https://flagcdn.com/w40/tz.png", dialCode: "+255", region: "Africa", operators: ["Airtel", "Halotel", "Tigo", "Vodacom"] },
  
  // Asia | The Pacific
  { code: "AF", name: "Afghanistan", flag: "https://flagcdn.com/w40/af.png", dialCode: "+93", region: "Asia | The Pacific", operators: ["AWCC", "Atoma", "Etisalat", "Roshan"] },
  { code: "AS", name: "American Samoa", flag: "https://flagcdn.com/w40/as.png", dialCode: "+1684", region: "Asia | The Pacific", operators: ["BlueSky"] },
  { code: "AU", name: "Australia", flag: "https://flagcdn.com/w40/au.png", dialCode: "+61", region: "Asia | The Pacific", operators: ["Optus", "Telstra", "Vodafone"] },
  { code: "BD", name: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png", dialCode: "+880", region: "Asia | The Pacific", operators: ["Banglalink", "Grameenphone", "Robi"] },
  { code: "CN", name: "China", flag: "https://flagcdn.com/w40/cn.png", dialCode: "+86", region: "Asia | The Pacific", operators: ["China Mobile", "China Telecom", "China Unicom"] },
  { code: "HK", name: "Hong Kong", flag: "https://flagcdn.com/w40/hk.png", dialCode: "+852", region: "Asia | The Pacific", operators: ["3HK", "CSL", "SmarTone"] },
  { code: "IN", name: "India", flag: "https://flagcdn.com/w40/in.png", dialCode: "+91", region: "Asia | The Pacific", operators: ["Airtel", "Jio", "Vi"] },
  { code: "ID", name: "Indonesia", flag: "https://flagcdn.com/w40/id.png", dialCode: "+62", region: "Asia | The Pacific", operators: ["Indosat", "Telkomsel", "XL"] },
  { code: "JP", name: "Japan", flag: "https://flagcdn.com/w40/jp.png", dialCode: "+81", region: "Asia | The Pacific", operators: ["au", "Docomo", "SoftBank"] },
  { code: "MY", name: "Malaysia", flag: "https://flagcdn.com/w40/my.png", dialCode: "+60", region: "Asia | The Pacific", operators: ["Celcom", "Digi", "Maxis"] },
  { code: "NZ", name: "New Zealand", flag: "https://flagcdn.com/w40/nz.png", dialCode: "+64", region: "Asia | The Pacific", operators: ["2degrees", "Spark", "Vodafone"] },
  { code: "PK", name: "Pakistan", flag: "https://flagcdn.com/w40/pk.png", dialCode: "+92", region: "Asia | The Pacific", operators: ["Jazz", "Telenor", "Ufone", "Zong"] },
  { code: "PH", name: "Philippines", flag: "https://flagcdn.com/w40/ph.png", dialCode: "+63", region: "Asia | The Pacific", operators: ["Globe", "Smart", "Sun"] },
  { code: "SG", name: "Singapore", flag: "https://flagcdn.com/w40/sg.png", dialCode: "+65", region: "Asia | The Pacific", operators: ["M1", "Singtel", "StarHub"] },
  { code: "KR", name: "South Korea", flag: "https://flagcdn.com/w40/kr.png", dialCode: "+82", region: "Asia | The Pacific", operators: ["KT", "LG U+", "SK Telecom"] },
  { code: "LK", name: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png", dialCode: "+94", region: "Asia | The Pacific", operators: ["Dialog", "Hutch", "Mobitel"] },
  { code: "TH", name: "Thailand", flag: "https://flagcdn.com/w40/th.png", dialCode: "+66", region: "Asia | The Pacific", operators: ["AIS", "True", "dtac"] },
  { code: "VN", name: "Vietnam", flag: "https://flagcdn.com/w40/vn.png", dialCode: "+84", region: "Asia | The Pacific", operators: ["MobiFone", "Viettel", "Vinaphone"] },
  
  // Central | North America
  { code: "CA", name: "Canada", flag: "https://flagcdn.com/w40/ca.png", dialCode: "+1", region: "Central | North America", operators: ["Bell", "Rogers", "Telus"] },
  { code: "CR", name: "Costa Rica", flag: "https://flagcdn.com/w40/cr.png", dialCode: "+506", region: "Central | North America", operators: ["ICE", "Movistar"] },
  { code: "SV", name: "El Salvador", flag: "https://flagcdn.com/w40/sv.png", dialCode: "+503", region: "Central | North America", operators: ["Claro", "Digicel", "Movistar"] },
  { code: "GT", name: "Guatemala", flag: "https://flagcdn.com/w40/gt.png", dialCode: "+502", region: "Central | North America", operators: ["Claro", "Movistar", "Tigo"] },
  { code: "HN", name: "Honduras", flag: "https://flagcdn.com/w40/hn.png", dialCode: "+504", region: "Central | North America", operators: ["Claro", "Tigo"] },
  { code: "MX", name: "Mexico", flag: "https://flagcdn.com/w40/mx.png", dialCode: "+52", region: "Central | North America", operators: ["AT&T", "Movistar", "Telcel"] },
  { code: "NI", name: "Nicaragua", flag: "https://flagcdn.com/w40/ni.png", dialCode: "+505", region: "Central | North America", operators: ["Claro", "Movistar"] },
  { code: "PA", name: "Panama", flag: "https://flagcdn.com/w40/pa.png", dialCode: "+507", region: "Central | North America", operators: ["Claro", "Digicel", "Movistar"] },
  { code: "US", name: "United States", flag: "https://flagcdn.com/w40/us.png", dialCode: "+1", region: "Central | North America", operators: ["AT&T", "Airvoice", "Black Wireless Monthly Unlimited", "Go Smart", "H2O Wireless", "Life Wireless Unlimited", "T-Mobile", "Verizon", "Cricket", "Boost Mobile", "Metro by T-Mobile", "Straight Talk", "TracFone", "Mint Mobile", "US Mobile"] },
  
  // Europe
  { code: "AI", name: "Anguilla", flag: "https://flagcdn.com/w40/ai.png", dialCode: "+1264", region: "The Caribbean", operators: ["Digicel", "FLOW"] },
  { code: "AL", name: "Albania", flag: "https://flagcdn.com/w40/al.png", dialCode: "+355", region: "Europe", operators: ["Eagle Mobile", "Vodafone"] },
  { code: "AT", name: "Austria", flag: "https://flagcdn.com/w40/at.png", dialCode: "+43", region: "Europe", operators: ["3", "A1", "T-Mobile"] },
  { code: "BE", name: "Belgium", flag: "https://flagcdn.com/w40/be.png", dialCode: "+32", region: "Europe", operators: ["Base", "Orange", "Proximus"] },
  { code: "BG", name: "Bulgaria", flag: "https://flagcdn.com/w40/bg.png", dialCode: "+359", region: "Europe", operators: ["A1", "Telenor", "Vivacom"] },
  { code: "HR", name: "Croatia", flag: "https://flagcdn.com/w40/hr.png", dialCode: "+385", region: "Europe", operators: ["A1", "HT", "Telemach"] },
  { code: "CZ", name: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png", dialCode: "+420", region: "Europe", operators: ["O2", "T-Mobile", "Vodafone"] },
  { code: "DK", name: "Denmark", flag: "https://flagcdn.com/w40/dk.png", dialCode: "+45", region: "Europe", operators: ["3", "TDC", "Telenor"] },
  { code: "EE", name: "Estonia", flag: "https://flagcdn.com/w40/ee.png", dialCode: "+372", region: "Europe", operators: ["Elisa", "Tele2", "Telia"] },
  { code: "FI", name: "Finland", flag: "https://flagcdn.com/w40/fi.png", dialCode: "+358", region: "Europe", operators: ["DNA", "Elisa", "Telia"] },
  { code: "FR", name: "France", flag: "https://flagcdn.com/w40/fr.png", dialCode: "+33", region: "Europe", operators: ["Bouygues", "Free", "Orange", "SFR"] },
  { code: "DE", name: "Germany", flag: "https://flagcdn.com/w40/de.png", dialCode: "+49", region: "Europe", operators: ["O2", "T-Mobile", "Vodafone"] },
  { code: "GR", name: "Greece", flag: "https://flagcdn.com/w40/gr.png", dialCode: "+30", region: "Europe", operators: ["Cosmote", "Nova", "Vodafone"] },
  { code: "HU", name: "Hungary", flag: "https://flagcdn.com/w40/hu.png", dialCode: "+36", region: "Europe", operators: ["Magyar Telekom", "Telenor", "Vodafone"] },
  { code: "IE", name: "Ireland", flag: "https://flagcdn.com/w40/ie.png", dialCode: "+353", region: "Europe", operators: ["3", "Eir", "Vodafone"] },
  { code: "IT", name: "Italy", flag: "https://flagcdn.com/w40/it.png", dialCode: "+39", region: "Europe", operators: ["3", "TIM", "Vodafone", "WindTre"] },
  { code: "LV", name: "Latvia", flag: "https://flagcdn.com/w40/lv.png", dialCode: "+371", region: "Europe", operators: ["Bite", "LMT", "Tele2"] },
  { code: "LT", name: "Lithuania", flag: "https://flagcdn.com/w40/lt.png", dialCode: "+370", region: "Europe", operators: ["Bite", "Tele2", "Telia"] },
  { code: "NL", name: "Netherlands", flag: "https://flagcdn.com/w40/nl.png", dialCode: "+31", region: "Europe", operators: ["KPN", "T-Mobile", "VodafoneZiggo"] },
  { code: "NO", name: "Norway", flag: "https://flagcdn.com/w40/no.png", dialCode: "+47", region: "Europe", operators: ["Ice", "Telenor", "Telia"] },
  { code: "PL", name: "Poland", flag: "https://flagcdn.com/w40/pl.png", dialCode: "+48", region: "Europe", operators: ["Orange", "Play", "Plus", "T-Mobile"] },
  { code: "PT", name: "Portugal", flag: "https://flagcdn.com/w40/pt.png", dialCode: "+351", region: "Europe", operators: ["MEO", "NOS", "Vodafone"] },
  { code: "RO", name: "Romania", flag: "https://flagcdn.com/w40/ro.png", dialCode: "+40", region: "Europe", operators: ["Digi", "Orange", "Telekom", "Vodafone"] },
  { code: "RU", name: "Russia", flag: "https://flagcdn.com/w40/ru.png", dialCode: "+7", region: "Europe", operators: ["Beeline", "MegaFon", "MTS", "Tele2"] },
  { code: "SK", name: "Slovakia", flag: "https://flagcdn.com/w40/sk.png", dialCode: "+421", region: "Europe", operators: ["O2", "Orange", "Telekom"] },
  { code: "SI", name: "Slovenia", flag: "https://flagcdn.com/w40/si.png", dialCode: "+386", region: "Europe", operators: ["A1", "Telekom", "Telemach"] },
  { code: "ES", name: "Spain", flag: "https://flagcdn.com/w40/es.png", dialCode: "+34", region: "Europe", operators: ["Movistar", "Orange", "Vodafone", "Yoigo"] },
  { code: "SE", name: "Sweden", flag: "https://flagcdn.com/w40/se.png", dialCode: "+46", region: "Europe", operators: ["3", "Tele2", "Telenor", "Telia"] },
  { code: "CH", name: "Switzerland", flag: "https://flagcdn.com/w40/ch.png", dialCode: "+41", region: "Europe", operators: ["Salt", "Sunrise", "Swisscom"] },
  { code: "TR", name: "Turkey", flag: "https://flagcdn.com/w40/tr.png", dialCode: "+90", region: "Europe", operators: ["Turkcell", "Türk Telekom", "Vodafone"] },
  { code: "UA", name: "Ukraine", flag: "https://flagcdn.com/w40/ua.png", dialCode: "+380", region: "Europe", operators: ["Kyivstar", "Lifecell", "Vodafone"] },
  { code: "GB", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png", dialCode: "+44", region: "Europe", operators: ["3", "giffgaff", "Lebara", "Lyca", "Now Mobile", "O2", "Vodafone"] },
  
  // South America
  { code: "AR", name: "Argentina", flag: "https://flagcdn.com/w40/ar.png", dialCode: "+54", region: "South America", operators: ["Claro", "Movistar", "Personal"] },
  { code: "BO", name: "Bolivia", flag: "https://flagcdn.com/w40/bo.png", dialCode: "+591", region: "South America", operators: ["Entel", "Tigo", "Viva"] },
  { code: "BR", name: "Brazil", flag: "https://flagcdn.com/w40/br.png", dialCode: "+55", region: "South America", operators: ["Claro", "TIM", "Vivo"] },
  { code: "CL", name: "Chile", flag: "https://flagcdn.com/w40/cl.png", dialCode: "+56", region: "South America", operators: ["Claro", "Entel", "Movistar", "WOM"] },
  { code: "CO", name: "Colombia", flag: "https://flagcdn.com/w40/co.png", dialCode: "+57", region: "South America", operators: ["Claro", "Movistar", "Tigo"] },
  { code: "EC", name: "Ecuador", flag: "https://flagcdn.com/w40/ec.png", dialCode: "+593", region: "South America", operators: ["Claro", "CNT", "Movistar"] },
  { code: "PY", name: "Paraguay", flag: "https://flagcdn.com/w40/py.png", dialCode: "+595", region: "South America", operators: ["Claro", "Personal", "Tigo"] },
  { code: "PE", name: "Peru", flag: "https://flagcdn.com/w40/pe.png", dialCode: "+51", region: "South America", operators: ["Bitel", "Claro", "Entel", "Movistar"] },
  { code: "UY", name: "Uruguay", flag: "https://flagcdn.com/w40/uy.png", dialCode: "+598", region: "South America", operators: ["Antel", "Claro", "Movistar"] },
  { code: "VE", name: "Venezuela", flag: "https://flagcdn.com/w40/ve.png", dialCode: "+58", region: "South America", operators: ["Digitel", "Movistar", "Movilnet"] },
  
  // The Caribbean
];

// Get appropriate logo for operator
const getOperatorLogo = (operatorName: string) => {
  const name = operatorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  // Map operators to their SVG icons from assets/icons/folder
  const iconMap: { [key: string]: string } = {
    'vodafone': '/src/assets/icons/folder/Vodafone.svg',
    'orange': '/src/assets/icons/folder/Orange.svg',
    'mtn': '/src/assets/icons/folder/MTN.svg',
    'att': '/lovable-uploads/2d4d7e0c-81ea-4c08-b4ef-81fbd1bb69e0.png',
    'at&t': '/lovable-uploads/2d4d7e0c-81ea-4c08-b4ef-81fbd1bb69e0.png',
    'tmobile': '/src/assets/icons/folder/T-Mobile.svg',
    't-mobile': '/src/assets/icons/folder/T-Mobile.svg',
    'verizon': '/src/assets/icons/folder/Verizon.svg',
    'claro': '/src/assets/icons/folder/Claro.svg',
    'movistar': '/src/assets/icons/folder/Movistar.svg',
    'jio': '/src/assets/icons/folder/Jio.svg',
    'airtel': '/src/assets/icons/folder/Airtel.svg',
    'vi': '/src/assets/icons/folder/Vi.svg',
    'docomo': '/src/assets/icons/folder/Docomo.svg',
    'softbank': '/src/assets/icons/folder/SoftBank.svg',
    'au': '/src/assets/icons/folder/au.svg',
    'telia': '/src/assets/icons/folder/Telia.svg',
    'telenor': '/src/assets/icons/folder/Telenor.svg',
    'tele2': '/src/assets/icons/folder/Tele2.svg',
    'o2': '/src/assets/icons/folder/O2.svg',
    'three': '/src/assets/icons/folder/3.svg',
    '3': '/src/assets/icons/folder/3.svg',
    '3hk': '/src/assets/icons/folder/3HK.png',
    'smartone': '/src/assets/icons/folder/SmarTone.svg',
    'csl': '/src/assets/icons/folder/CSL.svg',
    'kyivstar': '/src/assets/icons/folder/Kyivstar.svg',
    'lifecell': '/src/assets/icons/folder/Lifecell.svg',
    'turkcell': '/src/assets/icons/folder/Turkcell.svg',
    'türktelekom': '/src/assets/icons/folder/T_rk_Telekom.svg',
    'turktelekom': '/src/assets/icons/folder/T_rk_Telekom.svg',
    'grameenphone': '/src/assets/icons/folder/Grameenphone.svg',
    'robi': '/src/assets/icons/folder/Robi.svg',
    'banglalink': '/src/assets/icons/folder/Banglalink.png',
    'etisalat': '/src/assets/icons/folder/Etisalat.svg',
    'djezzy': '/src/assets/icons/folder/Djezzy.svg',
    'mobilis': '/src/assets/icons/folder/Mobilis.svg',
    'ooredoo': '/src/assets/icons/folder/Ooredoo.svg',
    'inwi': '/src/assets/icons/folder/inwi.svg',
    'iam': '/src/assets/icons/folder/IAM.svg',
    'glo': '/src/assets/icons/folder/Glo.png',
    '9mobile': '/src/assets/icons/folder/9mobile.svg',
    'safaricom': '/src/assets/icons/folder/Safaricom.svg',
    'vodacom': '/src/assets/icons/folder/Vodacom.svg',
    'cellc': '/src/assets/icons/folder/Cell_C.svg',
    'telstra': '/src/assets/icons/folder/Telstra.svg',
    'optus': '/src/assets/icons/folder/Optus.svg',
    'singtel': '/src/assets/icons/folder/Singtel.svg',
    'starhub': '/src/assets/icons/folder/starhub.webp',
    'm1': '/src/assets/icons/folder/M1.svg',
    'celcom': '/src/assets/icons/folder/Celcom.svg',
    'digi': '/src/assets/icons/folder/Digi.svg',
    'maxis': '/src/assets/icons/folder/Maxis.svg',
    'telkomsel': '/src/assets/icons/folder/Telkomsel.svg',
    'indosat': '/src/assets/icons/folder/Indosat.svg',
    'xl': '/src/assets/icons/folder/XL.svg',
    'chinamobile': '/src/assets/icons/folder/China_Mobile.png',
    'chinatelecom': '/src/assets/icons/folder/China_Telecom.svg',
    'chinaunicom': '/src/assets/icons/folder/China_Unicom.svg',
    'globe': '/src/assets/icons/folder/Globe.svg',
    'smart': '/src/assets/icons/folder/Go_Smart.png',
    'sun': '/src/assets/icons/folder/Sun.jpg',
    'jazz': '/src/assets/icons/folder/Jazz.svg',
    'ufone': '/src/assets/icons/folder/Ufone.png',
    'zong': '/src/assets/icons/folder/Zong.png',
    'spark': '/src/assets/icons/folder/Spark .png',
    '2degrees': '/src/assets/icons/folder/2degrees.svg',
    'bell': '/src/assets/icons/folder/Bell.png',
    'rogers': '/src/assets/icons/folder/Rogers.svg',
    'telus': '/src/assets/icons/folder/Telus.svg',
    'cricket': '/src/assets/icons/folder/Cricket.png',
    'boostmobile': '/src/assets/icons/folder/Boost_Mobile.svg',
    'metrobytmobile': '/src/assets/icons/folder/Metro_by_T-Mobile.svg',
    'straighttalk': '/src/assets/icons/folder/Straight_Talk.svg',
    'tracfone': '/src/assets/icons/folder/TracFone.svg',
    'mintmobile': '/src/assets/icons/folder/Mint_Mobile.svg',
    'usmobile': '/src/assets/icons/folder/US_Mobile.svg',
    'airvoice': '/src/assets/icons/folder/Airvoice.png',
    'blackwirelessmonthlyunlimited': '/src/assets/icons/folder/Black_Wireless_Monthly_Unlimited.svg',
    'h2owireless': '/src/assets/icons/folder/H2O_Wireless.png',
    'gosmart': '/src/assets/icons/folder/Go_Smart.png',
    'nowmobile': '/src/assets/icons/folder/Now_Mobile.svg',
    'giffgaff': '/src/assets/icons/folder/giffgaff.svg',
    'lebara': '/src/assets/icons/folder/Lebara.png',
    'lyca': '/src/assets/icons/folder/Lyca.svg',
    'tim': '/src/assets/icons/folder/TIM.svg',
    'windtre': '/src/assets/icons/folder/WindTre.svg',
    'vivo': '/src/assets/icons/folder/Vivo.svg',
    'cosmote': '/src/assets/icons/folder/Cosmote.svg',
    'nova': '/src/assets/icons/folder/Nova.svg',
    'bouygues': '/src/assets/icons/folder/Bouygues.svg',
    'free': '/src/assets/icons/folder/Free.svg',
    'sfr': '/src/assets/icons/folder/SFR.svg',
    'telekom': '/src/assets/icons/folder/Telekom.svg',
    'magyartelekom': '/src/assets/icons/folder/Magyar_Telekom.svg',
    'kpn': '/src/assets/icons/folder/KPN.svg',
    'vodafoneziggo': '/src/assets/icons/folder/VodaFone Ziggo.webp',
    'nos': '/src/assets/icons/folder/NOS.svg',
    'meo': '/src/assets/icons/folder/MEO.svg',
    'yoigo': '/src/assets/icons/folder/Yoigo.svg',
    'salt': '/src/assets/icons/folder/Salt.svg',
    'sunrise': '/src/assets/icons/folder/Sunrise.svg',
    'swisscom': '/src/assets/icons/folder/Swisscom.svg',
    'proximus': '/src/assets/icons/folder/Proximus.svg',
    'base': '/src/assets/icons/folder/Base.svg',
    'vivacom': '/src/assets/icons/folder/Vivacom.svg',
    'a1': '/src/assets/icons/folder/A1.svg',
    'ht': '/src/assets/icons/folder/HT.svg',
    'telemach': '/src/assets/icons/folder/Telemach.svg',
    'tdc': '/src/assets/icons/folder/TDC.svg',
    'ice': '/src/assets/icons/folder/ICE.png',
    'elisa': '/src/assets/icons/folder/Elisa.svg',
    'dna': '/src/assets/icons/folder/DNA.svg',
    'bite': '/src/assets/icons/folder/Bite.svg',
    'lmt': '/src/assets/icons/folder/LMT.svg',
    'play': '/src/assets/icons/folder/Play.svg',
    'plus': '/src/assets/icons/folder/Plus.svg',
    'mts': '/src/assets/icons/folder/MTS.svg',
    'beeline': '/src/assets/icons/folder/Beeline.png',
    'megafon': '/src/assets/icons/folder/MegaFon.svg',
    'sktelecom': '/src/assets/icons/folder/SK_Telecom.svg',
    'kt': '/src/assets/icons/folder/KT.svg',
    'lgu': '/src/assets/icons/folder/LG_U_.svg',
    'lgu+': '/src/assets/icons/folder/LG_U_.svg',
    'ais': '/src/assets/icons/folder/AIS.svg',
    'true': '/src/assets/icons/folder/True.svg',
    'dtac': '/src/assets/icons/folder/Dtac.png',
    'mobifone': '/src/assets/icons/folder/MobiFone.svg',
    'viettel': '/src/assets/icons/folder/Viettel.svg',
    'vinaphone': '/src/assets/icons/folder/Vinaphone.svg',
    'personal': '/src/assets/icons/folder/Personal.svg',
    'tigo': '/src/assets/icons/folder/Tigo.svg',
    'viva': '/src/assets/icons/folder/Viva.svg',
    'entel': '/src/assets/icons/folder/Entel.svg',
    'wom': '/src/assets/icons/folder/WOM.svg',
    'bitel': '/src/assets/icons/folder/Bitel.webp',
    'cnt': '/src/assets/icons/folder/CNT.svg',
    'antel': '/src/assets/icons/folder/Antel.svg',
    'digitel': '/src/assets/icons/folder/Digitel.png',
    'movilnet': '/src/assets/icons/folder/Movilnet.png',
    'dialog': '/src/assets/icons/folder/Dialog.svg',
    'hutch': '/src/assets/icons/folder/Hutch.svg',
    'mobitel': '/src/assets/icons/folder/Mobitel.png',
    'digicel': '/src/assets/icons/folder/Digicel.png',
    'flow': '/src/assets/icons/folder/FLOW.svg',
    'awcc': '/src/assets/icons/folder/AWCC.png',
    'roshan': '/src/assets/icons/folder/Roshan.svg',
    'bluesky': '/src/assets/icons/folder/BlueSky.svg',
    'unitelangola': '/src/assets/icons/folder/Unitel_Angola.svg',
    'movicelangola': '/src/assets/icons/folder/Movicel_Angola.png',
    'africellangola': '/src/assets/icons/folder/Africell_Angola.png',
    'we': '/src/assets/icons/folder/WE.svg',
    'ethiotelecom': '/src/assets/icons/folder/Ethio_Telecom.jpg',
    'airteltigo': '/src/assets/icons/folder/AirtelTigo.svg',
    'halotel': '/src/assets/icons/folder/Halotel.png',
    'eir': '/src/assets/icons/folder/Eir.svg',
    'eaglemobile': '/src/assets/icons/folder/Eagle_Mobile.svg'
  };
  
  return iconMap[name] || null;
};

// Get operators for the current country from the countries data
const getOperatorsForCountry = (countryCode: string) => {
  const countryData = countries.find(c => c.code === countryCode);
  if (!countryData) return [];
  
  const operators = countryData.operators.map((operatorName, index) => {
    const logo = getOperatorLogo(operatorName);
    return {
      id: `${countryCode}-${index}`,
      name: operatorName,
      logo: logo || `https://imagerepo.ding.com/logo/${operatorName.toUpperCase()}/default.png`,
      hasCustomLogo: !!logo,
      type: operatorName.includes("PIN") ? "PIN" : ""
    };
  });

  // Always add "Other" option at the end
  operators.push({
    id: `${countryCode}-other`,
    name: "Other",
    logo: null,
    hasCustomLogo: false,
    type: ""
  });

  return operators;
};

export function ProviderSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedSpinnerUrl, setProcessedSpinnerUrl] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state) {
      setCountry(state.country);
      setPhoneNumber(state.phoneNumber);
    } else {
      // Redirect back if no data
      navigate("/topup");
    }
  }, [location, navigate]);

  useEffect(() => {
    const processSpinnerImage = async () => {
      try {
        const img = new Image();
        img.src = '/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png';
        const processedBlob = await removeBackground(img);
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedSpinnerUrl(processedUrl);
      } catch (error) {
        console.error('Failed to process spinner image:', error);
      }
    };

    processSpinnerImage();
  }, []);

  // Get operators for the current country
  const currentOperators = country ? getOperatorsForCountry(country.code) : [];
  
  const filteredOperators = currentOperators.filter(operator =>
    operator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCountries = countries.filter(countryItem =>
    countryItem.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    countryItem.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const handleCountrySelect = (selectedCountry: Country) => {
    setCountry(selectedCountry);
    setIsEditingCountry(false);
    setCountrySearchQuery("");
  };

  const handleSaveNumber = () => {
    setIsEditingNumber(false);
  };

  const handleProviderSelect = async (provider: { id: string; name: string; logo: string | null; type: string }) => {
    setIsLoading(true);
    
    // Show loading animation for 2-5 seconds
    const loadingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    setIsLoading(false);
    
    navigate('/topup-amount', {
      state: {
        country,
        phoneNumber,
        provider
      }
    });
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownVisible(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 2000);
  };

  const handleAccountAction = () => {
    if (isAuthenticated) {
      // If already logged in, go directly to order page
      navigate('/order');
    } else {
      // If not logged in, go to authorization page
      navigate('/authorization', { state: { from: location.pathname } });
    }
  };

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Decorative Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large star/asterisk decoration - positioned like in the reference */}
        <div className="absolute top-20 left-10 transform -rotate-12">
          <img 
            src="/lovable-uploads/66f38f52-55c1-4874-80be-8db2bb263358.png" 
            alt="Decorative asterisk" 
            className="w-48 h-48 opacity-80"
          />
        </div>
        
        {/* Additional geometric shapes */}
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-600/20 rounded-lg transform rotate-45"></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-cyan-500/15 rounded-full"></div>
        <div className="absolute bottom-1/3 left-20 w-24 h-24 bg-teal-700/10 transform rotate-12 rounded-lg"></div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img 
              src={processedSpinnerUrl || '/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png'} 
              alt="Loading..." 
              className="w-32 h-32"
              style={{
                animation: 'spin-bounce 2s linear infinite'
              }}
            />
          </div>
        </div>
      )}

      <DingHeader variant="topup" onLogout={logout} />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-8">
        <div className="w-full max-w-md">
          <Card className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-0">
            <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800">
              Who would you like to top-up?
            </h1>
            
            {/* Country Info */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">Country:</span>
                  {isEditingCountry ? (
                    <Popover open={isEditingCountry} onOpenChange={setIsEditingCountry}>
                      <PopoverTrigger asChild>
                        <div className="flex items-center space-x-2 cursor-pointer">
                          <img src={country.flag} alt={`${country.name} flag`} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-gray-700 font-medium">{country.name}</span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-0 bg-white border border-gray-200 shadow-xl z-50 rounded-2xl" align="start">
                        <div className="p-4 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="text"
                              placeholder="Search countries..."
                              value={countrySearchQuery}
                              onChange={(e) => setCountrySearchQuery(e.target.value)}
                              className="pl-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="max-h-80 overflow-auto bg-white">
                          {filteredCountries.map((countryItem) => (
                            <div
                              key={countryItem.code}
                              onClick={() => handleCountrySelect(countryItem)}
                              className={cn(
                                "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors",
                                country?.code === countryItem.code && "bg-teal-50"
                              )}
                            >
                              <img src={countryItem.flag} alt={`${countryItem.name} flag`} className="w-8 h-8 mr-3 object-cover rounded-full" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{countryItem.name}</div>
                                <div className="text-sm text-gray-500">{countryItem.dialCode}</div>
                              </div>
                              {country?.code === countryItem.code && (
                                <Check className="w-5 h-5 text-teal-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <>
                      <img src={country.flag} alt={`${country.name} flag`} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-gray-700 font-medium">{country.name}</span>
                    </>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  className="text-teal-600 hover:text-teal-700 text-sm p-0 h-auto font-medium"
                  onClick={() => setIsEditingCountry(true)}
                >
                  Edit ›
                </Button>
              </div>
            </div>

            {/* Phone Number Info */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-gray-700 font-medium">Number:</span>
                  {isEditingNumber ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-gray-700 font-medium">{country.dialCode}</span>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 max-w-[200px] h-8 text-sm border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        onBlur={handleSaveNumber}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveNumber();
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span className="text-gray-700 font-medium">{country.dialCode} {phoneNumber}</span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  className="text-teal-600 hover:text-teal-700 text-sm p-0 h-auto font-medium"
                  onClick={() => setIsEditingNumber(true)}
                >
                  Edit ›
                </Button>
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Who provides their service?
              </h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                />
              </div>

              {/* Operators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOperators.map((operator) => (
                  <Card 
                    key={operator.id}
                    className="p-4 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-teal-300 bg-white/80"
                    onClick={() => handleProviderSelect(operator)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="relative">
                        {operator.hasCustomLogo && operator.logo ? (
                          <img 
                            src={operator.logo} 
                            alt={`${operator.name} logo`} 
                            className="w-12 h-12 object-contain rounded-lg"
                          />
                        ) : operator.name === "Other" ? (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            <Smartphone className="w-6 h-6 text-gray-600" />
                          </div>
                        ) : (
                          <img 
                            src={operator.logo} 
                            alt={`${operator.name} logo`} 
                            className="w-12 h-12 object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg hidden items-center justify-center">
                          <Smartphone className="w-6 h-6 text-gray-600" />
                        </div>
                        {operator.type && (
                          <span className="absolute -top-1 -right-2 bg-teal-600 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                            {operator.type}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{operator.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Ding. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}