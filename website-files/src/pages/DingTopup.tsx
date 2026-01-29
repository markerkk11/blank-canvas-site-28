import { useState, useRef, useEffect } from "react";
import fireIcon from "@/assets/fire-icon.png";
import phoneIcon from "@/assets/phone-icon.png";
import emailIcon from "@/assets/email-icon.png";
import pencilEditIcon from "@/assets/pencil-edit-icon.png";
import paymentMethodsIcon from "@/assets/payment-methods.png";
import checkmarkIcon from "@/assets/checkmark-icon.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronDown, ChevronRight, Check, Smartphone, ArrowLeft, Edit, CheckCircle, Download, Mail, User, Loader2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeBackground, loadImageFromUrl, removeSolidBackground } from "@/utils/backgroundRemoval";
import DingHeader from "@/components/DingHeader";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useGeoCurrency } from "@/hooks/useGeoCurrency";
import { addOrder } from "@/utils/ordersStore";



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

let attCustomLogoUrl: string | null = null;

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  region: string;
  operators: string[];
}

const countries: Country[] = [
// Africa
{
  code: "DZ",
  name: "Algeria",
  flag: "https://flagcdn.com/w40/dz.png",
  dialCode: "+213",
  region: "Africa",
  operators: ["Djezzy", "Mobilis", "Ooredoo"]
}, {
  code: "AO",
  name: "Angola",
  flag: "https://flagcdn.com/w40/ao.png",
  dialCode: "+244",
  region: "Africa",
  operators: ["Africell Angola", "Movicel Angola", "Unitel Angola"]
}, {
  code: "EG",
  name: "Egypt",
  flag: "https://flagcdn.com/w40/eg.png",
  dialCode: "+20",
  region: "Africa",
  operators: ["Orange", "Vodafone", "WE"]
}, {
  code: "ET",
  name: "Ethiopia",
  flag: "https://flagcdn.com/w40/et.png",
  dialCode: "+251",
  region: "Africa",
  operators: ["Ethio Telecom", "Safaricom"]
}, {
  code: "GH",
  name: "Ghana",
  flag: "https://flagcdn.com/w40/gh.png",
  dialCode: "+233",
  region: "Africa",
  operators: ["AirtelTigo", "MTN", "Vodafone"]
}, {
  code: "KE",
  name: "Kenya",
  flag: "https://flagcdn.com/w40/ke.png",
  dialCode: "+254",
  region: "Africa",
  operators: ["Airtel", "Safaricom", "Telkom"]
}, {
  code: "MA",
  name: "Morocco",
  flag: "https://flagcdn.com/w40/ma.png",
  dialCode: "+212",
  region: "Africa",
  operators: ["IAM", "Orange", "inwi"]
}, {
  code: "NG",
  name: "Nigeria",
  flag: "https://flagcdn.com/w40/ng.png",
  dialCode: "+234",
  region: "Africa",
  operators: ["Airtel", "Glo", "MTN", "9mobile"]
}, {
  code: "ZA",
  name: "South Africa",
  flag: "https://flagcdn.com/w40/za.png",
  dialCode: "+27",
  region: "Africa",
  operators: ["Cell C", "MTN", "Vodacom"]
}, {
  code: "TZ",
  name: "Tanzania",
  flag: "https://flagcdn.com/w40/tz.png",
  dialCode: "+255",
  region: "Africa",
  operators: ["Airtel", "Halotel", "Tigo", "Vodacom"]
},
// Asia | The Pacific
{
  code: "AF",
  name: "Afghanistan",
  flag: "https://flagcdn.com/w40/af.png",
  dialCode: "+93",
  region: "Asia | The Pacific",
  operators: ["AWCC", "Atoma", "Etisalat", "Roshan"]
}, {
  code: "AS",
  name: "American Samoa",
  flag: "https://flagcdn.com/w40/as.png",
  dialCode: "+1684",
  region: "Asia | The Pacific",
  operators: ["BlueSky"]
}, {
  code: "AU",
  name: "Australia",
  flag: "https://flagcdn.com/w40/au.png",
  dialCode: "+61",
  region: "Asia | The Pacific",
  operators: ["Optus", "Telstra", "Vodafone"]
}, {
  code: "BD",
  name: "Bangladesh",
  flag: "https://flagcdn.com/w40/bd.png",
  dialCode: "+880",
  region: "Asia | The Pacific",
  operators: ["Banglalink", "Grameenphone", "Robi"]
}, {
  code: "CN",
  name: "China",
  flag: "https://flagcdn.com/w40/cn.png",
  dialCode: "+86",
  region: "Asia | The Pacific",
  operators: ["China Mobile", "China Telecom", "China Unicom"]
}, {
  code: "HK",
  name: "Hong Kong",
  flag: "https://flagcdn.com/w40/hk.png",
  dialCode: "+852",
  region: "Asia | The Pacific",
  operators: ["3HK", "CSL", "SmarTone"]
}, {
  code: "IN",
  name: "India",
  flag: "https://flagcdn.com/w40/in.png",
  dialCode: "+91",
  region: "Asia | The Pacific",
  operators: ["Airtel", "Jio", "Vi"]
}, {
  code: "ID",
  name: "Indonesia",
  flag: "https://flagcdn.com/w40/id.png",
  dialCode: "+62",
  region: "Asia | The Pacific",
  operators: ["Indosat", "Telkomsel", "XL"]
}, {
  code: "JP",
  name: "Japan",
  flag: "https://flagcdn.com/w40/jp.png",
  dialCode: "+81",
  region: "Asia | The Pacific",
  operators: ["au", "Docomo", "SoftBank"]
}, {
  code: "MY",
  name: "Malaysia",
  flag: "https://flagcdn.com/w40/my.png",
  dialCode: "+60",
  region: "Asia | The Pacific",
  operators: ["Celcom", "Digi", "Maxis"]
}, {
  code: "NZ",
  name: "New Zealand",
  flag: "https://flagcdn.com/w40/nz.png",
  dialCode: "+64",
  region: "Asia | The Pacific",
  operators: ["2degrees", "Spark", "Vodafone"]
}, {
  code: "PK",
  name: "Pakistan",
  flag: "https://flagcdn.com/w40/pk.png",
  dialCode: "+92",
  region: "Asia | The Pacific",
  operators: ["Jazz", "Telenor", "Ufone", "Zong"]
}, {
  code: "PH",
  name: "Philippines",
  flag: "https://flagcdn.com/w40/ph.png",
  dialCode: "+63",
  region: "Asia | The Pacific",
  operators: ["Globe", "Smart", "Sun"]
}, {
  code: "SG",
  name: "Singapore",
  flag: "https://flagcdn.com/w40/sg.png",
  dialCode: "+65",
  region: "Asia | The Pacific",
  operators: ["M1", "Singtel", "StarHub"]
}, {
  code: "KR",
  name: "South Korea",
  flag: "https://flagcdn.com/w40/kr.png",
  dialCode: "+82",
  region: "Asia | The Pacific",
  operators: ["KT", "LG U+", "SK Telecom"]
}, {
  code: "LK",
  name: "Sri Lanka",
  flag: "https://flagcdn.com/w40/lk.png",
  dialCode: "+94",
  region: "Asia | The Pacific",
  operators: ["Dialog", "Hutch", "Mobitel"]
}, {
  code: "TH",
  name: "Thailand",
  flag: "https://flagcdn.com/w40/th.png",
  dialCode: "+66",
  region: "Asia | The Pacific",
  operators: ["AIS", "True", "dtac"]
}, {
  code: "VN",
  name: "Vietnam",
  flag: "https://flagcdn.com/w40/vn.png",
  dialCode: "+84",
  region: "Asia | The Pacific",
  operators: ["MobiFone", "Viettel", "Vinaphone"]
},
// Central | North America
{
  code: "CA",
  name: "Canada",
  flag: "https://flagcdn.com/w40/ca.png",
  dialCode: "+1",
  region: "Central | North America",
  operators: ["Bell", "Rogers", "Telus"]
}, {
  code: "CR",
  name: "Costa Rica",
  flag: "https://flagcdn.com/w40/cr.png",
  dialCode: "+506",
  region: "Central | North America",
  operators: ["ICE", "Movistar"]
}, {
  code: "SV",
  name: "El Salvador",
  flag: "https://flagcdn.com/w40/sv.png",
  dialCode: "+503",
  region: "Central | North America",
  operators: ["Claro", "Digicel", "Movistar"]
}, {
  code: "GT",
  name: "Guatemala",
  flag: "https://flagcdn.com/w40/gt.png",
  dialCode: "+502",
  region: "Central | North America",
  operators: ["Claro", "Movistar", "Tigo"]
}, {
  code: "HN",
  name: "Honduras",
  flag: "https://flagcdn.com/w40/hn.png",
  dialCode: "+504",
  region: "Central | North America",
  operators: ["Claro", "Tigo"]
}, {
  code: "MX",
  name: "Mexico",
  flag: "https://flagcdn.com/w40/mx.png",
  dialCode: "+52",
  region: "Central | North America",
  operators: ["AT&T", "Movistar", "Telcel"]
}, {
  code: "NI",
  name: "Nicaragua",
  flag: "https://flagcdn.com/w40/ni.png",
  dialCode: "+505",
  region: "Central | North America",
  operators: ["Claro", "Movistar"]
}, {
  code: "PA",
  name: "Panama",
  flag: "https://flagcdn.com/w40/pa.png",
  dialCode: "+507",
  region: "Central | North America",
  operators: ["Claro", "Digicel", "Movistar"]
}, {
  code: "US",
  name: "United States",
  flag: "https://flagcdn.com/w40/us.png",
  dialCode: "+1",
  region: "Central | North America",
  operators: ["AT&T", "Airvoice", "Black Wireless Monthly Unlimited", "Go Smart", "H2O Wireless", "Life Wireless Unlimited", "T-Mobile", "Verizon", "Cricket", "Boost Mobile", "Metro by T-Mobile", "Straight Talk", "TracFone", "Mint Mobile", "US Mobile"]
},
// Europe
{
  code: "AI",
  name: "Anguilla",
  flag: "https://flagcdn.com/w40/ai.png",
  dialCode: "+1264",
  region: "The Caribbean",
  operators: ["Digicel", "FLOW"]
}, {
  code: "AL",
  name: "Albania",
  flag: "https://flagcdn.com/w40/al.png",
  dialCode: "+355",
  region: "Europe",
  operators: ["Eagle Mobile", "Vodafone"]
}, {
  code: "AT",
  name: "Austria",
  flag: "https://flagcdn.com/w40/at.png",
  dialCode: "+43",
  region: "Europe",
  operators: ["3", "A1", "T-Mobile"]
}, {
  code: "BE",
  name: "Belgium",
  flag: "https://flagcdn.com/w40/be.png",
  dialCode: "+32",
  region: "Europe",
  operators: ["Base", "Orange", "Proximus"]
}, {
  code: "BG",
  name: "Bulgaria",
  flag: "https://flagcdn.com/w40/bg.png",
  dialCode: "+359",
  region: "Europe",
  operators: ["A1", "Telenor", "Vivacom"]
}, {
  code: "HR",
  name: "Croatia",
  flag: "https://flagcdn.com/w40/hr.png",
  dialCode: "+385",
  region: "Europe",
  operators: ["A1", "HT", "Telemach"]
}, {
  code: "CZ",
  name: "Czech Republic",
  flag: "https://flagcdn.com/w40/cz.png",
  dialCode: "+420",
  region: "Europe",
  operators: ["O2", "T-Mobile", "Vodafone"]
}, {
  code: "DK",
  name: "Denmark",
  flag: "https://flagcdn.com/w40/dk.png",
  dialCode: "+45",
  region: "Europe",
  operators: ["3", "TDC", "Telenor"]
}, {
  code: "EE",
  name: "Estonia",
  flag: "https://flagcdn.com/w40/ee.png",
  dialCode: "+372",
  region: "Europe",
  operators: ["Elisa", "Tele2", "Telia"]
}, {
  code: "FI",
  name: "Finland",
  flag: "https://flagcdn.com/w40/fi.png",
  dialCode: "+358",
  region: "Europe",
  operators: ["DNA", "Elisa", "Telia"]
}, {
  code: "FR",
  name: "France",
  flag: "https://flagcdn.com/w40/fr.png",
  dialCode: "+33",
  region: "Europe",
  operators: ["Bouygues", "Free", "Orange", "SFR"]
}, {
  code: "DE",
  name: "Germany",
  flag: "https://flagcdn.com/w40/de.png",
  dialCode: "+49",
  region: "Europe",
  operators: ["O2", "T-Mobile", "Vodafone"]
}, {
  code: "GR",
  name: "Greece",
  flag: "https://flagcdn.com/w40/gr.png",
  dialCode: "+30",
  region: "Europe",
  operators: ["Cosmote", "Nova", "Vodafone"]
}, {
  code: "HU",
  name: "Hungary",
  flag: "https://flagcdn.com/w40/hu.png",
  dialCode: "+36",
  region: "Europe",
  operators: ["Magyar Telekom", "Telenor", "Vodafone"]
}, {
  code: "IE",
  name: "Ireland",
  flag: "https://flagcdn.com/w40/ie.png",
  dialCode: "+353",
  region: "Europe",
  operators: ["3", "Eir", "Vodafone"]
}, {
  code: "IT",
  name: "Italy",
  flag: "https://flagcdn.com/w40/it.png",
  dialCode: "+39",
  region: "Europe",
  operators: ["3", "TIM", "Vodafone", "WindTre"]
}, {
  code: "LV",
  name: "Latvia",
  flag: "https://flagcdn.com/w40/lv.png",
  dialCode: "+371",
  region: "Europe",
  operators: ["Bite", "LMT", "Tele2"]
}, {
  code: "LT",
  name: "Lithuania",
  flag: "https://flagcdn.com/w40/lt.png",
  dialCode: "+370",
  region: "Europe",
  operators: ["Bite", "Tele2", "Telia"]
}, {
  code: "NL",
  name: "Netherlands",
  flag: "https://flagcdn.com/w40/nl.png",
  dialCode: "+31",
  region: "Europe",
  operators: ["KPN", "T-Mobile", "VodafoneZiggo"]
}, {
  code: "NO",
  name: "Norway",
  flag: "https://flagcdn.com/w40/no.png",
  dialCode: "+47",
  region: "Europe",
  operators: ["Ice", "Telenor", "Telia"]
}, {
  code: "PL",
  name: "Poland",
  flag: "https://flagcdn.com/w40/pl.png",
  dialCode: "+48",
  region: "Europe",
  operators: ["Orange", "Play", "Plus", "T-Mobile"]
}, {
  code: "PT",
  name: "Portugal",
  flag: "https://flagcdn.com/w40/pt.png",
  dialCode: "+351",
  region: "Europe",
  operators: ["MEO", "NOS", "Vodafone"]
}, {
  code: "RO",
  name: "Romania",
  flag: "https://flagcdn.com/w40/ro.png",
  dialCode: "+40",
  region: "Europe",
  operators: ["Digi", "Orange", "Telekom", "Vodafone"]
}, {
  code: "RU",
  name: "Russia",
  flag: "https://flagcdn.com/w40/ru.png",
  dialCode: "+7",
  region: "Europe",
  operators: ["Beeline", "MegaFon", "MTS", "Tele2"]
}, {
  code: "SK",
  name: "Slovakia",
  flag: "https://flagcdn.com/w40/sk.png",
  dialCode: "+421",
  region: "Europe",
  operators: ["O2", "Orange", "Telekom"]
}, {
  code: "SI",
  name: "Slovenia",
  flag: "https://flagcdn.com/w40/si.png",
  dialCode: "+386",
  region: "Europe",
  operators: ["A1", "Telekom", "Telemach"]
}, {
  code: "ES",
  name: "Spain",
  flag: "https://flagcdn.com/w40/es.png",
  dialCode: "+34",
  region: "Europe",
  operators: ["Movistar", "Orange", "Vodafone", "Yoigo"]
}, {
  code: "SE",
  name: "Sweden",
  flag: "https://flagcdn.com/w40/se.png",
  dialCode: "+46",
  region: "Europe",
  operators: ["3", "Tele2", "Telenor", "Telia"]
}, {
  code: "CH",
  name: "Switzerland",
  flag: "https://flagcdn.com/w40/ch.png",
  dialCode: "+41",
  region: "Europe",
  operators: ["Salt", "Sunrise", "Swisscom"]
}, {
  code: "TR",
  name: "Turkey",
  flag: "https://flagcdn.com/w40/tr.png",
  dialCode: "+90",
  region: "Europe",
  operators: ["Turkcell", "Türk Telekom", "Vodafone"]
}, {
  code: "UA",
  name: "Ukraine",
  flag: "https://flagcdn.com/w40/ua.png",
  dialCode: "+380",
  region: "Europe",
  operators: ["Kyivstar", "Lifecell", "Vodafone"]
}, {
  code: "GB",
  name: "United Kingdom",
  flag: "https://flagcdn.com/w40/gb.png",
  dialCode: "+44",
  region: "Europe",
  operators: ["3", "giffgaff", "Lebara", "Lyca", "Now Mobile", "O2", "Vodafone"]
},
// South America
{
  code: "AR",
  name: "Argentina",
  flag: "https://flagcdn.com/w40/ar.png",
  dialCode: "+54",
  region: "South America",
  operators: ["Claro", "Movistar", "Personal"]
}, {
  code: "BO",
  name: "Bolivia",
  flag: "https://flagcdn.com/w40/bo.png",
  dialCode: "+591",
  region: "South America",
  operators: ["Entel", "Tigo", "Viva"]
}, {
  code: "BR",
  name: "Brazil",
  flag: "https://flagcdn.com/w40/br.png",
  dialCode: "+55",
  region: "South America",
  operators: ["Claro", "TIM", "Vivo"]
}, {
  code: "CL",
  name: "Chile",
  flag: "https://flagcdn.com/w40/cl.png",
  dialCode: "+56",
  region: "South America",
  operators: ["Claro", "Entel", "Movistar", "WOM"]
}, {
  code: "CO",
  name: "Colombia",
  flag: "https://flagcdn.com/w40/co.png",
  dialCode: "+57",
  region: "South America",
  operators: ["Claro", "Movistar", "Tigo"]
}, {
  code: "EC",
  name: "Ecuador",
  flag: "https://flagcdn.com/w40/ec.png",
  dialCode: "+593",
  region: "South America",
  operators: ["Claro", "CNT", "Movistar"]
}, {
  code: "PY",
  name: "Paraguay",
  flag: "https://flagcdn.com/w40/py.png",
  dialCode: "+595",
  region: "South America",
  operators: ["Claro", "Personal", "Tigo"]
}, {
  code: "PE",
  name: "Peru",
  flag: "https://flagcdn.com/w40/pe.png",
  dialCode: "+51",
  region: "South America",
  operators: ["Bitel", "Claro", "Entel", "Movistar"]
}, {
  code: "UY",
  name: "Uruguay",
  flag: "https://flagcdn.com/w40/uy.png",
  dialCode: "+598",
  region: "South America",
  operators: ["Antel", "Claro", "Movistar"]
}, {
  code: "VE",
  name: "Venezuela",
  flag: "https://flagcdn.com/w40/ve.png",
  dialCode: "+58",
  region: "South America",
  operators: ["Digitel", "Movistar", "Movilnet"]
}];

// Import operator icons using Vite's glob import
const operatorIcons = import.meta.glob('/src/assets/icons/folder/*.{svg,png,jpg,webp}', { 
  eager: true, 
  as: 'url' 
});

// Get appropriate logo for operator
const getOperatorLogo = (operatorName: string) => {
  const name = operatorName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  // Use custom processed AT&T logo if available
  if (name === 'att') {
    return attCustomLogoUrl || attLogo;
  }
  
  // Map operators to their icon filenames
  const iconFileMap: { [key: string]: string } = {
    'vodafone': 'Vodafone.svg',
    'orange': 'Orange.svg',
    'mtn': 'MTN.svg',
    'att': 'AT_T.svg',
    'at&t': 'AT_T.svg',
    'tmobile': 'T-Mobile.svg',
    't-mobile': 'T-Mobile.svg',
    'verizon': 'Verizon.svg',
    'claro': 'Claro.svg',
    'movistar': 'Movistar.svg',
    'jio': 'Jio.svg',
    'airtel': 'Airtel.svg',
    'vi': 'Vi.svg',
    'grameenphone': 'Grameenphone.svg',
    'banglalink': 'Banglalink.png',
    'robi': 'Robi.svg',
    '3hk': '3HK.png',
    '3': '3.svg',
    'csl': 'CSL.svg',
    'smartone': 'SmarTone.svg',
    'chinalife': 'China_Mobile.png',
    'chinamobile': 'China_Mobile.png',
    'chinaunicom': 'China_Unicom.svg',
    'chinatelecom': 'China_Telecom.svg',
    'docomo': 'Docomo.svg',
    'softbank': 'SoftBank.svg',
    'au': 'au.svg',
    'bell': 'Bell.png',
    'rogers': 'Rogers.svg',
    'telus': 'Telus.svg',
    'freedommobile': 'Freedom.svg',
    'koodo': 'Koodo.svg',
    'fido': 'Fido.svg',
    'chatr': 'Chatr.svg',
    'publicmobile': 'PublicMobile.svg',
    'cricket': 'Cricket.png',
    'boostmobile': 'Boost_Mobile.svg',
    'metrobytmobile': 'Metro_by_T-Mobile.svg',
    'straighttalk': 'Straight_Talk.svg',
    'tracfone': 'TracFone.svg',
    'mintmobile': 'Mint_Mobile.svg',
    'usmobile': 'US_Mobile.svg',
    'visible': 'Visible.svg',
    'airvoice': 'Airvoice.png',
    'blackwirelessmonthlyunlimited': 'Black_Wireless_Monthly_Unlimited.svg',
    'h2owireless': 'H2O_Wireless.png',
    'gosmart': 'Go_Smart.png',
    'nowmobile': 'Now_Mobile.svg',
    'ee': 'EE.svg',
    'three': '3.svg',
    'giffgaff': 'giffgaff.svg',
    'lebara': 'Lebara.png',
    'lyca': 'Lyca.svg',
    'tim': 'TIM.svg',
    'windtre': 'WindTre.svg',
    'vivo': 'Vivo.svg',
    'cosmote': 'Cosmote.svg',
    'nova': 'Nova.svg',
    'bouygues': 'Bouygues.svg',
    'free': 'Free.svg',
    'sfr': 'SFR.svg',
    'telekom': 'Telekom.svg',
    'o2': 'O2.svg',
    'magyartelekom': 'Magyar_Telekom.svg',
    'telenor': 'Telenor.svg',
    'telia': 'Telia.svg',
    'tele2': 'Tele2.svg',
    'kpn': 'KPN.svg',
    'vodafoneziggo': 'VodaFone Ziggo.webp',
    'nos': 'NOS.svg',
    'meo': 'MEO.svg',
    'yoigo': 'Yoigo.svg',
    'salt': 'Salt.svg',
    'sunrise': 'Sunrise.svg',
    'swisscom': 'Swisscom.svg',
    'proximus': 'Proximus.svg',
    'base': 'Base.svg',
    'vivacom': 'Vivacom.svg',
    'a1': 'A1.svg',
    'ht': 'HT.svg',
    'telemach': 'Telemach.svg',
    'tdc': 'TDC.svg',
    'ice': 'ICE.png',
    'elisa': 'Elisa.svg',
    'dna': 'DNA.svg',
    'bite': 'Bite.svg',
    'lmt': 'LMT.svg',
    'play': 'Play.svg',
    'plus': 'Plus.svg',
    'mts': 'MTS.svg',
    'beeline': 'Beeline.png',
    'megafon': 'MegaFon.svg',
    'lifecell': 'Lifecell.svg',
    'kyivstar': 'Kyivstar.svg',
    'sktelecom': 'SK_Telecom.svg',
    'kt': 'KT.svg',
    'lgu': 'LG_U_.svg',
    'lgu+': 'LG_U_.svg',
    'ais': 'AIS.svg',
    'true': 'True.svg',
    'dtac': 'Dtac.png',
    'mobifone': 'MobiFone.svg',
    'viettel': 'Viettel.svg',
    'vinaphone': 'Vinaphone.svg',
    'personal': 'Personal.svg',
    'tigo': 'Tigo.svg',
    'viva': 'Viva.svg',
    'entel': 'Entel.svg',
    'wom': 'WOM.svg',
    'bitel': 'Bitel.webp',
    'cnt': 'CNT.svg',
    'antel': 'Antel.svg',
    'digitel': 'Digitel.png',
    'movilnet': 'Movilnet.png',
    'dialog': 'Dialog.svg',
    'hutch': 'Hutch.svg',
    'mobitel': 'Mobitel.png',
    'digicel': 'Digicel.png',
    'flow': 'FLOW.svg',
    'awcc': 'AWCC.png',
    'roshan': 'Roshan.svg',
    'bluesky': 'BlueSky.svg',
    'unitelangola': 'Unitel_Angola.svg',
    'movicelangola': 'Movicel_Angola.png',
    'africellangola': 'Africell_Angola.png',
    'we': 'WE.svg',
    'ethiotelecom': 'Ethio_Telecom.jpg',
    'airteltigo': 'AirtelTigo.svg',
    'cellc': 'Cell_C.svg',
    'vodacom': 'Vodacom.svg',
    'telstra': 'Telstra.svg',
    'optus': 'Optus.svg',
    'singtel': 'Singtel.svg',
    'starhub': 'starhub.webp',
    'm1': 'M1.svg',
    'celcom': 'Celcom.svg',
    'digi': 'Digi.svg',
    'maxis': 'Maxis.svg',
    'telkomsel': 'Telkomsel.svg',
    'indosat': 'Indosat.svg',
    'xl': 'XL.svg',
    'globe': 'Globe.svg',
    'smart': 'Go_Smart.png',
    'sun': 'Sun.jpg',
    'jazz': 'Jazz.svg',
    'ufone': 'Ufone.png',
    'zong': 'Zong.png',
    'spark': 'Spark .png',
    '2degrees': '2degrees.svg',
    'safaricom': 'Safaricom.svg',
    'etisalat': 'Etisalat.svg',
    'du': 'du.svg',
    'iam': 'IAM.svg',
    'inwi': 'inwi.svg',
    'djezzy': 'Djezzy.svg',
    'mobilis': 'Mobilis.svg',
    'ooredoo': 'Ooredoo.svg',
    'halotel': 'Halotel.png',
    'eir': 'Eir.svg',
    'eaglemobile': 'Eagle_Mobile.svg'
  };
  
  // Get the filename for this operator
  const filename = iconFileMap[name];
  if (!filename) return null;
  
  // Find the icon in the imported modules
  const iconPath = `/src/assets/icons/folder/${filename}`;
  return operatorIcons[iconPath] || null;
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

// Base amounts in USD for conversion
const baseTopUpAmounts = [
  { value: 5, label: "5 USD" },
  { value: 10, label: "10 USD" },
  { value: 25, label: "25 USD" },
  { value: 50, label: "50 USD" },
  { value: 100, label: "100 USD" },
  { value: 200, label: "200 USD" }
];

// Fixed amounts for specific currencies
const fixedCurrencyAmounts: Record<string, Array<{ value: number; label: string }>> = {
  'EUR': [
    { value: 5, label: '€5.00' },
    { value: 10, label: '€10.00' },
    { value: 25, label: '€25.00' },
    { value: 50, label: '€50.00' },
    { value: 100, label: '€100.00' },
    { value: 200, label: '€200.00' },
  ],
  'GBP': [
    { value: 5, label: '£5.00' },
    { value: 10, label: '£10.00' },
    { value: 25, label: '£25.00' },
    { value: 50, label: '£50.00' },
    { value: 100, label: '£100.00' },
    { value: 200, label: '£200.00' },
  ],
};

const DingTopup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, login } = useAuth();
  const { geoLocation, isLoading: isGeoLoading } = useGeoCurrency();
  const { convertAmount, formatCurrency } = useCurrencyConverter();
  
  // Get amounts based on user's currency
  const getTopUpAmounts = () => {
    if (!geoLocation) return baseTopUpAmounts;
    
    // Use fixed amounts for EUR and GBP
    if (fixedCurrencyAmounts[geoLocation.currency]) {
      return fixedCurrencyAmounts[geoLocation.currency];
    }

    // Use USD code-based labels instead of $ for USD
    if (geoLocation.currency === 'USD') {
      return baseTopUpAmounts;
    }
    
    // Convert USD amounts for other currencies
    return baseTopUpAmounts.map(amount => {
      const convertedValue = convertAmount(amount.value, 'USD', geoLocation.currency);
      const formattedLabel = formatCurrency(convertedValue, geoLocation.currency, geoLocation.currencySymbol);
      
      return {
        value: convertedValue,
        originalUsdValue: amount.value,
        label: formattedLabel,
        currency: geoLocation.currency,
        symbol: geoLocation.currencySymbol
      };
    });
  };
  
  const topUpAmounts = getTopUpAmounts();
  
  console.log('DingTopup component loaded, isAuthenticated:', isAuthenticated);
  
  // Check if we should start at a specific step with initial data
  const initialStep = location.state?.startStep || 1;
  const initialCountry = location.state?.country || null;
  const initialPhoneNumber = location.state?.phoneNumber || '';
  const returnData = location.state?.returnData;
  
  const [phoneNumber, setPhoneNumber] = useState(returnData?.phoneNumber || initialPhoneNumber);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(returnData?.selectedCountry || initialCountry);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processedSpinnerUrl, setProcessedSpinnerUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'number-entry' | 'provider-selection' | 'amount-selection' | 'authorization' | 'payment' | 'processing' | 'success'>(
    returnData?.step || (initialStep === 2 ? 'provider-selection' : 'number-entry')
  );
  
  console.log('Current step:', currentStep);
  const [providerSearchQuery, setProviderSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<{ id: string; name: string; logo: string | null; hasCustomLogo: boolean; type: string } | null>(returnData?.selectedProvider || null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(returnData?.selectedAmount || null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustomAmountMode, setIsCustomAmountMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
const [saveCard, setSaveCard] = useState(false);
const [attLogoVersion, setAttLogoVersion] = useState(0);
const [formData, setFormData] = useState({
    idNumber: "",
    expiry: "",
    pls: "",
    nameOnCard: "",
    country: "us",
    zipCode: ""
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Process AT&T logo to remove background once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const img = await loadImageFromUrl(attLogo);
        let blob: Blob;
        try {
          blob = await removeSolidBackground(img, { sampleBorder: 6, threshold: 55 });
        } catch {
          blob = await removeBackground(img);
        }
        const url = URL.createObjectURL(blob);
        attCustomLogoUrl = url;
        if (isMounted) setAttLogoVersion(v => v + 1);
      } catch (error) {
        console.error('Failed to process AT&T logo:', error);
        attCustomLogoUrl = attLogo; // fallback
      }
    })();
    return () => { isMounted = false; };
  }, []);
  
  // Authorization state
  const [isEmailMode, setIsEmailMode] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [selectedAuthCountry, setSelectedAuthCountry] = useState<Country | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthInputFocused, setIsAuthInputFocused] = useState(false);
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  // Process spinner image to remove background on component mount
  useEffect(() => {
    const processSpinnerImage = async () => {
      try {
        const image = await loadImageFromUrl('/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png');
        const processedBlob = await removeBackground(image);
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedSpinnerUrl(processedUrl);
      } catch (error) {
        console.error('Error processing spinner image:', error);
        // Fallback to original image
        setProcessedSpinnerUrl('/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png');
      }
    };

    processSpinnerImage();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside for edit dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.edit-dropdown')) {
        setIsEditDropdownOpen(false);
      }
    };

    if (isEditDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditDropdownOpen]);

  // Filter countries based on phone number input or show all countries
  const filteredCountries = phoneNumber.startsWith('+') 
    ? countries.filter(country => phoneNumber.startsWith(country.dialCode))
    : phoneNumber.length > 0 && /[a-zA-Z]/.test(phoneNumber)
    ? countries.filter(country => 
        country.name.toLowerCase().startsWith(phoneNumber.toLowerCase()) ||
        country.name.toLowerCase().includes(phoneNumber.toLowerCase())
      ).sort((a, b) => {
        // Prioritize countries that start with the typed letters
        const aStartsWith = a.name.toLowerCase().startsWith(phoneNumber.toLowerCase());
        const bStartsWith = b.name.toLowerCase().startsWith(phoneNumber.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.name.localeCompare(b.name);
      })
    : countries;
  
  // Filter auth countries based on phone input or show all countries
  const filteredAuthCountries = formPhone.startsWith('+') 
    ? countries.filter(country => formPhone.startsWith(country.dialCode))
    : formPhone.length > 0 && /[a-zA-Z]/.test(formPhone)
    ? countries.filter(country => 
        country.name.toLowerCase().startsWith(formPhone.toLowerCase()) ||
        country.name.toLowerCase().includes(formPhone.toLowerCase())
      ).sort((a, b) => {
        // Prioritize countries that start with the typed letters
        const aStartsWith = a.name.toLowerCase().startsWith(formPhone.toLowerCase());
        const bStartsWith = b.name.toLowerCase().startsWith(formPhone.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      })
    : countries;

  const handleFormPhoneNumberChange = (value: string) => {
    setFormPhone(value);

    // When cleared: reset country and open dropdown to prompt selection
    if (value.length === 0) {
      if (selectedAuthCountry) setIsAuthOpen(true);
      setSelectedAuthCountry(null);
      return;
    }

    // Auto-detect country based on dial code
    if (value.startsWith('+')) {
      const matchingCountry = countries.find((country) =>
        value.startsWith(country.dialCode) &&
        (value.length === country.dialCode.length || value[country.dialCode.length] === ' ')
      );
      if (matchingCountry && selectedAuthCountry?.code !== matchingCountry.code) {
        setSelectedAuthCountry(matchingCountry);
      }
      // If user types a dial code and no country chosen yet, show dropdown
      if (!selectedAuthCountry) setIsAuthOpen(true);
      return;
    }

    // If user types letters (country name), open the dropdown
    if (/[a-zA-Z]/.test(value) && !selectedAuthCountry) {
      setIsAuthOpen(true);
    }
  };

  const handleAuthCountrySelect = (country: Country) => {
    setSelectedAuthCountry(country);
    setIsAuthOpen(false);
    // Add the dial code to the input field without space
    setFormPhone(country.dialCode);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    
    // Handle empty input
    if (value.length === 0) {
      if (selectedCountry) {
        // If user deletes all text after selecting a country, show dropdown
        setIsOpen(true);
      }
      setSelectedCountry(null);
      return;
    }
    
    // Only show dropdown logic if no country is selected yet
    if (!selectedCountry) {
      // Show matching countries when user enters a dial code, but don't auto-select
      if (value.startsWith('+')) {
        const matchingCountries = countries.filter(country => 
          value.startsWith(country.dialCode)
        );
        if (matchingCountries.length > 0) {
          setIsOpen(true); // Show dropdown with matching countries
        }
      } else if (value.length > 0 && /[a-zA-Z]/.test(value)) {
        // Show dropdown when user types letters (country names)
        setIsOpen(true);
      }
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    // Add the dial code to the input field without space
    setPhoneNumber(country.dialCode);
  };

  const handleStartTopup = () => {
    let finalPhoneNumber = phoneNumber.trim();
    
    // If country is selected and number doesn't start with +, prepend the dial code
    if (selectedCountry && !finalPhoneNumber.startsWith('+')) {
      finalPhoneNumber = selectedCountry.dialCode + finalPhoneNumber;
    }
    
    if (!selectedCountry || !finalPhoneNumber.replace(/\D/g, '').length) {
      return;
    }
    
    // Show loading animation
    setIsLoading(true);
    
    // Show loading for 2-5 seconds (random between 2000-5000ms)
    const loadingDuration = Math.floor(Math.random() * 3000) + 2000;
    
    setTimeout(() => {
      setIsLoading(false);
      // Instead of navigating, move to provider selection step
      setCurrentStep('provider-selection');
    }, loadingDuration);
  };

  const handleProviderSelect = async (provider: { id: string; name: string; logo: string | null; hasCustomLogo: boolean; type: string }) => {
    setSelectedProvider(provider);
    setIsLoading(true);
    
    // Show loading animation for 2-5 seconds
    const loadingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    setIsLoading(false);
    
    // Move to amount selection step
    setCurrentStep('amount-selection');
  };

  // Custom amount functions
  const getMinimumAmount = () => {
    if (!geoLocation || geoLocation.currency === 'USD') return 5;
    
    // For fixed currencies (EUR, GBP), minimum is 5 in their currency
    if (fixedCurrencyAmounts[geoLocation.currency]) return 5;
    
    // For other currencies, convert 5 USD to their currency
    return convertAmount(5, 'USD', geoLocation.currency);
  };

  const getCustomAmountDisplay = (inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return "";
    
    if (!geoLocation || geoLocation.currency === 'USD') {
      return `${numValue.toFixed(2)} USD`;
    }
    
    return formatCurrency(numValue, geoLocation.currency, geoLocation.currencySymbol);
  };

  const getUSDEquivalent = (amount: number) => {
    if (!geoLocation || geoLocation.currency === 'USD') return amount;
    
    // For fixed currencies, convert to USD
    if (fixedCurrencyAmounts[geoLocation.currency]) {
      return convertAmount(amount, geoLocation.currency, 'USD');
    }
    
    // For converted currencies, find original USD value or convert back
    return convertAmount(amount, geoLocation.currency, 'USD');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= getMinimumAmount()) {
      setSelectedAmount(numValue);
    } else {
      setSelectedAmount(null);
    }
  };

  const getDisplayTotal = () => {
    if (!selectedAmount) return 'Select amount';
    
    const fees = selectedAmount * 0.01;
    const total = selectedAmount + fees;
    
    if (isCustomAmountMode && customAmount) {
      if (!geoLocation || geoLocation.currency === 'USD') {
        return `${parseFloat(total.toString()).toFixed(2)} USD`;
      }
      return getCustomAmountDisplay(total.toString());
    }
    
    const foundAmount = topUpAmounts.find(amount => amount.value === selectedAmount);
    if (foundAmount) {
      if (!geoLocation || geoLocation.currency === 'USD') {
        return `${total.toFixed(2)} USD`;
      }
      const symbol = foundAmount.label.match(/^[^0-9]*/)?.[0] || (geoLocation?.currencySymbol || '$');
      return `${symbol}${total.toFixed(2)}`;
    }
    
    if (!geoLocation || geoLocation.currency === 'USD') {
      return `${total.toFixed(2)} USD`;
    }
    return `${geoLocation?.currencySymbol || '$'}${total.toFixed(2)}`;
  };

  const handleAmountSelect = async (amount: number) => {
    console.log('=== AMOUNT SELECT DEBUGGING ===');
    console.log('Amount selected:', amount);
    console.log('isAuthenticated value:', isAuthenticated);
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('=== END DEBUGGING ===');
    
    setSelectedAmount(amount);
    setIsCustomAmountMode(false); // Reset custom mode when selecting predefined amount
    
    // Check if user is authenticated before proceeding to payment
    if (!isAuthenticated) {
      console.log('User not authenticated, showing authorization step');
      setCurrentStep('authorization');
      return;
    }
    
    console.log('User is authenticated, proceeding to payment');
    
    setIsLoading(true);
    
    // Show loading animation for 2-5 seconds
    const loadingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    setIsLoading(false);
    
    // Move to payment step
    setCurrentStep('payment');
  };

  const handlePayment = () => {
    console.log('[DingTopup] handlePayment start', { hasCountry: !!selectedCountry, hasProvider: !!selectedProvider, phoneNumber, selectedAmount });
    // Validate required fields
    if (!formData.idNumber || !formData.expiry || !formData.pls || !formData.nameOnCard || !formData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Ensure order context is complete
    if (!selectedCountry || !selectedProvider || !phoneNumber) {
      console.error('[DingTopup] Missing order context', { selectedCountry, selectedProvider, phoneNumber });
      toast.error("Missing phone, country or provider. Please complete previous steps.");
      return;
    }

    // Calculate fees and total (always in the user's currency)
    const fees = (selectedAmount * 0.01).toFixed(2); // 1% fee
    const total = (selectedAmount + parseFloat(fees)).toFixed(2);
    console.log('[DingTopup] computed totals', { fees, total });
    
    // Get USD equivalent for backend processing
    const selectedAmountItem = topUpAmounts.find(a => a.value === selectedAmount);
    const usdAmount = geoLocation && !fixedCurrencyAmounts[geoLocation.currency] 
      ? (selectedAmountItem && 'originalUsdValue' in selectedAmountItem ? selectedAmountItem.originalUsdValue : selectedAmount)
      : convertAmount(selectedAmount, geoLocation?.currency || 'USD', 'USD');
    

    // Create order record
    const orderRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      phone: `${selectedCountry.dialCode} ${phoneNumber}`,
      provider: selectedProvider.name,
      amount: selectedAmount,
      currency: geoLocation?.currency || 'USD',
      currencySymbol: geoLocation?.currencySymbol || '$',
      usdEquivalent: usdAmount,
      fees: fees,
      total: total,
      ...formData
    };

    setOrderId(orderRecord.id);

    // Store via centralized store
    try {
      addOrder(orderRecord);
      console.log('[Order] Saved via DingTopup (store):', orderRecord.id);
      toast.success("Payment submitted successfully!");
    } catch (e) {
      console.error('[DingTopup] Failed to save order', e);
      toast.error('Failed to save order. Please try again.');
      return;
    }
    
    // Move to processing step
    setCurrentStep('processing');
    
    // Wait for admin processing instead of auto-completing
    const checkInterval = setInterval(() => {
      const processedOrders = JSON.parse(localStorage.getItem('processedOrders') || '[]');
      if (processedOrders.includes(orderRecord.id)) {
        clearInterval(checkInterval);
        // Get processing type from the order
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = storedOrders.find((o: any) => o.id === orderRecord.id);
        const processingType = order?.processingType || 'otp';

        // Route based on admin choice
        if (processingType === 'bank') {
          navigate("/bank-completion", { state: { orderId: orderRecord.id } });
        } else {
          navigate("/otp-verification", { state: { orderId: orderRecord.id } });
        }
      }
    }, 1000);
  };

  const handleDownloadReceipt = () => {
    // Get order details 
    const fees = (selectedAmount * 0.01).toFixed(2); // 1% fee
    const total = (selectedAmount + parseFloat(fees)).toFixed(2);
    
    const receiptData = {
      orderId: orderId,
      timestamp: new Date().toISOString(),
      phone: `${selectedCountry.dialCode} ${phoneNumber}`,
      provider: selectedProvider.name,
      amount: `$${selectedAmount}.00`,
      fees: `$${fees}`,
      total: `$${total}`,
      status: "Completed"
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `receipt_${orderId}.json`);
    linkElement.click();
  };

  const handleBackToNumberEntry = () => {
    setCurrentStep('number-entry');
    setProviderSearchQuery("");
  };

  const handleBackToProviderSelection = () => {
    setCurrentStep('provider-selection');
  };

  const handleBackToAmountSelection = () => {
    setCurrentStep('amount-selection');
  };
  
  // Authorization handlers
  const handleAuthSubmit = async () => {
    setIsAuthLoading(true);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful login
    const userData = isEmailMode 
      ? { email: formEmail }
      : { phone: formPhone, country: selectedAuthCountry?.name };
    
    login(userData);
    setIsAuthLoading(false);
    
    // Proceed to payment step
    setCurrentStep('payment');
    toast.success("Successfully signed in!");
  };
  
  const handleBackToAuthorization = () => {
    setCurrentStep('authorization');
  };

  // Get operators for the selected country
  const currentOperators = selectedCountry ? getOperatorsForCountry(selectedCountry.code) : [];
  
  const filteredOperators = currentOperators.filter(operator =>
    operator.name.toLowerCase().includes(providerSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[160vh] relative" style={{ backgroundColor: '#ccfff6' }}>
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

      <DingHeader variant="topup" />

      {/* Background decoration */}
      <div className="absolute left-0 top-[186px] transform -translate-x-[208px] rotate-[30deg]">
        <img 
          src="/lovable-uploads/66f38f52-55c1-4874-80be-8db2bb263358.png" 
          alt="Decorative asterisk" 
          className="w-[840px] h-[840px] object-contain"
        />
      </div>

      {/* Main content */}
      <div className="flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32">
         <div className="w-full max-w-lg mx-auto">
           <Card className="bg-white px-6 sm:px-8 lg:px-12 py-8 rounded-3xl shadow-none border-0 relative z-10 w-full" style={{ transform: window.innerWidth < 768 ? 'translateX(-10px)' : 'none' }}>
            
            {currentStep === 'number-entry' ? (
              <>
                  <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#004a59]">
              Ready to send a top-up?
            </h2>
                  </div>
                
                <div className="space-y-6">
                  <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                      {/* Icon with dynamic display based on state */}
                      {selectedCountry && phoneNumber ? (
                        <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 z-10 object-cover rounded-full" />
                      ) : isOpen ? (
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      ) : selectedCountry && !phoneNumber ? (
                        <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10" color="#617b7b" />
                      ) : (
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10" color="#617b7b" />
                      )}

                      {/* Floating Label */}
                      <label 
                        className={`absolute transition-all duration-300 ease-out pointer-events-none z-20 ${
                          selectedCountry 
                            ? 'left-[68px]' // Move right when country is selected (64px + 4px)
                            : 'left-12' // Default position with search icon
                        } ${
                          isOpen || phoneNumber || selectedCountry || isInputFocused
                            ? 'top-1 text-xs bg-white px-1' 
                            : 'top-1/2 -translate-y-1/2 text-base'
                        }`}
                        style={{color: '#617b7b'}}
                      >
                        Enter number
                      </label>
                      
                      <div 
                        className="h-14 flex items-center pl-12 pr-4 border rounded-full bg-white hover:outline hover:outline-[3px] hover:outline-[#befa4c78] transition-all cursor-pointer" 
                        style={{borderColor: '#b9cbd3'}}
                        onClick={() => {
                          console.log('Dropdown clicked, current isOpen:', isOpen);
                          setIsOpen(!isOpen);
                        }}
                      >
                        <div className="flex items-center w-full">
                          {selectedCountry && (
                            <ChevronDown 
                              className={`w-3 h-3 mr-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                              color="#617b7b" 
                            />
                          )}
                          <Input 
                            type="tel" 
                            value={phoneNumber} 
                            onChange={e => handlePhoneNumberChange(e.target.value)}
                            onFocus={() => {
                              setIsInputFocused(true);
                            }}
                            onBlur={() => setIsInputFocused(false)}
                            className="border-0 bg-transparent text-base p-0 focus-visible:ring-0 flex-1 font-sans" 
                            onClick={e => e.stopPropagation()} 
                          />
                        </div>
                      </div>
                     
                     {/* Dropdown */}
                     {isOpen && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 rounded-2xl">
                         <div className="max-h-80 overflow-auto bg-white rounded-2xl">
                           {filteredCountries.map(country => (
                             <div 
                               key={country.code} 
                               onClick={() => handleCountrySelect(country)} 
                               className={cn(
                                 "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors", 
                                 selectedCountry?.code === country.code && "bg-lime-50"
                               )}
                             >
                               <img src={country.flag} alt={`${country.name} flag`} className="w-8 h-8 mr-3 object-cover rounded-full" />
                               <div className="flex-1 flex items-center justify-between">
                                 <div className="font-medium text-foreground">{country.name}</div>
                                 <div className="text-sm text-gray-500 font-mono">{country.dialCode}</div>
                               </div>
                               {selectedCountry?.code === country.code && <Check className="w-5 h-5 text-lime-600" />}
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
                 
                  <div className="flex justify-center">
                     <Button 
                       onClick={handleStartTopup} 
                       disabled={!selectedCountry || !phoneNumber.trim()} 
                       className="w-135 h-14 text-lg font-bold bg-lime-400 hover:bg-lime-400 text-foreground border-0 rounded-full shadow-sm disabled:bg-lime-400 disabled:text-foreground disabled:opacity-100 transition-transform duration-200 hover:scale-95" 
                       size="lg"
                     >
                      Start top-up
                    </Button>
                  </div>
               </div>
              </>
            ) : currentStep === 'provider-selection' ? (
              /* Provider Selection Step */
              <>
                {/* Who would you like to top-up section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#004a59] mb-6">Who would you like to top-up?</h2>
                  
                  <div className="space-y-0 pb-2">
                    {/* Country Selection */}
                      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 relative">
                        <span className="text-[#004a59] text-sm md:text-lg md:transform-none" style={{ transform: window.innerWidth < 768 ? 'translateX(-19px)' : 'none' }}>Country:</span>
                        {selectedCountry && (
                          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                            <img 
                              src={selectedCountry.flag} 
                              alt={selectedCountry.name}
                              className="w-5 h-4 object-cover rounded-full"
                            />
                            <span className="font-medium text-[#004a59] text-lg">
                              {selectedCountry.name} ({selectedCountry.code})
                            </span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToNumberEntry}
                          className="font-medium text-sm h-auto p-1"
                          style={{ color: '#d600c7' }}
                        >
                          Edit <ChevronRight style={{ marginLeft: '-5px', width: '11px', height: '11px' }} />
                        </Button>
                      </div>

                    {/* Phone Number */}
                     <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 relative mb-6" style={{ marginTop: '-2px' }}>
                       <span className="text-[#004a59] text-sm md:text-lg md:transform-none" style={{ transform: window.innerWidth < 768 ? 'translateX(-19px)' : 'none' }}>Number:</span>
                       <span className="font-medium text-[#004a59] text-lg absolute left-1/2 transform -translate-x-1/2">
                         {phoneNumber}
                       </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToNumberEntry}
                          className="font-medium text-sm h-auto p-1"
                          style={{ color: '#d600c7' }}
                        >
                          Edit <ChevronRight style={{ marginLeft: '-5px', width: '11px', height: '11px' }} />
                       </Button>
                     </div>
                      <div className="h-[30px]"></div>
                      <div className="h-px mb-2 ml-[-1.5rem] w-[calc(100%+3rem)] sm:ml-[-2rem] sm:w-[calc(100%+4rem)] lg:ml-[-3rem] lg:w-[calc(100%+6rem)]" style={{ backgroundColor: '#e7eff3' }}></div>
                   </div>
                </div>

                {/* Who provides their service section */}
                <div>
                  <h2 className="text-xl font-semibold text-[#004a59] mb-6">Who provides their service?</h2>
                  
                  {/* Search Input */}
                  <div className="mb-6 relative">
                    {/* Floating Label */}
                    <label 
                      className={`absolute transition-all duration-300 ease-out pointer-events-none z-20 left-6 ${
                        providerSearchQuery || searchFocused
                          ? 'top-1 text-xs bg-white px-1' 
                          : 'top-1/2 -translate-y-1/2 text-base'
                      }`}
                      style={{color: '#617b7b'}}
                    >
                      Search item
                    </label>
                    
                    <Input
                      type="text"
                      value={providerSearchQuery}
                      onChange={(e) => setProviderSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="h-12 bg-white rounded-full text-sm pl-6 hover:outline hover:outline-[3px] hover:outline-[#befa4c78] transition-all focus-visible:ring-0 focus:ring-0 focus:outline-none border-0"
                      style={{boxShadow: searchFocused ? '0 0 0 1px #befa4c' : '0 0 0 1px #b9cbd3'}}
                    />
                  </div>

                   {/* Providers Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {filteredOperators.map((operator) => (
                       <Card
                        key={operator.id}
                        className={`p-3 cursor-pointer hover:shadow-md transition-all duration-200 border border-[#c0d0d7] bg-white rounded-2xl hover:border-[#befa4c] ${
                          selectedProvider?.id === operator.id ? 'border-blue-400 bg-blue-50' : ''
                        }`}
                         onClick={() => {
                           setSelectedProvider(operator);
                           setIsLoading(true);
                           
                           // Show loading for 2-3 seconds before proceeding
                           const loadingDuration = Math.floor(Math.random() * 1000) + 2000;
                           setTimeout(() => {
                             setIsLoading(false);
                             setCurrentStep('amount-selection');
                           }, loadingDuration);
                         }}
                        >
                          <div className="relative h-full min-h-[80px]">
                            <div className="absolute top-0 left-0 w-10 h-8 flex items-center justify-center">
                              {operator.hasCustomLogo && operator.logo ? (
                                <img
                                  src={operator.logo}
                                  alt={operator.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                 <div className="w-8 h-8 bg-gray-100 rounded-2xl flex items-center justify-center">
                                   <Smartphone className="w-4 h-4 text-gray-600" />
                                 </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0">
                              <p className="text-xs font-medium text-slate-800 leading-tight">
                                {operator.name}
                              </p>
                              {operator.type === 'PIN' && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-sm">
                                  PIN
                                </span>
                              )}
                            </div>
                          </div>
                        </Card>
                    ))}
                  </div>

                </div>
              </>
            ) : currentStep === 'amount-selection' ? (
              /* Amount Selection Step */
              <>
                {/* Who would you like to top-up section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#004a59] mb-6">Who would you like to top-up?</h2>
                  
                  <div className="space-y-4 pb-2">
                    {/* Country Selection */}
                      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 relative">
                        <span className="text-[#004a59] text-lg ml-[-30px]">Country:</span>
                        {selectedCountry && (
                          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 ml-5">
                            <img 
                              src={selectedCountry.flag} 
                              alt={selectedCountry.name}
                               className="w-5 h-5 object-cover rounded-full"
                            />
                            <span className="font-medium text-[#004a59] text-lg">
                              {selectedCountry.name} ({selectedCountry.code})
                            </span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToProviderSelection}
                          className="font-medium text-sm h-auto p-1 -mr-5"
                          style={{ color: '#d600c7' }}
                        >
                          Edit <ChevronRight style={{ marginLeft: '-5px', width: '11px', height: '11px' }} />
                        </Button>
                      </div>


                    {/* Provider */}
                     <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 relative mb-6">
                       <span className="text-[#004a59] text-lg ml-[-30px]">Provider:</span>
                       {selectedProvider && (
                          <div className="relative flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 ml-[-410px]" style={{ transform: window.innerWidth < 768 ? 'translate(-50%, 0) translateX(-115px)' : 'translate(-50%, 0)', marginLeft: window.innerWidth < 768 ? '0' : '-410px' }}>
                             {selectedProvider.hasCustomLogo && selectedProvider.logo ? (
                               <img
                                 src={selectedProvider.logo}
                                 alt={selectedProvider.name}
                                 className="w-6 h-6 md:w-5 md:h-5 object-contain"
                               />
                             ) : (
                               <div className="w-6 h-6 md:w-5 md:h-5 bg-gray-100 rounded flex items-center justify-center">
                                 <Smartphone className="w-4 h-4 md:w-3 md:h-3 text-gray-600" />
                               </div>
                             )}
                            <span className="font-medium text-[#004a59] text-lg">
                              {selectedProvider?.name}
                            </span>
                            {selectedProvider?.type === 'PIN' && (
                              <span className="absolute left-[calc(100%+6px)] top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-sm">
                                PIN
                              </span>
                            )}
                          </div>
                       )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToProviderSelection}
                          className="font-medium text-sm h-auto p-1 -mr-5"
                          style={{ color: '#d600c7' }}
                        >
                          Edit <ChevronRight style={{ marginLeft: '-5px', width: '11px', height: '11px' }} />
                        </Button>
                     </div>
                    <div className="h-px mb-2 ml-[-1.5rem] w-[calc(100%+3rem)] sm:ml-[-2rem] sm:w-[calc(100%+4rem)] lg:ml-[-3rem] lg:w-[calc(100%+6rem)]" style={{ backgroundColor: '#e7eff3' }}></div>
                    </div>
                </div>

                {/* Let's select a top-up Section */}
                <div>
                  <h2 className="text-xl font-semibold text-[#004a59] mb-6">Let's select a top-up</h2>
                  
                  <div className="space-y-4 mb-6">
                    {topUpAmounts.map((amount, index) => (
                       <Card 
                        key={amount.value}
                        className={`relative px-6 md:px-60 py-3 md:py-6 cursor-pointer transition-all duration-200 rounded-2xl mr-4 -ml-[35px] ${
                          index === 0 
                            ? 'border-2 border-[#001273] border-b-8 bg-transparent' 
                            : 'border border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        style={{ transform: window.innerWidth < 768 ? 'translateX(28px)' : 'none' }}
                        onClick={() => handleAmountSelect(amount.value)}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex flex-col gap-2 ml-[-20px] md:ml-[-220px] mt-[10px] md:mt-[25px]">
                            {index === 0 && (
                              <span className="bg-[#001273] text-white text-xs md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 w-fit border border-white -translate-y-[15px] md:-translate-y-[30px]">
                                Most people buy <img src={fireIcon} alt="fire" className="w-3 h-3 md:w-4 md:h-4" />
                              </span>
                            )}
                            <span className={`text-lg md:text-2xl font-medium ${index === 0 ? 'text-[#004a59]' : 'text-[#004a59]'}`}>
                              {amount.label}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleAmountSelect(amount.value)}
                            className="bg-[#befa4c] hover:bg-[#a8e843] text-black font-medium rounded-full px-8 py-1 text-sm absolute bottom-2 right-2"
                          >
                            {index === 0 ? `Buy ${amount.label}` : amount.label}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                   
                   {/* Custom Amount Section */}
                   <div className="mt-6 pt-6 border-t border-gray-200">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-md font-medium text-[#004a59]">Custom Amount</h3>
                       <span className="text-xs text-gray-500">
                         Min: {getCustomAmountDisplay(getMinimumAmount().toString())}
                       </span>
                     </div>
                     
                      <div className="relative flex items-center gap-3">
                        <Input
                          type="number"
                          placeholder={`Enter amount (min ${getMinimumAmount()})`}
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          onFocus={() => setIsCustomAmountMode(true)}
                          min={getMinimumAmount()}
                          step="0.01"
                          className="text-center text-sm md:text-lg font-semibold bg-white border-2 border-gray-200 focus:border-lime-500 rounded-xl h-14 flex-1"
                        />
                        
                        <Button
                          onClick={() => customAmount && parseFloat(customAmount) >= getMinimumAmount() && handleAmountSelect(parseFloat(customAmount))}
                          disabled={!customAmount || parseFloat(customAmount) < getMinimumAmount()}
                          className="bg-[#befa4c] hover:bg-[#a8e843] text-black font-medium rounded-full w-14 h-14 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </div>
                        
                        {/* Real-time conversion display */}
                        {customAmount && parseFloat(customAmount) >= getMinimumAmount() && (
                          <div className="mt-2 text-center">
                            <div className="text-sm text-gray-600">
                              {getCustomAmountDisplay(customAmount)}
                              {geoLocation && geoLocation.currency !== 'USD' && (
                                <span className="ml-2 text-xs text-gray-500">
                                  (≈ ${getUSDEquivalent(parseFloat(customAmount)).toFixed(2)} USD)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Validation message */}
                        {customAmount && parseFloat(customAmount) < getMinimumAmount() && (
                          <div className="mt-2 text-center">
                            <span className="text-xs text-red-500">
                              Minimum amount is {getCustomAmountDisplay(getMinimumAmount().toString())}
                            </span>
                          </div>
                        )}
                   </div>
                 </div>
               </>
             ) : currentStep === 'authorization' ? (
              /* Authorization Step */
              <>
                {/* Summary Card */}
                <div className="bg-white rounded-2xl p-8 mb-6">
                  <h2 className="text-lg md:text-2xl font-semibold text-[#004a59] mb-8 whitespace-nowrap -mt-[40px] -ml-[46px]">Who would you like to top-up?</h2>
                  
                  {/* Country Row */}
                  <div className="flex items-center justify-between py-5 -ml-[40px] -mt-[18px]">
                    <div className="flex items-center space-x-4">
                      <span className="text-[#004a59] font-medium text-lg w-24">Country:</span>
                      <div className="flex items-center space-x-3 ml-[60px]">
                        <img 
                          src={selectedCountry?.flag} 
                          alt={selectedCountry?.name}
                          className="w-6 h-6 rounded-2xl border"
                        />
                        <span className="text-[#004a59] font-medium text-lg whitespace-nowrap">
                          {selectedCountry?.name} ({selectedCountry?.code})
                        </span>
                      </div>
                    </div>
                    <button onClick={handleBackToNumberEntry} className="font-medium text-base flex items-center mr-[0px] ml-[130px] translate-x-[-60px] sm:translate-x-[-60px] translate-x-[-105px]" style={{color: '#d627d2'}}>
                      Edit <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  {/* Operator Row */}
                  <div className="flex items-center justify-between py-5 -mt-[20px] -ml-[40px] border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-[#004a59] font-medium text-lg w-24">Operator:</span>
                      <div className="flex items-center space-x-3 ml-[30px]">
                        {selectedProvider?.logo && (
                          <img 
                            src={selectedProvider.logo} 
                            alt={selectedProvider.name}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span className="text-[#004a59] font-medium text-lg">{selectedProvider?.name}</span>
                      </div>
                    </div>
                    <button onClick={handleBackToProviderSelection} className="font-medium text-base flex items-center mr-[30px] translate-x-[60px]" style={{ color: '#d627d2' }}>
                      Edit <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  {/* PIN top-up amount Row */}
                  <div className="flex items-center justify-between py-5">
                    <div className="flex items-center space-x-4 -ml-[35px]">
                      <span className="text-[#004a59] font-bold text-lg" style={{ transform: window.innerWidth >= 768 ? 'translateX(-10px)' : 'none' }}>PIN top-up amount:</span>
                       <span className="text-[#004a59] font-medium text-lg" style={{ transform: window.innerWidth < 768 ? 'translateX(-20px)' : 'none' }}>
                        {topUpAmounts.find(amount => amount.value === selectedAmount)?.label || (geoLocation?.currency === 'USD' ? `${selectedAmount}.00 USD` : `${geoLocation?.currencySymbol || '$'}${selectedAmount}`)}
                      </span>
                    </div>
                    <button onClick={handleBackToAmountSelection} className="font-medium text-base flex items-center translate-x-[30px]" style={{color: '#d627d2'}}>
                      Edit <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  {/* Smaller border line */}
                  <div className="h-px bg-gray-200 opacity-50 w-[508px] mx-auto relative left-[-78px] mt-[80px]"></div>
                </div>

                {/* Sign In Form */}
                <div className="space-y-6" style={{ transform: window.innerWidth < 768 ? 'translateY(-60px)' : 'none' }}>
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-[#004a59] mb-2 -mt-[18px]">
                      Let's get you signed in
                    </h2>
                  </div>

                  {/* Input Section */}
                  <div>
                    {isEmailMode ? (
                      <div className="relative">
                        {/* Floating Label */}
                        <label 
                          className={`absolute transition-all duration-300 ease-out pointer-events-none z-20 left-6 ${
                            isEmailInputFocused || formEmail
                              ? 'top-1 text-sm bg-white px-1' 
                              : 'top-1/2 -translate-y-1/2 text-lg'
                          }`}
                          style={{color: '#617b7b'}}
                        >
                          Email
                        </label>
                        
                        <div 
                          className="h-14 flex items-center pl-6 pr-4 border rounded-full bg-white hover:outline hover:outline-[3px] hover:outline-[#befa4c78] transition-all cursor-pointer" 
                          style={{borderColor: '#b9cbd3'}}
                        >
                          <Input
                            type="email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            onFocus={() => setIsEmailInputFocused(true)}
                            onBlur={() => setIsEmailInputFocused(false)}
                            className="border-0 bg-transparent text-base p-0 focus-visible:ring-0 flex-1 font-sans"
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative" ref={authDropdownRef}>
                        <div className="relative">
                          {/* Icon with dynamic display based on state */}
                          {selectedAuthCountry && formPhone ? (
                            <img src={selectedAuthCountry.flag} alt={`${selectedAuthCountry.name} flag`} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 z-10 object-cover rounded-full" />
                          ) : isAuthOpen ? (
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                          ) : selectedAuthCountry && !formPhone ? (
                            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10" style={{color: '#617b7b'}} />
                          ) : (
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10" style={{color: '#617b7b'}} />
                          )}

                          {/* Floating Label */}
                          <label 
                            className={`absolute transition-all duration-300 ease-out pointer-events-none z-20 ${
                              selectedAuthCountry 
                                ? 'left-[68px]' // Move right when country is selected (64px + 4px)
                                : 'left-12' // Default position with search icon
                            } ${
                              isAuthOpen || formPhone || selectedAuthCountry || isAuthInputFocused
                                ? 'top-1 text-xs bg-white px-1' 
                                : 'top-1/2 -translate-y-1/2 text-base'
                            }`}
                            style={{color: '#617b7b'}}
                          >
                            Enter number
                          </label>
                          
                          <div 
                            className="h-14 flex items-center pl-12 pr-4 border rounded-full bg-white hover:outline hover:outline-[3px] hover:outline-[#befa4c78] transition-all cursor-pointer" 
                            style={{borderColor: '#b9cbd3'}}
                            onClick={() => {
                              console.log('Auth dropdown clicked, current isAuthOpen:', isAuthOpen);
                              setIsAuthOpen(!isAuthOpen);
                            }}
                          >
                            <div className="flex items-center w-full">
                              {selectedAuthCountry && (
                                <ChevronDown 
                                  className={`w-3 h-3 mr-3 transform transition-transform duration-200 ${isAuthOpen ? 'rotate-180' : ''}`} 
                                  style={{color: '#617b7b'}} 
                                />
                              )}
                              <Input 
                                type="tel" 
                                value={formPhone} 
                                onChange={e => handleFormPhoneNumberChange(e.target.value)}
                                onFocus={() => {
                                  setIsAuthInputFocused(true);
                                }}
                                onBlur={() => setIsAuthInputFocused(false)}
                                className="border-0 bg-transparent text-base p-0 focus-visible:ring-0 flex-1 font-sans" 
                                onClick={e => e.stopPropagation()} 
                              />
                            </div>
                          </div>
                         
                         {/* Dropdown */}
                         {isAuthOpen && (
                           <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 rounded-2xl">
                             <div className="max-h-80 overflow-auto bg-white rounded-2xl">
                               {filteredAuthCountries.map(country => (
                                 <div 
                                   key={country.code} 
                                   onClick={() => handleAuthCountrySelect(country)} 
                                   className={cn(
                                     "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors", 
                                     selectedAuthCountry?.code === country.code && "bg-lime-50"
                                   )}
                                 >
                                   <img src={country.flag} alt={`${country.name} flag`} className="w-8 h-8 mr-3 object-cover rounded-full" />
                                   <div className="flex-1 flex items-center justify-between">
                                     <div className="font-medium text-foreground">{country.name}</div>
                                     <div className="text-sm text-gray-500 font-mono">{country.dialCode}</div>
                                   </div>
                                   {selectedAuthCountry?.code === country.code && <Check className="w-5 h-5 text-lime-600" />}
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                      </div>
                    )}
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleAuthSubmit}
                    disabled={isAuthLoading}
                    className="w-full h-12 bg-lime-400 hover:bg-lime-500 text-[#004a59] font-semibold rounded-full text-base"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>


                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <div className="flex justify-center space-x-4">
                    {!isEmailMode && (
                      <button 
                        onClick={() => setIsEmailMode(true)}
                        className="flex flex-col items-center py-4 px-3 rounded-lg"
                      >
                        <div className="flex items-center justify-center mb-2 transition-transform duration-200 hover:scale-95">
                          <img src={emailIcon} alt="Email" className="w-16 h-16" />
                        </div>
                        <span className="text-sm text-[#004a59] font-medium">Email</span>
                      </button>
                    )}
                    
                    {isEmailMode && (
                      <button 
                        onClick={() => setIsEmailMode(false)}
                        className="flex flex-col items-center py-4 px-3 rounded-lg"
                      >
                        <div className="flex items-center justify-center mb-2 transition-transform duration-200 hover:scale-95">
                          <img src={phoneIcon} alt="Phone" className="w-20 h-16" />
                        </div>
                        <span className="text-sm text-[#004a59] font-medium">Phone</span>
                      </button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-500 pt-4">
                    Read full <span className="font-medium" style={{color: '#d627d2'}}>T&C's</span> and <span className="font-medium" style={{color: '#d627d2'}}>Privacy Notice</span>.
                  </div>
                </div>
              </>
            ) : currentStep === 'payment' ? (
              /* Payment Step */
              <>
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    onClick={handleBackToAmountSelection}
                    variant="ghost"
                    className="text-gray-600 hover:text-[#004a59] p-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-lg font-semibold text-[#004a59]">Payment</h1>
                  <div className="w-9"></div>
                </div>

                <div className="space-y-6">
                  {/* Phone Number and Amount Card */}
                  <Card className="p-4 rounded-3xl relative" style={{borderColor: '#b9cbd3'}}>
                    <div className="absolute top-4 left-4">
                      <img src={selectedProvider?.logo} alt={`${selectedProvider?.name} logo`} className="w-6 h-6 rounded object-cover" />
                    </div>
                    <div className="flex items-center justify-end mb-2">
                      <div className="relative edit-dropdown">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-lime-600 h-8 w-8" 
                          onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                        >
                          <img src={pencilEditIcon} alt="Edit" className="h-8 w-12" />
                        </Button>
                        
                        {isEditDropdownOpen && (
                          <div className="absolute right-full top-0 mr-2 bg-white border border-gray-300 rounded-3xl shadow-lg p-4 w-56 z-50 animate-slide-in-left">
                            <div className="space-y-4">
                              <button
                                onClick={() => {
                                  setCurrentStep('provider-selection');
                                  setIsEditDropdownOpen(false);
                                }}
                                className="w-full text-left text-lg font-medium text-[#004a59] hover:bg-gray-50 rounded-lg transition-colors py-2"
                              >
                                Edit operator
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentStep('number-entry');
                                  setIsEditDropdownOpen(false);
                                }}
                                className="w-full text-left text-lg font-medium text-[#004a59] hover:bg-gray-50 rounded-lg transition-colors py-2"
                              >
                                Edit phone number
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentStep('amount-selection');
                                  setIsEditDropdownOpen(false);
                                }}
                                className="w-full text-left text-lg font-medium text-[#004a59] hover:bg-gray-50 rounded-lg transition-colors py-2"
                              >
                                Edit amount
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                       <span className="text-lg font-semibold text-[#004a59]">
                        {selectedCountry?.dialCode} {phoneNumber.replace(selectedCountry?.dialCode || '', '').trim()}
                      </span>
                    </div>
                    <div className="flex items-center justify-end">
                        <span className="text-xl font-bold text-[#004a59]">
                          {topUpAmounts.find(amount => amount.value === selectedAmount)?.label || (geoLocation?.currency === 'USD' ? `${selectedAmount} USD` : `${geoLocation?.currencySymbol || '$'}${selectedAmount}`)}
                        </span>
                    </div>
                  </Card>

                   {/* Your Total */}
                   <div className="flex items-center justify-between">
                     <span className="text-lg font-medium text-[#004a59]">Your Total</span>
                     <div className="flex items-center space-x-2">
                       <span className="text-lg font-semibold text-[#004a59]">
                         {getDisplayTotal()}
                       </span>
                       <ChevronDown className="h-4 w-4 text-gray-600" />
                     </div>
                   </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{borderColor: '#d627d2', backgroundColor: '#d627d2'}}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <span className="text-[#004a59] font-medium">Card</span>
                      </div>
                      <img src={paymentMethodsIcon} alt="Payment methods" className="h-12 md:h-20" />
                    </div>

                    {/* Payment Method Icons */}

                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-[#004a59]">Card number</Label>
                      <Input
                        id="idNumber"
                        placeholder="Enter your card number"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                        className="bg-white border-gray-200 focus-visible:ring-0 focus:ring-0"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-[#004a59]">Expiry</Label>
                        <div className="relative">
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={formData.expiry}
                            onChange={(e) => {
                              let value = e.target.value;
                              
                              // If user is deleting (value is shorter than current), allow it
                              if (value.length < formData.expiry.length) {
                                setFormData({...formData, expiry: value});
                                return;
                              }
                              
                              // For adding characters, format automatically
                              value = value.replace(/\D/g, ''); // Remove non-digits
                              if (value.length >= 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2, 4);
                              }
                              setFormData({...formData, expiry: value});
                            }}
                            className="bg-white border-gray-200 focus-visible:ring-0 focus:ring-0 pr-10"
                          />
                          {formData.expiry.replace(/\D/g, '').length === 4 && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <img src={checkmarkIcon} alt="Valid" className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pls" className="text-[#004a59]">CVV</Label>
                        <Input
                          id="pls"
                          placeholder="CVV"
                          value={formData.pls}
                          onChange={(e) => setFormData({...formData, pls: e.target.value})}
                          className="bg-white border-gray-200 focus-visible:ring-0 focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName" className="text-[#004a59]">Name on card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={formData.nameOnCard}
                        onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})}
                        className="bg-white border-gray-200 focus-visible:ring-0 focus:ring-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-[#004a59]">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                        <SelectTrigger className="bg-white border-gray-200 focus-visible:ring-0 focus:ring-0">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ad">Andorra</SelectItem>
                          <SelectItem value="ae">United Arab Emirates</SelectItem>
                          <SelectItem value="af">Afghanistan</SelectItem>
                          <SelectItem value="ag">Antigua and Barbuda</SelectItem>
                          <SelectItem value="ai">Anguilla</SelectItem>
                          <SelectItem value="al">Albania</SelectItem>
                          <SelectItem value="am">Armenia</SelectItem>
                          <SelectItem value="ao">Angola</SelectItem>
                          <SelectItem value="aq">Antarctica</SelectItem>
                          <SelectItem value="ar">Argentina</SelectItem>
                          <SelectItem value="as">American Samoa</SelectItem>
                          <SelectItem value="at">Austria</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="aw">Aruba</SelectItem>
                          <SelectItem value="ax">Åland Islands</SelectItem>
                          <SelectItem value="az">Azerbaijan</SelectItem>
                          <SelectItem value="ba">Bosnia and Herzegovina</SelectItem>
                          <SelectItem value="bb">Barbados</SelectItem>
                          <SelectItem value="bd">Bangladesh</SelectItem>
                          <SelectItem value="be">Belgium</SelectItem>
                          <SelectItem value="bf">Burkina Faso</SelectItem>
                          <SelectItem value="bg">Bulgaria</SelectItem>
                          <SelectItem value="bh">Bahrain</SelectItem>
                          <SelectItem value="bi">Burundi</SelectItem>
                          <SelectItem value="bj">Benin</SelectItem>
                          <SelectItem value="bl">Saint Barthélemy</SelectItem>
                          <SelectItem value="bm">Bermuda</SelectItem>
                          <SelectItem value="bn">Brunei</SelectItem>
                          <SelectItem value="bo">Bolivia</SelectItem>
                          <SelectItem value="bq">Caribbean Netherlands</SelectItem>
                          <SelectItem value="br">Brazil</SelectItem>
                          <SelectItem value="bs">Bahamas</SelectItem>
                          <SelectItem value="bt">Bhutan</SelectItem>
                          <SelectItem value="bv">Bouvet Island</SelectItem>
                          <SelectItem value="bw">Botswana</SelectItem>
                          <SelectItem value="by">Belarus</SelectItem>
                          <SelectItem value="bz">Belize</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="cc">Cocos Islands</SelectItem>
                          <SelectItem value="cd">Democratic Republic of the Congo</SelectItem>
                          <SelectItem value="cf">Central African Republic</SelectItem>
                          <SelectItem value="cg">Republic of the Congo</SelectItem>
                          <SelectItem value="ch">Switzerland</SelectItem>
                          <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                          <SelectItem value="ck">Cook Islands</SelectItem>
                          <SelectItem value="cl">Chile</SelectItem>
                          <SelectItem value="cm">Cameroon</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                          <SelectItem value="co">Colombia</SelectItem>
                          <SelectItem value="cr">Costa Rica</SelectItem>
                          <SelectItem value="cu">Cuba</SelectItem>
                          <SelectItem value="cv">Cape Verde</SelectItem>
                          <SelectItem value="cw">Curaçao</SelectItem>
                          <SelectItem value="cx">Christmas Island</SelectItem>
                          <SelectItem value="cy">Cyprus</SelectItem>
                          <SelectItem value="cz">Czech Republic</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="dj">Djibouti</SelectItem>
                          <SelectItem value="dk">Denmark</SelectItem>
                          <SelectItem value="dm">Dominica</SelectItem>
                          <SelectItem value="do">Dominican Republic</SelectItem>
                          <SelectItem value="dz">Algeria</SelectItem>
                          <SelectItem value="ec">Ecuador</SelectItem>
                          <SelectItem value="ee">Estonia</SelectItem>
                          <SelectItem value="eg">Egypt</SelectItem>
                          <SelectItem value="eh">Western Sahara</SelectItem>
                          <SelectItem value="er">Eritrea</SelectItem>
                          <SelectItem value="es">Spain</SelectItem>
                          <SelectItem value="et">Ethiopia</SelectItem>
                          <SelectItem value="fi">Finland</SelectItem>
                          <SelectItem value="fj">Fiji</SelectItem>
                          <SelectItem value="fk">Falkland Islands</SelectItem>
                          <SelectItem value="fm">Micronesia</SelectItem>
                          <SelectItem value="fo">Faroe Islands</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="ga">Gabon</SelectItem>
                          <SelectItem value="gb">United Kingdom</SelectItem>
                          <SelectItem value="gd">Grenada</SelectItem>
                          <SelectItem value="ge">Georgia</SelectItem>
                          <SelectItem value="gf">French Guiana</SelectItem>
                          <SelectItem value="gg">Guernsey</SelectItem>
                          <SelectItem value="gh">Ghana</SelectItem>
                          <SelectItem value="gi">Gibraltar</SelectItem>
                          <SelectItem value="gl">Greenland</SelectItem>
                          <SelectItem value="gm">Gambia</SelectItem>
                          <SelectItem value="gn">Guinea</SelectItem>
                          <SelectItem value="gp">Guadeloupe</SelectItem>
                          <SelectItem value="gq">Equatorial Guinea</SelectItem>
                          <SelectItem value="gr">Greece</SelectItem>
                          <SelectItem value="gs">South Georgia</SelectItem>
                          <SelectItem value="gt">Guatemala</SelectItem>
                          <SelectItem value="gu">Guam</SelectItem>
                          <SelectItem value="gw">Guinea-Bissau</SelectItem>
                          <SelectItem value="gy">Guyana</SelectItem>
                          <SelectItem value="hk">Hong Kong</SelectItem>
                          <SelectItem value="hm">Heard Island</SelectItem>
                          <SelectItem value="hn">Honduras</SelectItem>
                          <SelectItem value="hr">Croatia</SelectItem>
                          <SelectItem value="ht">Haiti</SelectItem>
                          <SelectItem value="hu">Hungary</SelectItem>
                          <SelectItem value="id">Indonesia</SelectItem>
                          <SelectItem value="ie">Ireland</SelectItem>
                          <SelectItem value="il">Israel</SelectItem>
                          <SelectItem value="im">Isle of Man</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="io">British Indian Ocean Territory</SelectItem>
                          <SelectItem value="iq">Iraq</SelectItem>
                          <SelectItem value="ir">Iran</SelectItem>
                          <SelectItem value="is">Iceland</SelectItem>
                          <SelectItem value="it">Italy</SelectItem>
                          <SelectItem value="je">Jersey</SelectItem>
                          <SelectItem value="jm">Jamaica</SelectItem>
                          <SelectItem value="jo">Jordan</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="ke">Kenya</SelectItem>
                          <SelectItem value="kg">Kyrgyzstan</SelectItem>
                          <SelectItem value="kh">Cambodia</SelectItem>
                          <SelectItem value="ki">Kiribati</SelectItem>
                          <SelectItem value="km">Comoros</SelectItem>
                          <SelectItem value="kn">Saint Kitts and Nevis</SelectItem>
                          <SelectItem value="kp">North Korea</SelectItem>
                          <SelectItem value="kr">South Korea</SelectItem>
                          <SelectItem value="kw">Kuwait</SelectItem>
                          <SelectItem value="ky">Cayman Islands</SelectItem>
                          <SelectItem value="kz">Kazakhstan</SelectItem>
                          <SelectItem value="la">Laos</SelectItem>
                          <SelectItem value="lb">Lebanon</SelectItem>
                          <SelectItem value="lc">Saint Lucia</SelectItem>
                          <SelectItem value="li">Liechtenstein</SelectItem>
                          <SelectItem value="lk">Sri Lanka</SelectItem>
                          <SelectItem value="lr">Liberia</SelectItem>
                          <SelectItem value="ls">Lesotho</SelectItem>
                          <SelectItem value="lt">Lithuania</SelectItem>
                          <SelectItem value="lu">Luxembourg</SelectItem>
                          <SelectItem value="lv">Latvia</SelectItem>
                          <SelectItem value="ly">Libya</SelectItem>
                          <SelectItem value="ma">Morocco</SelectItem>
                          <SelectItem value="mc">Monaco</SelectItem>
                          <SelectItem value="md">Moldova</SelectItem>
                          <SelectItem value="me">Montenegro</SelectItem>
                          <SelectItem value="mf">Saint Martin</SelectItem>
                          <SelectItem value="mg">Madagascar</SelectItem>
                          <SelectItem value="mh">Marshall Islands</SelectItem>
                          <SelectItem value="mk">North Macedonia</SelectItem>
                          <SelectItem value="ml">Mali</SelectItem>
                          <SelectItem value="mm">Myanmar</SelectItem>
                          <SelectItem value="mn">Mongolia</SelectItem>
                          <SelectItem value="mo">Macao</SelectItem>
                          <SelectItem value="mp">Northern Mariana Islands</SelectItem>
                          <SelectItem value="mq">Martinique</SelectItem>
                          <SelectItem value="mr">Mauritania</SelectItem>
                          <SelectItem value="ms">Montserrat</SelectItem>
                          <SelectItem value="mt">Malta</SelectItem>
                          <SelectItem value="mu">Mauritius</SelectItem>
                          <SelectItem value="mv">Maldives</SelectItem>
                          <SelectItem value="mw">Malawi</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                          <SelectItem value="my">Malaysia</SelectItem>
                          <SelectItem value="mz">Mozambique</SelectItem>
                          <SelectItem value="na">Namibia</SelectItem>
                          <SelectItem value="nc">New Caledonia</SelectItem>
                          <SelectItem value="ne">Niger</SelectItem>
                          <SelectItem value="nf">Norfolk Island</SelectItem>
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="ni">Nicaragua</SelectItem>
                          <SelectItem value="nl">Netherlands</SelectItem>
                          <SelectItem value="no">Norway</SelectItem>
                          <SelectItem value="np">Nepal</SelectItem>
                          <SelectItem value="nr">Nauru</SelectItem>
                          <SelectItem value="nu">Niue</SelectItem>
                          <SelectItem value="nz">New Zealand</SelectItem>
                          <SelectItem value="om">Oman</SelectItem>
                          <SelectItem value="pa">Panama</SelectItem>
                          <SelectItem value="pe">Peru</SelectItem>
                          <SelectItem value="pf">French Polynesia</SelectItem>
                          <SelectItem value="pg">Papua New Guinea</SelectItem>
                          <SelectItem value="ph">Philippines</SelectItem>
                          <SelectItem value="pk">Pakistan</SelectItem>
                          <SelectItem value="pl">Poland</SelectItem>
                          <SelectItem value="pm">Saint Pierre and Miquelon</SelectItem>
                          <SelectItem value="pn">Pitcairn</SelectItem>
                          <SelectItem value="pr">Puerto Rico</SelectItem>
                          <SelectItem value="ps">Palestine</SelectItem>
                          <SelectItem value="pt">Portugal</SelectItem>
                          <SelectItem value="pw">Palau</SelectItem>
                          <SelectItem value="py">Paraguay</SelectItem>
                          <SelectItem value="qa">Qatar</SelectItem>
                          <SelectItem value="re">Réunion</SelectItem>
                          <SelectItem value="ro">Romania</SelectItem>
                          <SelectItem value="rs">Serbia</SelectItem>
                          <SelectItem value="ru">Russia</SelectItem>
                          <SelectItem value="rw">Rwanda</SelectItem>
                          <SelectItem value="sa">Saudi Arabia</SelectItem>
                          <SelectItem value="sb">Solomon Islands</SelectItem>
                          <SelectItem value="sc">Seychelles</SelectItem>
                          <SelectItem value="sd">Sudan</SelectItem>
                          <SelectItem value="se">Sweden</SelectItem>
                          <SelectItem value="sg">Singapore</SelectItem>
                          <SelectItem value="sh">Saint Helena</SelectItem>
                          <SelectItem value="si">Slovenia</SelectItem>
                          <SelectItem value="sj">Svalbard and Jan Mayen</SelectItem>
                          <SelectItem value="sk">Slovakia</SelectItem>
                          <SelectItem value="sl">Sierra Leone</SelectItem>
                          <SelectItem value="sm">San Marino</SelectItem>
                          <SelectItem value="sn">Senegal</SelectItem>
                          <SelectItem value="so">Somalia</SelectItem>
                          <SelectItem value="sr">Suriname</SelectItem>
                          <SelectItem value="ss">South Sudan</SelectItem>
                          <SelectItem value="st">São Tomé and Príncipe</SelectItem>
                          <SelectItem value="sv">El Salvador</SelectItem>
                          <SelectItem value="sx">Sint Maarten</SelectItem>
                          <SelectItem value="sy">Syria</SelectItem>
                          <SelectItem value="sz">Eswatini</SelectItem>
                          <SelectItem value="tc">Turks and Caicos Islands</SelectItem>
                          <SelectItem value="td">Chad</SelectItem>
                          <SelectItem value="tf">French Southern Territories</SelectItem>
                          <SelectItem value="tg">Togo</SelectItem>
                          <SelectItem value="th">Thailand</SelectItem>
                          <SelectItem value="tj">Tajikistan</SelectItem>
                          <SelectItem value="tk">Tokelau</SelectItem>
                          <SelectItem value="tl">Timor-Leste</SelectItem>
                          <SelectItem value="tm">Turkmenistan</SelectItem>
                          <SelectItem value="tn">Tunisia</SelectItem>
                          <SelectItem value="to">Tonga</SelectItem>
                          <SelectItem value="tr">Turkey</SelectItem>
                          <SelectItem value="tt">Trinidad and Tobago</SelectItem>
                          <SelectItem value="tv">Tuvalu</SelectItem>
                          <SelectItem value="tw">Taiwan</SelectItem>
                          <SelectItem value="tz">Tanzania</SelectItem>
                          <SelectItem value="ua">Ukraine</SelectItem>
                          <SelectItem value="ug">Uganda</SelectItem>
                          <SelectItem value="um">United States Minor Outlying Islands</SelectItem>
                          <SelectItem value="us">United States of America</SelectItem>
                          <SelectItem value="uy">Uruguay</SelectItem>
                          <SelectItem value="uz">Uzbekistan</SelectItem>
                          <SelectItem value="va">Vatican City</SelectItem>
                          <SelectItem value="vc">Saint Vincent and the Grenadines</SelectItem>
                          <SelectItem value="ve">Venezuela</SelectItem>
                          <SelectItem value="vg">British Virgin Islands</SelectItem>
                          <SelectItem value="vi">U.S. Virgin Islands</SelectItem>
                          <SelectItem value="vn">Vietnam</SelectItem>
                          <SelectItem value="vu">Vanuatu</SelectItem>
                          <SelectItem value="wf">Wallis and Futuna</SelectItem>
                          <SelectItem value="ws">Samoa</SelectItem>
                          <SelectItem value="ye">Yemen</SelectItem>
                          <SelectItem value="yt">Mayotte</SelectItem>
                          <SelectItem value="za">South Africa</SelectItem>
                          <SelectItem value="zm">Zambia</SelectItem>
                          <SelectItem value="zw">Zimbabwe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-[#004a59]">ZIP / Postal code</Label>
                      <Input
                        id="zipCode"
                        placeholder="12345"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        className="bg-white border-gray-200 focus-visible:ring-0 focus:ring-0"
                      />
                    </div>

                    {/* Save Card Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveCard"
                        checked={saveCard}
                        onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                        className="data-[state=checked]:text-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-sm"
                        style={{
                          borderColor: '#d627d2',
                          backgroundColor: saveCard ? '#d627d2' : 'transparent'
                        }}
                      />
                      <Label htmlFor="saveCard" className="text-[#004a59] text-sm">
                        Securely store card for next time
                      </Label>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handlePayment}
                    className="w-full h-14 text-lg font-bold bg-lime-400 hover:bg-lime-400 text-foreground border-0 rounded-full shadow-sm disabled:bg-lime-400 disabled:text-foreground disabled:opacity-100 transition-transform duration-200 hover:scale-95"
                    size="lg"
                   >
                     Pay {getDisplayTotal()} now
                   </Button>
                </div>
              </>
            ) : currentStep === 'processing' ? (
              /* Processing Step */
              <>
                {isProcessing ? (
                  <>
                    {/* Loading Animation */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 border-4 border-lime-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-lime-500 rounded-full animate-spin"></div>
                        
                        {/* Inner pulsing circle */}
                        <div className="absolute inset-3 bg-lime-100 rounded-full animate-pulse"></div>
                        
                        {/* Center dot */}
                        <div className="absolute inset-8 bg-lime-500 rounded-full animate-bounce"></div>
                      </div>
                    </div>

                    <h1 className="text-2xl font-bold text-[#004a59] mb-4 text-center animate-fade-in">
                      Processing Payment
                    </h1>
                    
                    <div className="space-y-2 animate-fade-in text-center">
                      <p className="text-gray-600">
                        Please wait while we process your payment...
                      </p>
                      <p className="text-sm text-gray-500">
                        Order ID: <span className="font-mono text-lime-600">{orderId}</span>
                      </p>
                    </div>

                    {/* Animated dots */}
                    <div className="flex justify-center space-x-1 mt-6">
                      <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success Animation */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                        <CheckCircle className="w-12 h-12 text-green-600 animate-fade-in" />
                      </div>
                    </div>

                    <h1 className="text-2xl font-bold text-[#004a59] mb-4 text-center animate-fade-in">
                      Payment Processed!
                    </h1>
                    
                    <p className="text-gray-600 animate-fade-in text-center">
                      Redirecting to confirmation page...
                    </p>
                  </>
                )}
              </>
            ) : currentStep === 'success' ? (
              /* Success Step */
              <>
                {/* Success Icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-[#004a59] mb-4 text-center">
                  Payment Successful!
                </h1>
                
                <div className="space-y-4 mb-6 text-center">
                  <p className="text-gray-600">
                    Your payment has been processed successfully.
                  </p>
                  <p className="text-sm text-gray-500">
                    Order ID: <span className="font-mono text-lime-600">{orderId}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleDownloadReceipt}
                    variant="outline"
                    className="w-full flex items-center space-x-2 border-gray-200 hover:border-lime-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = "/ding-topup"}
                    className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
                  >
                    Create New Order
                  </Button>
                </div>
              </>
            ) : null}
           </Card>
         </div>
       </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-teal-800 font-bold cursor-pointer" onClick={() => navigate('/topup')}>ding</span>
            <span className="text-gray-600 text-sm">© Ezetop 2025. All rights reserved.</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <span>Privacy notice</span>
            <span>Friends and Family Privacy Notice</span>
            <span>Terms & conditions</span>
            <span>Cookies</span>
          </div>

          <Button 
            size="sm" 
            className="bg-teal-700 hover:bg-teal-800 text-white rounded-full"
          >
            💬 Help
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default DingTopup;
