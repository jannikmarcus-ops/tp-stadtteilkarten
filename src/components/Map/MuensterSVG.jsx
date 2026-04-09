import { useState, useEffect, useCallback, useRef, memo } from 'react'

function getDistrictColor(districtId, data) {
  const { colorScale } = data.meta
  const district = data.districts.find(d => d.id === districtId)
  if (!district) return '#E8E4E0'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#E8E4E0'
}

/*
 * V7: Bezier-Redesign aller 26 Muensteraner Stadtteile.
 * Cubic Bezier Curves (C-Kommandos) fuer natuerliche Grenzen.
 * Gemeinsame Grenzen nutzen identische Kontrollpunkte (reversed).
 */

const INTERACTIVE_IDS = new Set([
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
  'nienberge', 'kinderhaus', 'coerde', 'handorf',
  'gremmendorf', 'wolbeck', 'angelmodde', 'hiltrup', 'amelsbueren', 'roxel',
  'sprakel', 'gelmer', 'haeger', 'geist', 'schuetzenhof', 'berg-fidel', 'mecklenbeck', 'albachten',
])

// ═══════════════════════════════════════════
// JUNCTION POINTS (wo 3+ Bezirke aufeinandertreffen)
// Benannt nach angrenzenden Bezirken
// ═══════════════════════════════════════════

// Stadtgrenze-Knotenpunkte (im Uhrzeigersinn von NW)
const BNW  = [95,155]    // NW-Ecke (Haeger/Nienberge/Roxel auf Grenze)
const BN1  = [138,92]    // N-Grenze Haeger West
const BN2  = [125,48]    // N-Grenze Haeger Spitze
const BN3  = [188,25]    // N-Grenze Haeger/Sprakel
const BN4  = [262,18]    // N-Grenze Haeger/Sprakel Uebergang
const BN5  = [340,14]    // N-Grenze Sprakel Mitte
const BN6  = [408,20]    // N-Grenze Sprakel/Gelmer
const BN7  = [458,30]    // N-Grenze Gelmer West
const BNE1 = [522,45]    // NE-Grenze Gelmer
const BNE2 = [578,72]    // NE-Grenze Gelmer/Handorf
const BNE3 = [618,105]   // NE-Ecke Gelmer/Handorf
const BE1  = [655,140]   // E-Grenze Handorf Nord
const BE2  = [692,180]   // E-Grenze Handorf Nase oben
const BE3  = [722,225]   // E-Grenze Handorf Nase Spitze
const BE4  = [735,278]   // E-Grenze Handorf Nase breiteste Stelle
const BE5  = [730,325]   // E-Grenze Handorf
const BE6  = [715,365]   // E-Grenze Handorf Sued
const BE7  = [695,398]   // E-Grenze Handorf/Gremmendorf
const BE8  = [672,425]   // E-Grenze Gremmendorf
const BSE1 = [662,458]   // SE-Grenze Gremmendorf
const BSE2 = [665,498]   // SE-Grenze Gremmendorf/Wolbeck
const BSE3 = [662,538]   // SE-Grenze Wolbeck Nord
const BSE4 = [650,578]   // SE-Grenze Wolbeck
const BSE5 = [632,625]   // SE-Grenze Wolbeck Sued
const BSE6 = [608,662]   // S-Grenze Wolbeck/Hiltrup
const BS1  = [575,692]   // S-Grenze Hiltrup Ost
const BS2  = [530,710]   // S-Grenze Hiltrup
const BS3  = [480,724]   // S-Grenze Hiltrup
const BS4  = [435,730]   // S-Grenze Hiltrup/Amelsbüren
const BS5  = [390,734]   // S-Grenze Amelsbüren
const BS6  = [348,736]   // S-Grenze Amelsbüren Mitte
const BS7  = [305,738]   // S-Grenze Amelsbüren
const BS8  = [268,730]   // S-Grenze Amelsbüren/Albachten
const BSW1 = [235,715]   // SW-Grenze Albachten
const BSW2 = [200,692]   // SW-Grenze Albachten
const BSW3 = [170,660]   // SW-Grenze Albachten
const BSW4 = [145,622]   // SW-Grenze Albachten/Roxel
const BSW5 = [122,578]   // W-Grenze Roxel Sued
const BW1  = [102,532]   // W-Grenze Roxel
const BW2  = [80,480]    // W-Grenze Roxel
const BW3  = [62,430]    // W-Grenze Roxel
const BW4  = [52,378]    // W-Grenze Roxel
const BW5  = [48,328]    // W-Grenze Roxel/Nienberge
const BW6  = [50,278]    // W-Grenze Nienberge
const BW7  = [56,238]    // W-Grenze Nienberge
const BW8  = [68,198]    // NW-Grenze Nienberge

// Innere Knotenpunkte (wo Bezirke intern aufeinandertreffen)
const J_HNS  = [250,128]   // Haeger-Nienberge-Sprakel (intern)
const J_HSK  = [322,105]   // Haeger-Sprakel-Kinderhaus
const J_SGK  = [440,102]   // Sprakel-Gelmer-Kinderhaus-Coerde
const J_GCH  = [562,125]   // Gelmer-Coerde-Handorf
const J_NGK  = [248,192]   // Nienberge-Gievenbeck-Kinderhaus
const J_GKA  = [295,245]   // Gievenbeck-Kinderhaus-Aaseestadt
const J_KCM  = [472,242]   // Kinderhaus-Coerde-Mauritz
const J_CMH  = [552,245]   // Coerde-Mauritz-Handorf

// Zentrum-Block Knotenpunkte
const J_PKA  = [310,282]   // Pluggendorf-Kinderhaus-Aaseestadt (Pluggendorf NW)
const J_PKH  = [365,268]   // Pluggendorf-Kinderhaus-Hafen (Pluggendorf NE / Hafen NW)
const J_HKM  = [430,265]   // Hafen-Kinderhaus-Mauritz (Hafen NE)
const J_HMA  = [438,322]   // Hafen-Mauritz-Altstadt (Hafen SE / Altstadt NE)
const J_AMG  = [428,382]   // Altstadt-Mauritz-Geist (Altstadt SE)
const J_AKG  = [372,395]   // Altstadt-Kreuzviertel-Geist (Altstadt SW)
const J_KAS  = [318,378]   // Kreuzviertel-Aaseestadt-Sentrup (Kreuzviertel SW)
const J_PAK  = [305,328]   // Pluggendorf-Aaseestadt-Kreuzviertel (Pluggendorf SW)
const J_CEN  = [372,328]   // Zentrum-Kreuz (Pluggendorf-Hafen-Altstadt-Kreuzviertel)
const J_SKG  = [348,388]   // Sentrup-Kreuzviertel-Geist Grenzpunkt

// Aaseestadt Ecken
const J_AAW  = [282,285]   // Aaseestadt NW (Gievenbeck-Aaseestadt-Kinderhaus)
const J_AAS  = [278,328]   // Aaseestadt W (Gievenbeck-Aaseestadt)
const J_AASW = [290,368]   // Aaseestadt SW (Gievenbeck-Aaseestadt-Sentrup)

// Sued-Zone Knotenpunkte
const J_GSM  = [262,420]   // Gievenbeck-Sentrup-Mecklenbeck
const J_SMB  = [340,455]   // Sentrup-Mecklenbeck-Berg Fidel
const J_SGB  = [385,452]   // Sentrup-Geist-Berg Fidel
const J_MGS  = [435,412]   // Mauritz-Geist-Schuetzenhof
const J_GSB  = [432,460]   // Geist-Schuetzenhof-Berg Fidel
const J_MSH  = [492,422]   // Mauritz-Schuetzenhof-Handorf
const J_HSG  = [552,430]   // Handorf-Schuetzenhof-Gremmendorf
const J_SBA  = [500,468]   // Schuetzenhof-Berg Fidel-Gremmendorf-Angelmodde
const J_MBH  = [345,540]   // Mecklenbeck-Berg Fidel-Hiltrup
const J_BAH  = [448,550]   // Berg Fidel-Angelmodde-Hiltrup
const J_GAW  = [545,540]   // Gremmendorf-Angelmodde-Wolbeck
const J_WAH  = [540,632]   // Wolbeck-Angelmodde-Hiltrup
const J_MAM  = [290,542]   // Mecklenbeck-Albachten-Amelsbüren
const J_MHA  = [358,625]   // Mecklenbeck-Hiltrup-Amelsbüren
const J_MRG  = [222,478]   // Mecklenbeck-Roxel-Gievenbeck
const J_RAM  = [175,548]   // Roxel-Albachten-Mecklenbeck
const J_AAB  = [212,638]   // Albachten-Amelsbüren

// Weitere gemeinsame Grenzpunkte (von 2-3 Bezirken geteilt)
const J_NGR  = [172,258]   // Nienberge-Gievenbeck-Roxel Dreieck
const J_GRB  = [185,348]   // Gievenbeck-Roxel Südgrenze
const J_MHI  = [558,360]   // Mauritz-Handorf innere Grenze
const J_KAA  = [305,345]   // Kreuzviertel-Aaseestadt Grenze
const J_AAG  = [278,335]   // Aaseestadt-Gievenbeck Westgrenze

// ═══════════════════════════════════════════
// ALLE 26 STADTTEILE als Bezier-Pfade
// ═══════════════════════════════════════════

const ALL_DISTRICTS = [
  // ── ZENTRUM (4 kleine Bezirke) ──
  {
    id: 'pluggendorf',
    path: `M${J_PKA[0]},${J_PKA[1]} C320,272 340,265 ${J_PKH[0]},${J_PKH[1]} C370,310 374,318 ${J_CEN[0]},${J_CEN[1]} C350,330 325,332 ${J_PAK[0]},${J_PAK[1]} C305,310 308,292 ${J_PKA[0]},${J_PKA[1]} Z`
  },
  {
    id: 'hafen-zentrum',
    path: `M${J_PKH[0]},${J_PKH[1]} C385,262 410,260 ${J_HKM[0]},${J_HKM[1]} C435,285 438,305 ${J_HMA[0]},${J_HMA[1]} C420,325 395,328 ${J_CEN[0]},${J_CEN[1]} C374,318 370,310 ${J_PKH[0]},${J_PKH[1]} Z`
  },
  {
    id: 'altstadt-dom',
    path: `M${J_CEN[0]},${J_CEN[1]} C395,328 420,325 ${J_HMA[0]},${J_HMA[1]} C440,345 435,368 ${J_AMG[0]},${J_AMG[1]} C410,390 390,395 ${J_AKG[0]},${J_AKG[1]} C372,380 372,355 ${J_CEN[0]},${J_CEN[1]} Z`
  },
  {
    id: 'kreuzviertel',
    path: `M${J_PAK[0]},${J_PAK[1]} C325,332 350,330 ${J_CEN[0]},${J_CEN[1]} C372,355 372,380 ${J_AKG[0]},${J_AKG[1]} C365,392 355,390 ${J_SKG[0]},${J_SKG[1]} C338,385 325,382 ${J_KAS[0]},${J_KAS[1]} C310,360 ${J_KAA[0]},${J_KAA[1]} ${J_PAK[0]},${J_PAK[1]} Z`
  },

  // ── INNERER RING ──
  {
    id: 'aaseestadt',
    path: `M${J_AAW[0]},${J_AAW[1]} C288,282 300,280 ${J_PKA[0]},${J_PKA[1]} C308,292 305,310 ${J_PAK[0]},${J_PAK[1]} C310,360 ${J_KAA[0]},${J_KAA[1]} ${J_KAS[0]},${J_KAS[1]} C308,372 295,370 ${J_AASW[0]},${J_AASW[1]} C282,350 ${J_AAG[0]},${J_AAG[1]} ${J_AAS[0]},${J_AAS[1]} C280,308 280,295 ${J_AAW[0]},${J_AAW[1]} Z`
  },
  {
    id: 'sentrup',
    path: `M${J_AASW[0]},${J_AASW[1]} C295,370 308,372 ${J_KAS[0]},${J_KAS[1]} C325,382 338,385 ${J_SKG[0]},${J_SKG[1]} C355,395 365,420 ${J_SGB[0]},${J_SGB[1]} C370,455 355,458 ${J_SMB[0]},${J_SMB[1]} C320,445 300,438 ${J_GSM[0]},${J_GSM[1]} C268,405 275,390 ${J_AASW[0]},${J_AASW[1]} Z`
  },
  {
    id: 'mauritz',
    path: `M${J_HKM[0]},${J_HKM[1]} C445,258 458,248 ${J_KCM[0]},${J_KCM[1]} C495,242 525,242 ${J_CMH[0]},${J_CMH[1]} C555,280 558,320 ${J_MHI[0]},${J_MHI[1]} C${J_MHI[0]},385 555,400 ${J_MSH[0]},${J_MSH[1]} C480,418 460,415 ${J_MGS[0]},${J_MGS[1]} C432,400 430,388 ${J_AMG[0]},${J_AMG[1]} C435,368 440,345 ${J_HMA[0]},${J_HMA[1]} C438,305 435,285 ${J_HKM[0]},${J_HKM[1]} Z`
  },
  {
    id: 'gievenbeck',
    path: `M${J_NGK[0]},${J_NGK[1]} C260,210 275,225 ${J_GKA[0]},${J_GKA[1]} C292,255 288,270 ${J_AAW[0]},${J_AAW[1]} C280,295 280,308 ${J_AAS[0]},${J_AAS[1]} C282,350 ${J_AAG[0]},${J_AAG[1]} ${J_AASW[0]},${J_AASW[1]} C275,390 268,405 ${J_GSM[0]},${J_GSM[1]} C248,435 235,455 ${J_MRG[0]},${J_MRG[1]} C205,410 192,380 ${J_GRB[0]},${J_GRB[1]} C178,318 175,288 ${J_NGR[0]},${J_NGR[1]} C170,230 175,210 ${J_NGK[0]},${J_NGK[1]} Z`
  },

  // ── GEIST / SCHUETZENHOF / BERG FIDEL / MECKLENBECK ──
  {
    id: 'geist',
    path: `M${J_SKG[0]},${J_SKG[1]} C355,390 365,392 ${J_AKG[0]},${J_AKG[1]} C390,395 410,390 ${J_AMG[0]},${J_AMG[1]} C430,388 432,400 ${J_MGS[0]},${J_MGS[1]} C435,425 434,445 ${J_GSB[0]},${J_GSB[1]} C418,455 400,455 ${J_SGB[0]},${J_SGB[1]} C365,420 355,395 ${J_SKG[0]},${J_SKG[1]} Z`
  },
  {
    id: 'schuetzenhof',
    path: `M${J_MGS[0]},${J_MGS[1]} C460,415 480,418 ${J_MSH[0]},${J_MSH[1]} C510,425 535,428 ${J_HSG[0]},${J_HSG[1]} C540,445 520,460 ${J_SBA[0]},${J_SBA[1]} C480,465 455,462 ${J_GSB[0]},${J_GSB[1]} C434,445 435,425 ${J_MGS[0]},${J_MGS[1]} Z`
  },
  {
    id: 'berg-fidel',
    path: `M${J_SMB[0]},${J_SMB[1]} C355,458 370,455 ${J_SGB[0]},${J_SGB[1]} C400,455 418,455 ${J_GSB[0]},${J_GSB[1]} C455,462 480,465 ${J_SBA[0]},${J_SBA[1]} C502,490 490,520 ${J_BAH[0]},${J_BAH[1]} C420,548 380,542 ${J_MBH[0]},${J_MBH[1]} C340,535 340,510 ${J_SMB[0]},${J_SMB[1]} Z`
  },
  {
    id: 'mecklenbeck',
    path: `M${J_MRG[0]},${J_MRG[1]} C235,455 248,435 ${J_GSM[0]},${J_GSM[1]} C300,438 320,445 ${J_SMB[0]},${J_SMB[1]} C340,510 340,535 ${J_MBH[0]},${J_MBH[1]} C345,580 340,600 ${J_MHA[0]},${J_MHA[1]} C330,610 310,570 ${J_MAM[0]},${J_MAM[1]} C270,538 245,530 ${J_RAM[0]},${J_RAM[1]} C185,520 200,498 ${J_MRG[0]},${J_MRG[1]} Z`
  },

  // ── AEUSSERE BEZIRKE (Nord) ──
  {
    id: 'haeger',
    path: `M${BNW[0]},${BNW[1]} C100,140 115,115 ${BN1[0]},${BN1[1]} C145,72 130,52 ${BN2[0]},${BN2[1]} C140,35 160,28 ${BN3[0]},${BN3[1]} C210,22 238,18 ${BN4[0]},${BN4[1]} C285,30 305,60 ${J_HSK[0]},${J_HSK[1]} C300,115 275,125 ${J_HNS[0]},${J_HNS[1]} C210,140 155,150 ${BNW[0]},${BNW[1]} Z`
  },
  {
    id: 'sprakel',
    path: `M${J_HSK[0]},${J_HSK[1]} C305,60 285,30 ${BN4[0]},${BN4[1]} C290,16 315,14 ${BN5[0]},${BN5[1]} C365,14 390,18 ${BN6[0]},${BN6[1]} C425,22 442,26 ${BN7[0]},${BN7[1]} C452,50 448,78 ${J_SGK[0]},${J_SGK[1]} C420,100 370,105 ${J_HSK[0]},${J_HSK[1]} Z`
  },
  {
    id: 'gelmer',
    path: `M${J_SGK[0]},${J_SGK[1]} C448,78 452,50 ${BN7[0]},${BN7[1]} C478,35 500,40 ${BNE1[0]},${BNE1[1]} C545,50 562,62 ${BNE2[0]},${BNE2[1]} C595,82 610,98 ${BNE3[0]},${BNE3[1]} C612,112 590,122 ${J_GCH[0]},${J_GCH[1]} C535,120 490,108 ${J_SGK[0]},${J_SGK[1]} Z`
  },
  {
    id: 'albachten',
    path: `M${J_RAM[0]},${J_RAM[1]} C245,530 270,538 ${J_MAM[0]},${J_MAM[1]} C295,570 280,610 ${J_AAB[0]},${J_AAB[1]} C220,660 235,710 ${BSW1[0]},${BSW1[1]} C218,705 205,695 ${BSW2[0]},${BSW2[1]} C185,675 175,665 ${BSW3[0]},${BSW3[1]} C158,645 150,630 ${BSW4[0]},${BSW4[1]} C135,600 128,582 ${BSW5[0]},${BSW5[1]} C118,562 115,548 ${J_RAM[0]},${J_RAM[1]} Z`
  },

  // ── AEUSSERER RING ──
  {
    id: 'nienberge',
    path: `M${BNW[0]},${BNW[1]} C155,150 210,140 ${J_HNS[0]},${J_HNS[1]} C255,145 252,170 ${J_NGK[0]},${J_NGK[1]} C175,210 170,230 ${J_NGR[0]},${J_NGR[1]} C170,248 115,225 ${BW8[0]},${BW8[1]} C78,172 88,162 ${BNW[0]},${BNW[1]} Z`
  },
  {
    id: 'kinderhaus',
    path: `M${J_HNS[0]},${J_HNS[1]} C275,125 300,115 ${J_HSK[0]},${J_HSK[1]} C370,105 420,100 ${J_SGK[0]},${J_SGK[1]} C460,115 468,145 ${J_KCM[0]},${J_KCM[1]} C465,255 450,262 ${J_HKM[0]},${J_HKM[1]} C410,260 385,262 ${J_PKH[0]},${J_PKH[1]} C340,265 320,272 ${J_PKA[0]},${J_PKA[1]} C300,280 288,282 ${J_AAW[0]},${J_AAW[1]} C288,270 292,255 ${J_GKA[0]},${J_GKA[1]} C275,225 260,210 ${J_NGK[0]},${J_NGK[1]} C252,170 255,145 ${J_HNS[0]},${J_HNS[1]} Z`
  },
  {
    id: 'coerde',
    path: `M${J_SGK[0]},${J_SGK[1]} C490,108 535,120 ${J_GCH[0]},${J_GCH[1]} C568,145 558,185 ${J_CMH[0]},${J_CMH[1]} C525,242 495,242 ${J_KCM[0]},${J_KCM[1]} C468,145 460,115 ${J_SGK[0]},${J_SGK[1]} Z`
  },
  {
    id: 'handorf',
    path: `M${J_GCH[0]},${J_GCH[1]} C590,122 612,112 ${BNE3[0]},${BNE3[1]} C628,115 642,128 ${BE1[0]},${BE1[1]} C668,155 685,172 ${BE2[0]},${BE2[1]} C705,195 718,215 ${BE3[0]},${BE3[1]} C732,245 736,268 ${BE4[0]},${BE4[1]} C735,298 732,315 ${BE5[0]},${BE5[1]} C725,345 720,358 ${BE6[0]},${BE6[1]} C708,382 700,392 ${BE7[0]},${BE7[1]} C688,410 678,420 ${BE8[0]},${BE8[1]} C668,430 660,432 ${J_HSG[0]},${J_HSG[1]} C535,428 510,425 ${J_MSH[0]},${J_MSH[1]} C555,400 ${J_MHI[0]},385 ${J_MHI[0]},${J_MHI[1]} C${J_MHI[0]},320 555,280 ${J_CMH[0]},${J_CMH[1]} C558,185 568,145 ${J_GCH[0]},${J_GCH[1]} Z`
  },
  {
    id: 'gremmendorf',
    path: `M${J_HSG[0]},${J_HSG[1]} C660,432 668,430 ${BE8[0]},${BE8[1]} C672,440 668,452 ${BSE1[0]},${BSE1[1]} C664,475 666,492 ${BSE2[0]},${BSE2[1]} C666,518 664,532 ${BSE3[0]},${BSE3[1]} C658,535 555,538 ${J_GAW[0]},${J_GAW[1]} C530,515 520,490 ${J_SBA[0]},${J_SBA[1]} C520,460 540,445 ${J_HSG[0]},${J_HSG[1]} Z`
  },
  {
    id: 'wolbeck',
    path: `M${J_GAW[0]},${J_GAW[1]} C555,538 658,535 ${BSE3[0]},${BSE3[1]} C660,555 655,572 ${BSE4[0]},${BSE4[1]} C642,605 638,618 ${BSE5[0]},${BSE5[1]} C622,645 615,655 ${BSE6[0]},${BSE6[1]} C600,672 585,685 ${BS1[0]},${BS1[1]} C565,692 555,665 ${J_WAH[0]},${J_WAH[1]} C542,610 545,575 ${J_GAW[0]},${J_GAW[1]} Z`
  },
  {
    id: 'angelmodde',
    path: `M${J_SBA[0]},${J_SBA[1]} C520,490 530,515 ${J_GAW[0]},${J_GAW[1]} C545,575 542,610 ${J_WAH[0]},${J_WAH[1]} C525,618 490,570 ${J_BAH[0]},${J_BAH[1]} C490,520 502,490 ${J_SBA[0]},${J_SBA[1]} Z`
  },
  {
    id: 'hiltrup',
    path: `M${J_MBH[0]},${J_MBH[1]} C380,542 420,548 ${J_BAH[0]},${J_BAH[1]} C490,570 525,618 ${J_WAH[0]},${J_WAH[1]} C555,665 565,692 ${BS1[0]},${BS1[1]} C555,700 540,708 ${BS2[0]},${BS2[1]} C510,718 495,722 ${BS3[0]},${BS3[1]} C462,728 448,730 ${BS4[0]},${BS4[1]} C418,732 405,734 ${BS5[0]},${BS5[1]} C378,730 368,650 ${J_MHA[0]},${J_MHA[1]} C340,600 345,580 ${J_MBH[0]},${J_MBH[1]} Z`
  },
  {
    id: 'amelsbueren',
    path: `M${J_MHA[0]},${J_MHA[1]} C368,650 378,730 ${BS5[0]},${BS5[1]} C375,736 362,736 ${BS6[0]},${BS6[1]} C332,738 318,738 ${BS7[0]},${BS7[1]} C290,735 278,732 ${BS8[0]},${BS8[1]} C255,725 242,718 ${BSW1[0]},${BSW1[1]} C235,710 220,660 ${J_AAB[0]},${J_AAB[1]} C280,610 295,570 ${J_MAM[0]},${J_MAM[1]} C310,570 330,610 ${J_MHA[0]},${J_MHA[1]} Z`
  },
  {
    id: 'roxel',
    path: `M${BW8[0]},${BW8[1]} C115,225 170,248 ${J_NGR[0]},${J_NGR[1]} C175,288 178,318 ${J_GRB[0]},${J_GRB[1]} C192,380 205,410 ${J_MRG[0]},${J_MRG[1]} C200,498 185,520 ${J_RAM[0]},${J_RAM[1]} C115,548 118,562 ${BSW5[0]},${BSW5[1]} C115,555 108,538 ${BW1[0]},${BW1[1]} C92,510 85,492 ${BW2[0]},${BW2[1]} C72,458 65,438 ${BW3[0]},${BW3[1]} C58,408 54,388 ${BW4[0]},${BW4[1]} C50,358 48,338 ${BW5[0]},${BW5[1]} C50,310 50,290 ${BW6[0]},${BW6[1]} C52,265 54,250 ${BW7[0]},${BW7[1]} C58,225 62,210 ${BW8[0]},${BW8[1]} Z`
  },
]

// Pfade direkt aus den path-Strings
const PATHS = ALL_DISTRICTS.map(d => ({
  id: d.id,
  path: d.path,
  interactive: INTERACTIVE_IDS.has(d.id),
}))

// Stadtgrenze als Bezier-Pfad (Aussenkante aller Randbezirke)
const CITY_BOUNDARY = `M${BNW[0]},${BNW[1]} C100,140 115,115 ${BN1[0]},${BN1[1]} C145,72 130,52 ${BN2[0]},${BN2[1]} C140,35 160,28 ${BN3[0]},${BN3[1]} C210,22 238,18 ${BN4[0]},${BN4[1]} C290,16 315,14 ${BN5[0]},${BN5[1]} C365,14 390,18 ${BN6[0]},${BN6[1]} C425,22 442,26 ${BN7[0]},${BN7[1]} C478,35 500,40 ${BNE1[0]},${BNE1[1]} C545,50 562,62 ${BNE2[0]},${BNE2[1]} C595,82 610,98 ${BNE3[0]},${BNE3[1]} C628,115 642,128 ${BE1[0]},${BE1[1]} C668,155 685,172 ${BE2[0]},${BE2[1]} C705,195 718,215 ${BE3[0]},${BE3[1]} C732,245 736,268 ${BE4[0]},${BE4[1]} C735,298 732,315 ${BE5[0]},${BE5[1]} C725,345 720,358 ${BE6[0]},${BE6[1]} C708,382 700,392 ${BE7[0]},${BE7[1]} C688,410 678,420 ${BE8[0]},${BE8[1]} C672,440 668,452 ${BSE1[0]},${BSE1[1]} C664,475 666,492 ${BSE2[0]},${BSE2[1]} C666,518 664,532 ${BSE3[0]},${BSE3[1]} C660,555 655,572 ${BSE4[0]},${BSE4[1]} C642,605 638,618 ${BSE5[0]},${BSE5[1]} C622,645 615,655 ${BSE6[0]},${BSE6[1]} C600,672 585,685 ${BS1[0]},${BS1[1]} C555,700 540,708 ${BS2[0]},${BS2[1]} C510,718 495,722 ${BS3[0]},${BS3[1]} C462,728 448,730 ${BS4[0]},${BS4[1]} C418,732 405,734 ${BS5[0]},${BS5[1]} C375,736 362,736 ${BS6[0]},${BS6[1]} C332,738 318,738 ${BS7[0]},${BS7[1]} C290,735 278,732 ${BS8[0]},${BS8[1]} C255,725 242,718 ${BSW1[0]},${BSW1[1]} C218,705 205,695 ${BSW2[0]},${BSW2[1]} C185,675 175,665 ${BSW3[0]},${BSW3[1]} C158,645 150,630 ${BSW4[0]},${BSW4[1]} C135,600 128,582 ${BSW5[0]},${BSW5[1]} C115,555 108,538 ${BW1[0]},${BW1[1]} C92,510 85,492 ${BW2[0]},${BW2[1]} C72,458 65,438 ${BW3[0]},${BW3[1]} C58,408 54,388 ${BW4[0]},${BW4[1]} C50,358 48,338 ${BW5[0]},${BW5[1]} C50,310 50,290 ${BW6[0]},${BW6[1]} C52,265 54,250 ${BW7[0]},${BW7[1]} C58,225 62,210 ${BW8[0]},${BW8[1]} C78,172 88,162 ${BNW[0]},${BNW[1]} Z`

const DARK_DISTRICTS = new Set([
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'sentrup', 'mauritz', 'geist', 'schuetzenhof',
])

// Labels für interaktive Viertel
const INTERACTIVE_LABELS = [
  { id: 'pluggendorf',   x: 340, y: 300, lines: ['Pluggen-', 'dorf'],   size: 7 },
  { id: 'hafen-zentrum',  x: 400, y: 292, lines: ['Hafen'],             size: 7 },
  { id: 'altstadt-dom',   x: 400, y: 358, lines: ['Altstadt'],          size: 8 },
  { id: 'kreuzviertel',   x: 340, y: 358, lines: ['Kreuz-', 'viertel'],size: 7 },
  { id: 'aaseestadt',     x: 232, y: 310, lines: ['Aasee-', 'stadt'],  size: 8, leader: [282, 328] },
  { id: 'sentrup',        x: 325, y: 418, lines: ['Sentrup'],           size: 10 },
  { id: 'mauritz',        x: 498, y: 328, lines: ['Mauritz'],           size: 11 },
  { id: 'gievenbeck',     x: 218, y: 345, lines: ['Gieven-', 'beck'],  size: 10 },
  { id: 'nienberge',      x: 168, y: 195, lines: ['Nienberge'],         size: 10 },
  { id: 'kinderhaus',     x: 365, y: 188, lines: ['Kinderhaus'],        size: 10 },
  { id: 'coerde',         x: 502, y: 178, lines: ['Coerde'],            size: 10 },
  { id: 'handorf',        x: 655, y: 285, lines: ['Handorf'],           size: 14 },
  { id: 'gremmendorf',    x: 598, y: 492, lines: ['Gremmen-', 'dorf'], size: 10 },
  { id: 'wolbeck',        x: 602, y: 612, lines: ['Wolbeck'],           size: 11 },
  { id: 'angelmodde',     x: 510, y: 565, lines: ['Angel-', 'modde'],  size: 8 },
  { id: 'hiltrup',        x: 462, y: 665, lines: ['Hiltrup'],           size: 13 },
  { id: 'amelsbueren',    x: 328, y: 688, lines: ['Amels-', 'büren'],  size: 10 },
  { id: 'roxel',          x: 115, y: 418, lines: ['Roxel'],             size: 11 },
  // Ehemals graue Viertel (jetzt interaktiv)
  { id: 'haeger',         x: 200, y: 85,  lines: ['Häger'],             size: 10 },
  { id: 'sprakel',        x: 382, y: 65,  lines: ['Sprakel'],           size: 10 },
  { id: 'gelmer',         x: 530, y: 82,  lines: ['Gelmer'],            size: 10 },
  { id: 'geist',          x: 398, y: 425, lines: ['Geist'],             size: 9 },
  { id: 'schuetzenhof',   x: 492, y: 442, lines: ['Schützen-', 'hof'], size: 8 },
  { id: 'berg-fidel',     x: 422, y: 502, lines: ['Berg', 'Fidel'],    size: 8 },
  { id: 'mecklenbeck',    x: 278, y: 498, lines: ['Mecklen-', 'beck'], size: 9 },
  { id: 'albachten',      x: 188, y: 618, lines: ['Albachten'],         size: 10 },
]

/** Einzelner klickbarer Bezirk-Pfad. React.memo verhindert Re-Renders bei Hover anderer Viertel. */
const DistrictPath = memo(function DistrictPath({
  id, d, fill, label, isSelected, isHovered, isDimmed, loaded, staggerDelay,
  onClick, onMouseEnter, onMouseLeave,
}) {
  return (
    <path
      id={id}
      role="listitem"
      tabIndex={0}
      aria-label={`Stadtteil ${label}`}
      d={d}
      fill={fill}
      stroke="#D1CDC9"
      strokeWidth="1.5"
      strokeLinejoin="round"
      style={{
        cursor: 'pointer',
        outline: 'none',
        opacity: loaded ? (isDimmed ? 0.6 : (isHovered ? 0.85 : 1)) : 0,
        transition: loaded
          ? 'opacity 150ms ease, filter 150ms ease'
          : `opacity 400ms ease ${staggerDelay}ms`,
        filter: isHovered && !isSelected ? 'brightness(1.15)' : undefined,
      }}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(id) } }}
      onMouseEnter={() => onMouseEnter?.(id)}
      onMouseLeave={() => onMouseLeave?.()}
      onFocus={() => onMouseEnter?.(id)}
      onBlur={() => onMouseLeave?.()}
    />
  )
})

// Stagger: Zentrum zuerst, dann Ring für Ring
const STAGGER_ORDER = [
  'altstadt-dom', 'kreuzviertel', 'pluggendorf', 'hafen-zentrum',
  'aaseestadt', 'sentrup', 'mauritz', 'gievenbeck',
  'geist', 'schuetzenhof',
  'kinderhaus', 'coerde', 'nienberge',
  'berg-fidel', 'mecklenbeck',
  'handorf', 'gremmendorf', 'angelmodde', 'wolbeck',
  'hiltrup', 'amelsbueren', 'roxel',
  'haeger', 'sprakel', 'gelmer', 'albachten',
]

export function MuensterSVG({
  data,
  selectedId = null,
  hoveredId = null,
  onDistrictClick,
  onDistrictHover,
  onDistrictLeave,
  onDistrictRect,
}) {
  const [loaded, setLoaded] = useState(false)
  const svgRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleMouseEnter = useCallback((id) => {
    onDistrictHover?.(id)
    if (onDistrictRect && svgRef.current) {
      const el = svgRef.current.querySelector(`#${CSS.escape(id)}`)
      if (el) onDistrictRect(el.getBoundingClientRect())
    }
  }, [onDistrictHover, onDistrictRect])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 780"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
      role="img"
      aria-label="Stadtteil-Karte Münster mit Immobilienpreisen"
    >
      {/* SCHICHT 1: Stadtgrenze als Hintergrund-Fang */}
      <path d={CITY_BOUNDARY} fill="#E8E4E0" stroke="#B8B4B0" strokeWidth="2" strokeLinejoin="round" />

      {/* SCHICHT 2: Alle 26 interaktive Viertel */}
      <g className="interactive-districts" role="list">
        {PATHS.map(({ id, path: d }) => (
          <DistrictPath
            key={id}
            id={id}
            d={d}
            fill={getDistrictColor(id, data)}
            label={data.districts.find(dd => dd.id === id)?.name || id}
            isSelected={selectedId === id}
            isHovered={hoveredId === id}
            isDimmed={!!(selectedId && selectedId !== id)}
            loaded={loaded}
            staggerDelay={STAGGER_ORDER.indexOf(id) * 30}
            onClick={onDistrictClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onDistrictLeave}
          />
        ))}
      </g>

      {/* SCHICHT 3: Führungslinien */}
      <g style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
        {INTERACTIVE_LABELS.filter(l => l.leader).map(({ id, x, y, leader }) => (
          <line key={`l-${id}`} x1={x + 38} y1={y} x2={leader[0]} y2={leader[1]} stroke="#999" strokeWidth="1" />
        ))}
      </g>

      {/* SCHICHT 4: Labels */}
      <g fontFamily="'DM Sans', system-ui, sans-serif" style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
        {INTERACTIVE_LABELS.map(({ id, x, y, lines, size }) => (
          <text key={id} textAnchor="middle" fontSize={size} fontWeight="500" fill={DARK_DISTRICTS.has(id) ? '#F5F2F0' : '#333'}>
            {lines.map((line, i) => (
              <tspan key={i} x={x} y={y + i * (size * 1.2)}>{line}</tspan>
            ))}
          </text>
        ))}
      </g>
    </svg>
  )
}

export { PATHS as DISTRICT_PATHS, INTERACTIVE_LABELS as DISTRICT_LABELS, CITY_BOUNDARY }
