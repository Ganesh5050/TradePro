import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStockStore } from '@/stores/useStockStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';

// Define comprehensive sectors (48+ categories)
const SECTORS = [
  'Banking & Financial Services (BFSI)',
  'Fintech & Digital Payments',
  'Information Technology (IT)',
  'Pharmaceuticals & Healthcare',
  'Oil, Gas & Energy',
  'Auto & Auto Ancillaries',
  'FMCG',
  'Metal & Mining',
  'Infrastructure & Construction',
  'Cement & Building Materials',
  'Power (Generation, Transmission, Distribution)',
  'Telecom',
  'Real Estate',
  'Consumer Durables',
  'Chemicals & Specialty Chemicals',
  'Retail & E-commerce',
  'Textiles & Apparel',
  'Ports & Logistics',
  'Logistics & Transportation',
  'Paper & Packaging',
  'Hotels & Tourism',
  'Agriculture & Agro Products',
  'Paints & Coatings',
  'Plastics & Polymers',
  'Glass & Ceramics',
  'Cables & Wires',
  'Engineering & Capital Goods',
  'Defence & Aerospace',
  'Education & Training',
  'Gems & Jewellery',
  'Printing & Publishing',
  'Rubber & Rubber Products',
  'Leather & Footwear',
  'Wood & Furniture',
  'Tobacco & Cigarettes',
  'Breweries & Distilleries',
  'Trading & Distribution',
  'Consulting & Professional Services',
  'Security Services',
  'Renewable Energy & Solar',
  'Water Treatment & Management',
  'Waste Management & Recycling',
  'Pipes & Fittings',
  'Bearings & Fasteners',
  'Valves & Pumps',
  'Electrical Equipment',
  'Others'
];

// Function to categorize stock into appropriate sector
const categorizeSector = (stockSector: string, stockName: string, symbol: string): string => {
  const sector = stockSector?.toLowerCase() || '';
  const name = stockName?.toLowerCase() || '';
  const sym = symbol?.toLowerCase() || '';

  // Specific company mappings (Check BEFORE general rules)
  
  // IT Companies
  if (name.includes('63 moons') || name.includes('aaa technologies')) {
    return 'Information Technology (IT)';
  }
  
  // Fintech & Digital Payments
  if (name.includes('angel one') || name.includes('paytm') || name.includes('phonepe') || 
      name.includes('razorpay') || name.includes('policybazaar')) {
    return 'Fintech & Digital Payments';
  }
  
  // Pharmaceuticals
  if (name.includes('alembic limited') || name.includes('anthem biosciences')) {
    return 'Pharmaceuticals & Healthcare';
  }
  
  // Chemicals
  if (name.includes('accelya solutions') || name.includes('advanced enzyme') || 
      name.includes('aether industries') || name.includes('agi greenpac')) {
    return 'Chemicals & Specialty Chemicals';
  }
  
  // Cement
  if (name.includes('acc limited') || name.includes('acc cement')) {
    return 'Cement & Building Materials';
  }
  
  // Ports
  if (name.includes('adani ports') || name.includes('adani port')) {
    return 'Ports & Logistics';
  }
  
  // Renewable Energy
  if (name.includes('avaada') || name.includes('agrotech')) {
    return 'Renewable Energy & Solar';
  }
  
  // Defence & Aerospace
  if (name.includes('dynamatic technologies') || name.includes('mtar technologies')) {
    return 'Defence & Aerospace';
  }
  
  // Pipes & Fittings
  if (name.includes('hi-tech pipes')) {
    return 'Pipes & Fittings';
  }
  
  // Paper & Packaging
  if (name.includes('garware hi-tech films') || name.includes('hitech corporation')) {
    return 'Paper & Packaging';
  }
  
  // Auto & Auto Ancillaries
  if (name.includes('hi-tech gears') || name.includes('lumax auto technologies')) {
    return 'Auto & Auto Ancillaries';
  }
  
  // Electrical Equipment
  if (name.includes('indo tech transformers') || name.includes('servotech renewable')) {
    return 'Electrical Equipment';
  }
  
  // Telecom
  if (name.includes('sterlite technologies') || name.includes('uniinfo telecom')) {
    return 'Telecom';
  }
  
  // Plastics & Polymers
  if (name.includes('time technoplast')) {
    return 'Plastics & Polymers';
  }
  
  // Real Estate
  if (name.includes('unitech limited') && !name.includes('info')) {
    return 'Real Estate';
  }

  // Information Technology (Now check IT companies)
  if (sector.includes('it') || sector.includes('software') || sector.includes('computer') ||
      name.includes('software') || name.includes('infotech') || name.includes('tech mahindra') || name.includes('cyber') ||
      name.includes('birlasoft') || name.includes('wipro') || name.includes('infosys') || name.includes('tcs') ||
      name.includes('hcl tech') || name.includes('ltimindtree') || name.includes('coforge') ||
      name.includes('persistent') || name.includes('mphasis') || name.includes('mindtree') ||
      (sym.includes('soft') && !name.includes('hitech')) || 
      (name.includes('tech') && (name.includes('info') || name.includes('systems') || name.includes('solutions')))) {
    return 'Information Technology (IT)';
  }

  // Banking & Financial Services (More comprehensive)
  if (sector.includes('bank') || sector.includes('financ') || sector.includes('insurance') || sector.includes('nbfc') ||
      name.includes('bank') || name.includes('finance') || name.includes('insurance') ||
      name.includes('capital') || name.includes('securities') || name.includes('credit') || name.includes('leasing') ||
      name.includes('housing finance') || name.includes('fincorp') || name.includes('wealth') ||
      name.includes('asset management') || name.includes('mutual fund') || name.includes('investment') ||
      name.includes('stock broker') || name.includes('depository') || name.includes('clearing')) {
    return 'Banking & Financial Services (BFSI)';
  }

  // Pharmaceuticals & Healthcare
  if (sector.includes('pharma') || sector.includes('health') || sector.includes('medic') || sector.includes('drug') ||
      name.includes('pharma') || name.includes('health') || name.includes('medic') || name.includes('lifesciences') ||
      name.includes('drug') || name.includes('hospital') || name.includes('diagnostic') || name.includes('biotech') ||
      name.includes('cipla') || name.includes('sun pharma') || name.includes('dr reddy') || name.includes('lupin') ||
      name.includes('biocon') || name.includes('divi') || name.includes('alkem') || name.includes('torrent pharma')) {
    return 'Pharmaceuticals & Healthcare';
  }

  // Defence & Aerospace (Check early for government defence companies)
  if (sector.includes('defence') || sector.includes('defense') || sector.includes('aerospace') || sector.includes('aviation') ||
      name.includes('defence') || name.includes('defense') || name.includes('aerospace') || name.includes('aviation') ||
      name.includes('aircraft') || name.includes('missile') || name.includes('bharat dynamics') || 
      name.includes('hal') || name.includes('hindustan aeronautics') || name.includes('bharat electronics') ||
      name.includes('bel') || name.includes('mazagon dock') || name.includes('garden reach shipbuilders')) {
    return 'Defence & Aerospace';
  }

  // Shipbuilding & Marine (Separate from Defence)
  if (name.includes('shipyard') || name.includes('shipbuilders') || name.includes('shipping corporation') ||
      name.includes('cochin shipyard') || name.includes('marine') || name.includes('offshore')) {
    return 'Defence & Aerospace';
  }

  // Coal & Mining (Separate from Metal)
  if (name.includes('coal india') || name.includes('coal') || name.includes('mining') || 
      name.includes('nmdc') || name.includes('mineral') || name.includes('ore')) {
    return 'Metal & Mining';
  }

  // Textiles & Apparel (Check before FMCG) - VERY COMPREHENSIVE
  if (sector.includes('textile') || sector.includes('apparel') || sector.includes('garment') || sector.includes('fabric') ||
      name.includes('textile') || name.includes('cotton') || name.includes('fabric') || name.includes('garment') ||
      name.includes('apparel') || name.includes('fashion') || name.includes('clothing') || name.includes('yarn') ||
      name.includes('raymond') || name.includes('arvind') || name.includes('vardhman') ||
      name.includes('welspun') || name.includes('trident') || name.includes('gokaldas') ||
      name.includes('page industries') || name.includes('aditya birla fashion') ||
      name.includes('spinning') || name.includes('weaving') || name.includes('knitting') ||
      name.includes('denim') || name.includes('silk') || name.includes('wool') ||
      name.includes('polyester') || name.includes('nylon') || name.includes('fibre') ||
      name.includes('fiber') || name.includes('thread') || name.includes('cloth') ||
      name.includes('linen') || name.includes('jute') || name.includes('hosiery') ||
      name.includes('readymade') || name.includes('garments') || name.includes('dress') ||
      name.includes('shirt') || name.includes('trouser') || name.includes('saree') ||
      name.includes('suit') || name.includes('innerwear') || name.includes('lingerie')) {
    return 'Textiles & Apparel';
  }

  // Media & Entertainment
  if (sector.includes('media') || sector.includes('entertainment') || sector.includes('broadcast') ||
      name.includes('media') || name.includes('entertainment') || name.includes('television') || name.includes('tv') ||
      name.includes('film') || name.includes('movie') || name.includes('broadcast') || name.includes('news')) {
    return 'Media & Entertainment';
  }

  // Ports & Logistics (Check before general logistics)
  if (sector.includes('port') || name.includes('port') || name.includes('gateway distriparks') ||
      name.includes('adani ports') || name.includes('mundra port')) {
    return 'Ports & Logistics';
  }

  // Fintech & Digital Payments (Check before Banking)
  if (sector.includes('fintech') || sector.includes('digital payment') ||
      name.includes('fintech') || name.includes('digital payment') || name.includes('payment') ||
      name.includes('paytm') || name.includes('phonepe') || name.includes('angel one')) {
    return 'Fintech & Digital Payments';
  }

  // Logistics & Transportation
  if (sector.includes('logistic') || sector.includes('transport') || sector.includes('shipping') || sector.includes('cargo') ||
      name.includes('logistic') || name.includes('transport') || name.includes('shipping') || name.includes('cargo') ||
      name.includes('freight') || name.includes('courier') || name.includes('supply chain')) {
    return 'Logistics & Transportation';
  }

  // Paper & Packaging - VERY COMPREHENSIVE
  if (sector.includes('paper') || sector.includes('packaging') ||
      name.includes('paper') || name.includes('packaging') || name.includes('pack') || name.includes('carton') ||
      name.includes('board') || name.includes('pulp') || name.includes('newsprint') ||
      name.includes('corrugated') || name.includes('box') || name.includes('container') ||
      name.includes('flexo') || name.includes('laminate') || name.includes('film') ||
      name.includes('foil') || name.includes('wrapper') || name.includes('bag') ||
      name.includes('pouch') || name.includes('label') || name.includes('sticker')) {
    return 'Paper & Packaging';
  }

  // Hotels & Tourism - VERY COMPREHENSIVE
  if (sector.includes('hotel') || sector.includes('tourism') || sector.includes('hospitality') ||
      name.includes('hotel') || name.includes('resort') || name.includes('tourism') || name.includes('hospitality') ||
      name.includes('taj') || name.includes('oberoi') || name.includes('itc hotels') ||
      name.includes('lemon tree') || name.includes('chalet') || name.includes('mahindra holidays') ||
      name.includes('restaurant') || name.includes('cafe') || name.includes('banquet') ||
      name.includes('catering') || name.includes('travel') || name.includes('tour')) {
    return 'Hotels & Tourism';
  }

  // Agriculture & Agro Products (Including Sugar)
  if (sector.includes('agri') || sector.includes('agro') || sector.includes('seed') || sector.includes('crop') ||
      name.includes('agri') || name.includes('agro') || name.includes('seed') || name.includes('crop') ||
      name.includes('farm') || name.includes('sugar') || name.includes('tea') ||
      name.includes('balrampur') || name.includes('dhampur sugar') || name.includes('dwarikesh') ||
      name.includes('triveni') || name.includes('shree renuka') || name.includes('bajaj hindusthan')) {
    return 'Agriculture & Agro Products';
  }

  // Paints & Coatings
  if (sector.includes('paint') || sector.includes('coating') ||
      name.includes('paint') || name.includes('coating') || name.includes('colour')) {
    return 'Paints & Coatings';
  }

  // Plastics & Polymers
  if (sector.includes('plastic') || sector.includes('polymer') || sector.includes('poly') ||
      name.includes('plastic') || name.includes('polymer') || name.includes('poly')) {
    return 'Plastics & Polymers';
  }

  // Glass & Ceramics
  if (sector.includes('glass') || sector.includes('ceramic') || sector.includes('tile') ||
      name.includes('glass') || name.includes('ceramic') || name.includes('tile') || name.includes('sanitary')) {
    return 'Glass & Ceramics';
  }

  // Cables & Wires
  if (sector.includes('cable') || sector.includes('wire') ||
      name.includes('cable') || name.includes('wire')) {
    return 'Cables & Wires';
  }

  // Defence & Aerospace
  if (sector.includes('defence') || sector.includes('defense') || sector.includes('aerospace') || sector.includes('aviation') ||
      name.includes('defence') || name.includes('defense') || name.includes('aerospace') || name.includes('aviation') ||
      name.includes('aircraft') || name.includes('missile')) {
    return 'Defence & Aerospace';
  }

  // Education & Training - VERY COMPREHENSIVE
  if (sector.includes('education') || sector.includes('training') || sector.includes('school') ||
      name.includes('education') || name.includes('training') || name.includes('school') || name.includes('learning') ||
      name.includes('college') || name.includes('university') || name.includes('institute') ||
      name.includes('academy') || name.includes('coaching') || name.includes('tuition') ||
      name.includes('e-learning') || name.includes('edutech') || name.includes('edtech') ||
      name.includes('byju') || name.includes('unacademy') || name.includes('upgrad')) {
    return 'Education & Training';
  }

  // Gems & Jewellery
  if (sector.includes('jewel') || sector.includes('gem') || sector.includes('diamond') || sector.includes('gold') ||
      name.includes('jewel') || name.includes('gem') || name.includes('diamond') || name.includes('gold')) {
    return 'Gems & Jewellery';
  }

  // Oil, Gas & Energy (Including Petrochemicals)
  if (sector.includes('oil') || sector.includes('gas') || sector.includes('petro') || sector.includes('fuel') ||
      name.includes('petroleum') || name.includes('oil india') || name.includes('ongc') || 
      name.includes('reliance industries') || name.includes('bpcl') || name.includes('hpcl') ||
      name.includes('ioc') || name.includes('indian oil') || name.includes('gas authority') ||
      name.includes('gail') || name.includes('petronet') || name.includes('refinery') ||
      name.includes('lpg') || name.includes('cng') || name.includes('chennai petroleum')) {
    return 'Oil, Gas & Energy';
  }

  // Auto & Auto Ancillaries
  if (sector.includes('auto') || sector.includes('vehicle') || sector.includes('motor') ||
      name.includes('auto') || name.includes('motor') || name.includes('vehicle') ||
      name.includes('tyre') || name.includes('tire') || name.includes('hero motocorp') ||
      name.includes('bajaj auto') || name.includes('maruti') || name.includes('tata motors') ||
      name.includes('mahindra') || name.includes('tvs motor') || name.includes('eicher') ||
      name.includes('ashok leyland') || name.includes('apollo tyres') || name.includes('ceat') ||
      name.includes('mrf') || name.includes('jk tyre')) {
    return 'Auto & Auto Ancillaries';
  }

  // FMCG (Much more comprehensive)
  if (sector.includes('fmcg') || sector.includes('consumer goods') || sector.includes('food') ||
      name.includes('foods') || name.includes('consumer products') || name.includes('beverage') ||
      name.includes('dairy') || name.includes('biscuit') || name.includes('snacks') || name.includes('bread') ||
      name.includes('britannia') || name.includes('nestle') || name.includes('itc') || name.includes('dabur') ||
      name.includes('marico') || name.includes('godrej consumer') || name.includes('colgate') ||
      name.includes('hindustan unilever') || name.includes('hul') || name.includes('parle') ||
      name.includes('amul') || name.includes('mother dairy') || name.includes('milk') ||
      name.includes('ice cream') || name.includes('chocolate') || name.includes('confection') ||
      name.includes('noodles') || name.includes('pasta') || name.includes('sauce') ||
      name.includes('pickle') || name.includes('spices') || name.includes('masala')) {
    return 'FMCG';
  }

  // Metal & Mining (More comprehensive)
  if (sector.includes('metal') || sector.includes('steel') || sector.includes('mining') || sector.includes('ore') ||
      name.includes('steel') || name.includes('metal') || name.includes('iron') || name.includes('ispat') ||
      name.includes('alumin') || name.includes('copper') || name.includes('zinc') || name.includes('alloy') ||
      name.includes('tata steel') || name.includes('jsw steel') || name.includes('sail') ||
      name.includes('jindal') || name.includes('hindalco') || name.includes('vedanta') ||
      name.includes('nalco') || name.includes('smelter') || name.includes('foundry') ||
      name.includes('casting') || name.includes('forging') || name.includes('brass') ||
      name.includes('bronze') || name.includes('nickel') || name.includes('lead') ||
      name.includes('manganese') || name.includes('chromium')) {
    return 'Metal & Mining';
  }

  // Engineering & Capital Goods - VERY COMPREHENSIVE
  if (sector.includes('engineering') || sector.includes('machinery') || sector.includes('equipment') ||
      name.includes('engineering') || name.includes('machinery') || name.includes('equipment') ||
      name.includes('machine') || name.includes('tools') || name.includes('pump') ||
      name.includes('boiler') || name.includes('compressor') || name.includes('turbine') ||
      name.includes('generator') || name.includes('motor') || name.includes('gear') ||
      name.includes('lathe') || name.includes('cnc') || name.includes('automation') ||
      name.includes('robotics') || name.includes('hydraulic') || name.includes('pneumatic') ||
      name.includes('conveyor') || name.includes('crane') || name.includes('hoist') ||
      name.includes('elevator') || name.includes('escalator') || name.includes('lift')) {
    return 'Engineering & Capital Goods';
  }

  // Infrastructure & Construction (More comprehensive)
  if (sector.includes('infra') || sector.includes('construction') ||
      name.includes('construction') || name.includes('infra') ||
      name.includes('projects') || name.includes('builders') || name.includes('contractor') ||
      name.includes('larsen') || name.includes('l&t') || name.includes('ncc') ||
      name.includes('pnc') || name.includes('irb') || name.includes('gmr') ||
      name.includes('gvk') || name.includes('road') || name.includes('highway') ||
      name.includes('bridge') || name.includes('tunnel') || name.includes('dam') ||
      name.includes('irrigation') || name.includes('epc')) {
    return 'Infrastructure & Construction';
  }

  // Cement & Building Materials
  if (sector.includes('cement') || sector.includes('building') ||
      name.includes('cement') || name.includes('building materials') || name.includes('concrete')) {
    return 'Cement & Building Materials';
  }

  // Power
  if (sector.includes('power') || sector.includes('electric') ||
      name.includes('power') || name.includes('electric') || name.includes('energy generation')) {
    return 'Power (Generation, Transmission, Distribution)';
  }

  // Telecom
  if (sector.includes('telecom') || sector.includes('communication') ||
      name.includes('telecom') || name.includes('communication') || name.includes('airtel') ||
      name.includes('vodafone') || name.includes('idea') || name.includes('network')) {
    return 'Telecom';
  }

  // Real Estate (More comprehensive)
  if (sector.includes('real estate') || sector.includes('realty') || sector.includes('property') ||
      name.includes('realty') || name.includes('property') || name.includes('housing') ||
      name.includes('developers') || name.includes('estate') || name.includes('land') ||
      name.includes('dlf') || name.includes('godrej properties') || name.includes('oberoi') ||
      name.includes('prestige') || name.includes('brigade') || name.includes('sobha') ||
      name.includes('lodha') || name.includes('mahindra lifespace') || name.includes('sunteck') ||
      name.includes('apartment') || name.includes('township') || name.includes('residential')) {
    return 'Real Estate';
  }

  // Consumer Durables (More comprehensive)
  if (sector.includes('durables') || sector.includes('appliances') || sector.includes('electronics') ||
      name.includes('appliances') || name.includes('electronics') || name.includes('durables') ||
      name.includes('refriger') || name.includes('washing') || name.includes('whirlpool') ||
      name.includes('voltas') || name.includes('blue star') || name.includes('havells') ||
      name.includes('crompton') || name.includes('bajaj electricals') || name.includes('orient electric') ||
      name.includes('usha') || name.includes('fan') || name.includes('cooler') ||
      name.includes('heater') || name.includes('mixer') || name.includes('grinder')) {
    return 'Consumer Durables';
  }

  // Chemicals & Specialty Chemicals (More specific)
  if (sector.includes('chemical') || sector.includes('fertilizer') || sector.includes('petrochemical') ||
      name.includes('chemical') || name.includes('fertilizer') || name.includes('pesticide') ||
      name.includes('petrochemical') || name.includes('aarti') || name.includes('vinati') ||
      name.includes('srf') || name.includes('pidilite') || name.includes('asian paints') ||
      name.includes('berger paints') || name.includes('kansai nerolac') ||
      name.includes('deepak nitrite') || name.includes('deepak fertilizers') ||
      name.includes('gujarat fluorochemicals') || name.includes('navin fluorine') ||
      name.includes('alkyl amines') || name.includes('balaji amines')) {
    return 'Chemicals & Specialty Chemicals';
  }

  // Retail & E-commerce (More comprehensive)
  if (sector.includes('retail') || sector.includes('ecommerce') || sector.includes('e-commerce') ||
      name.includes('retail') || name.includes('mart') || name.includes('store') || name.includes('shop') ||
      name.includes('dmart') || name.includes('reliance retail') || name.includes('future retail') ||
      name.includes('shoppers stop') || name.includes('trent') || name.includes('lifestyle') ||
      name.includes('westside') || name.includes('pantaloons') || name.includes('big bazaar') ||
      name.includes('flipkart') || name.includes('amazon') || name.includes('myntra') ||
      name.includes('supermarket') || name.includes('hypermarket')) {
    return 'Retail & E-commerce';
  }

  // Printing & Publishing
  if (sector.includes('print') || sector.includes('publish') ||
      name.includes('print') || name.includes('publish') || name.includes('press') || name.includes('media print')) {
    return 'Printing & Publishing';
  }

  // Rubber & Rubber Products
  if (sector.includes('rubber') ||
      name.includes('rubber') || name.includes('latex')) {
    return 'Rubber & Rubber Products';
  }

  // Leather & Footwear
  if (sector.includes('leather') || sector.includes('footwear') || sector.includes('shoe') ||
      name.includes('leather') || name.includes('footwear') || name.includes('shoe') || name.includes('sandal')) {
    return 'Leather & Footwear';
  }

  // Wood & Furniture
  if (sector.includes('wood') || sector.includes('furniture') || sector.includes('timber') ||
      name.includes('wood') || name.includes('furniture') || name.includes('timber') || name.includes('ply')) {
    return 'Wood & Furniture';
  }

  // Tobacco & Cigarettes
  if (sector.includes('tobacco') || sector.includes('cigarette') ||
      name.includes('tobacco') || name.includes('cigarette') || name.includes('bidi')) {
    return 'Tobacco & Cigarettes';
  }

  // Breweries & Distilleries
  if (sector.includes('brewery') || sector.includes('distillery') || sector.includes('alcohol') || sector.includes('liquor') ||
      name.includes('brewery') || name.includes('distillery') || name.includes('alcohol') || name.includes('liquor') ||
      name.includes('spirits') || name.includes('wine') || name.includes('beer')) {
    return 'Breweries & Distilleries';
  }

  // Trading & Distribution - VERY COMPREHENSIVE
  if (sector.includes('trading') || sector.includes('distribution') || sector.includes('export') || sector.includes('import') ||
      name.includes('trading') || name.includes('distribution') || name.includes('export') || name.includes('import') ||
      name.includes('merchant') || name.includes('dealer') || name.includes('trader') ||
      name.includes('exim') || name.includes('overseas') || name.includes('international') ||
      name.includes('global') || name.includes('worldwide') || name.includes('commerce') ||
      name.includes('supply') || name.includes('wholesale') || name.includes('distributor')) {
    return 'Trading & Distribution';
  }

  // Consulting & Professional Services
  if (sector.includes('consult') || sector.includes('advisory') || sector.includes('professional services') ||
      name.includes('consult') || name.includes('advisory') || name.includes('services')) {
    return 'Consulting & Professional Services';
  }

  // Security Services
  if (sector.includes('security') || sector.includes('surveillance') ||
      name.includes('security') || name.includes('surveillance') || name.includes('guard')) {
    return 'Security Services';
  }

  // Renewable Energy & Solar
  if (sector.includes('solar') || sector.includes('renewable') || sector.includes('wind energy') ||
      name.includes('solar') || name.includes('renewable') || name.includes('wind') || 
      name.includes('green energy') || name.includes('adani green') || name.includes('tata power renewable') ||
      name.includes('suzlon') || name.includes('inox wind') || name.includes('waaree')) {
    return 'Renewable Energy & Solar';
  }

  // Water Treatment & Management
  if (sector.includes('water') || sector.includes('aqua') ||
      name.includes('water') || name.includes('aqua') || name.includes('hydro')) {
    return 'Water Treatment & Management';
  }

  // Waste Management & Recycling
  if (sector.includes('waste') || sector.includes('recycl') || sector.includes('scrap') ||
      name.includes('waste') || name.includes('recycl') || name.includes('scrap')) {
    return 'Waste Management & Recycling';
  }

  // Pipes & Fittings
  if (sector.includes('pipe') || sector.includes('fitting') ||
      name.includes('pipe') || name.includes('fitting') || name.includes('tube')) {
    return 'Pipes & Fittings';
  }

  // Bearings & Fasteners
  if (sector.includes('bearing') || sector.includes('fastener') || sector.includes('screw') ||
      name.includes('bearing') || name.includes('fastener') || name.includes('screw') || name.includes('bolt')) {
    return 'Bearings & Fasteners';
  }

  // Valves & Pumps
  if (sector.includes('valve') || sector.includes('pump') ||
      name.includes('valve') || name.includes('pump')) {
    return 'Valves & Pumps';
  }

  // Electrical Equipment
  if (sector.includes('electrical') || sector.includes('switch') || sector.includes('transformer') ||
      name.includes('electrical') || name.includes('switch') || name.includes('transformer') ||
      name.includes('relay') || name.includes('circuit')) {
    return 'Electrical Equipment';
  }

  // EXTENSIVE CATCH-ALL PATTERNS - Check everything possible
  
  // Manufacturing & Industries
  if (name.includes('industries') || name.includes('manufacturing') || name.includes('factory')) {
    if (name.includes('food') || name.includes('snack')) return 'FMCG';
    if (name.includes('drug') || name.includes('medic')) return 'Pharmaceuticals & Healthcare';
    if (name.includes('steel') || name.includes('metal')) return 'Metal & Mining';
    if (name.includes('textile') || name.includes('fabric')) return 'Textiles & Apparel';
    if (name.includes('chemical')) return 'Chemicals & Specialty Chemicals';
    return 'Engineering & Capital Goods';
  }
  
  // Mills
  if (name.includes('mills') || name.includes('spinning') || name.includes('weaving')) {
    if (name.includes('paper')) return 'Paper & Packaging';
    if (name.includes('steel')) return 'Metal & Mining';
    return 'Textiles & Apparel';
  }
  
  // Exports & Trading
  if (name.includes('exports') || name.includes('exim') || name.includes('overseas') || 
      name.includes('global') || name.includes('international') || name.includes('trading')) {
    return 'Trading & Distribution';
  }
  
  // Labs & Research
  if (name.includes('laboratories') || name.includes('labs') || name.includes('research')) {
    return 'Pharmaceuticals & Healthcare';
  }
  
  // Polymers & Plastics
  if (name.includes('polymer') || name.includes('plastic') || name.includes('resin') ||
      name.includes('pvc') || name.includes('hdpe') || name.includes('ldpe')) {
    return 'Plastics & Polymers';
  }
  
  // Wires & Cables
  if (name.includes('wire') || name.includes('cable') || name.includes('conductor')) {
    return 'Cables & Wires';
  }
  
  // Ceramics, Tiles, Granite
  if (name.includes('ceramic') || name.includes('tile') || name.includes('granite') || 
      name.includes('marble') || name.includes('stone') || name.includes('vitrified')) {
    return 'Glass & Ceramics';
  }
  
  // Agriculture
  if (name.includes('agro') || name.includes('agri') || name.includes('farm') ||
      name.includes('seed') || name.includes('crop') || name.includes('fertilizer')) {
    return 'Agriculture & Agro Products';
  }
  
  // Pharma & Medical
  if (name.includes('pharma') || name.includes('medic') || name.includes('drug') ||
      name.includes('bio') || name.includes('life sciences') || name.includes('healthcare')) {
    return 'Pharmaceuticals & Healthcare';
  }
  
  // Steel & Metal
  if (name.includes('steel') || name.includes('metal') || name.includes('alloy') ||
      name.includes('iron') || name.includes('alumin') || name.includes('copper')) {
    return 'Metal & Mining';
  }
  
  // Infrastructure & Construction
  if (name.includes('infra') || name.includes('construction') || name.includes('builder') ||
      name.includes('contractor') || name.includes('project')) {
    return 'Infrastructure & Construction';
  }
  
  // Pipes & Tubes
  if (name.includes('pipe') || name.includes('tube') || name.includes('fitting')) {
    return 'Pipes & Fittings';
  }
  
  // Paints & Coatings
  if (name.includes('paint') || name.includes('coating') || name.includes('enamel')) {
    return 'Paints & Coatings';
  }
  
  // Rubber
  if (name.includes('rubber') || name.includes('latex')) {
    return 'Rubber & Rubber Products';
  }
  
  // Glass
  if (name.includes('glass')) {
    return 'Glass & Ceramics';
  }
  
  // Wood & Furniture
  if (name.includes('wood') || name.includes('furniture') || name.includes('ply') ||
      name.includes('timber') || name.includes('veneer')) {
    return 'Wood & Furniture';
  }
  
  // Leather & Footwear
  if (name.includes('leather') || name.includes('footwear') || name.includes('shoe')) {
    return 'Leather & Footwear';
  }
  
  // Printing & Publishing
  if (name.includes('print') || name.includes('publish') || name.includes('press')) {
    return 'Printing & Publishing';
  }
  
  // Bearings & Fasteners
  if (name.includes('bearing') || name.includes('fastener') || name.includes('screw') ||
      name.includes('bolt') || name.includes('nut')) {
    return 'Bearings & Fasteners';
  }
  
  // Valves & Pumps
  if (name.includes('valve') || name.includes('pump')) {
    return 'Valves & Pumps';
  }
  
  // Electrical Equipment
  if (name.includes('electrical') || name.includes('switch') || name.includes('relay') ||
      name.includes('circuit') || name.includes('breaker')) {
    return 'Electrical Equipment';
  }
  
  // Telecom
  if (name.includes('telecom') || name.includes('communication') || name.includes('network')) {
    return 'Telecom';
  }
  
  // Media & Entertainment
  if (name.includes('media') || name.includes('entertainment') || name.includes('film') ||
      name.includes('television') || name.includes('broadcast')) {
    return 'Media & Entertainment';
  }
  
  // Logistics & Transportation
  if (name.includes('logistic') || name.includes('transport') || name.includes('cargo') ||
      name.includes('freight') || name.includes('courier')) {
    return 'Logistics & Transportation';
  }
  
  // Security Services
  if (name.includes('security') || name.includes('surveillance')) {
    return 'Security Services';
  }
  
  // Water Treatment
  if (name.includes('water') || name.includes('aqua')) {
    return 'Water Treatment & Management';
  }
  
  // Waste Management
  if (name.includes('waste') || name.includes('recycl') || name.includes('scrap')) {
    return 'Waste Management & Recycling';
  }
  
  // Consulting & Services
  if (name.includes('consult') || name.includes('advisory') || name.includes('services')) {
    return 'Consulting & Professional Services';
  }
  
  // Gems & Jewellery
  if (name.includes('jewel') || name.includes('gem') || name.includes('diamond') || name.includes('gold')) {
    return 'Gems & Jewellery';
  }
  
  // Breweries & Distilleries
  if (name.includes('brewery') || name.includes('distillery') || name.includes('alcohol') ||
      name.includes('beer') || name.includes('wine') || name.includes('spirits')) {
    return 'Breweries & Distilleries';
  }
  
  // Tobacco
  if (name.includes('tobacco') || name.includes('cigarette')) {
    return 'Tobacco & Cigarettes';
  }

  // Others - default category (should be VERY few now - under 50)
  return 'Others';
};

export default function Sectors() {
  const { stocks } = useStockStore();
  const navigate = useNavigate();
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  // Group stocks by predefined sectors
  const sectorGroups = stocks.reduce((acc, stock) => {
    const sector = categorizeSector(stock.sector, stock.name, stock.symbol);
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(stock);
    return acc;
  }, {} as Record<string, typeof stocks>);

  // Calculate sector performance for all predefined sectors
  const sectorStats = SECTORS.map(sector => {
    const stocks = sectorGroups[sector] || [];
    const avgChange = stocks.length > 0 
      ? stocks.reduce((sum, s) => sum + (s.changePercent || 0), 0) / stocks.length 
      : 0;
    const totalMarketCap = stocks.reduce((sum, s) => sum + (parseFloat(String(s.marketCap)) || 0), 0);
    const gainers = stocks.filter(s => (s.changePercent || 0) > 0).length;
    const losers = stocks.filter(s => (s.changePercent || 0) < 0).length;
    
    return {
      sector,
      stocks,
      count: stocks.length,
      avgChange,
      totalMarketCap,
      gainers,
      losers,
    };
  }).filter(s => s.count > 0); // Only show sectors with stocks

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sector Analysis</h1>
          <p className="text-gray-600 mt-2">Browse stocks by sector and analyze sector performance</p>
        </div>

        {/* Sector Cards */}
        <div className="space-y-4">
          {sectorStats.map(({ sector, stocks, count, avgChange, gainers, losers }) => {
            const isExpanded = expandedSector === sector;
            const isPositive = avgChange >= 0;

            return (
              <Card key={sector} className="bg-white border border-gray-200">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedSector(isExpanded ? null : sector)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-xl text-gray-900">{sector}</CardTitle>
                      <span className="text-sm text-gray-500">({count} stocks)</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* Avg Change */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Avg Change</p>
                        <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{avgChange.toFixed(2)}%
                        </p>
                      </div>

                      {/* Gainers/Losers */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Gainers / Losers</p>
                        <p className="text-sm">
                          <span className="text-green-600 font-medium">{gainers}</span>
                          {' / '}
                          <span className="text-red-600 font-medium">{losers}</span>
                        </p>
                      </div>

                      {/* Expand Icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Stock List */}
                {isExpanded && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stocks.map((stock) => {
                        const stockPositive = (stock.changePercent || 0) >= 0;
                        return (
                          <div
                            key={stock.symbol}
                            onClick={() => navigate(`/stock/${stock.symbol}`)}
                            className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{stock.symbol}</p>
                                <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                              </div>
                              {stockPositive ? (
                                <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">₹{stock.price.toFixed(2)}</span>
                              <span className={`text-sm font-medium ${stockPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {stockPositive ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
