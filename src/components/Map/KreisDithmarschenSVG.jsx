import { useState, useEffect, useCallback, useRef, memo } from 'react'

function getDistrictColor(districtId, data) {
  const { colorScale } = data.meta
  const district = data.districts.find(d => d.id === districtId)
  if (!district) return '#EDEAE5'
  const price = district.prices.etwPerSqm
  const scale = colorScale.find(s => price >= s.min && price <= s.max)
  return scale ? scale.color : '#EDEAE5'
}

// ═══════════════════════════════════════════
// Kreis Dithmarschen SVG Karte (23 Gemeinden)
// Layer: Wasser → Nachbarkreise → Kreis-Canvas → Gemeinden → Labels
// ═══════════════════════════════════════════

const VIEW_W = 800
const VIEW_H = 1105

const KREIS_PATH = 'M 47.6,786.1 L 68.5,750.2 L 149.3,776.4 L 216.1,739.7 L 215.2,699.6 L 185.2,703.2 L 213.9,693.5 L 176.6,647.9 L 151.8,568.4 L 112.1,562.5 L 67.9,591.1 L 7.6,475.0 L 18.7,421.6 L 46.8,384.3 L 48.5,291.7 L 118.4,298.3 L 122.2,250.6 L 230.5,153.8 L 216.0,105.2 L 243.6,64.1 L 327.6,94.7 L 347.4,79.7 L 420.4,147.2 L 411.4,178.3 L 432.2,186.8 L 444.5,186.2 L 431.5,167.0 L 446.1,152.0 L 472.2,157.9 L 467.9,190.4 L 507.5,176.2 L 501.4,127.2 L 549.5,132.5 L 570.2,171.9 L 566.1,205.0 L 548.8,212.2 L 581.7,272.7 L 670.0,263.6 L 688.1,234.2 L 768.3,334.8 L 750.5,407.2 L 764.5,438.2 L 748.3,449.7 L 766.6,480.2 L 601.7,578.1 L 613.2,592.3 L 613.8,684.3 L 602.1,747.0 L 579.0,756.2 L 602.4,795.7 L 595.0,847.4 L 489.2,968.4 L 478.4,1042.6 L 494.3,1055.2 L 475.4,1058.1 L 476.7,1079.4 L 264.7,1080.6 L 259.9,1038.3 L 207.4,1054.7 L 139.8,986.4 L 97.9,893.0 L 118.5,864.7 L 73.0,843.0 L 47.6,786.1 Z'

const KANAL_PATH = 'M 399.3,1099.9 L 401.7,1079.5 L 404.0,1055.0 L 423.2,1028.5 L 453.1,997.9 L 500.9,957.0 L 560.7,916.2 L 632.4,865.2 L 692.2,793.7'

const NEIGHBORS = [
  { id: 'schleswig-flensburg', path: 'M 1122.7,-846.0 L 1256.9,-704.6 L 1286.1,-701.7 L 1326.0,-793.4 L 1382.4,-756.9 L 1421.2,-630.0 L 1477.9,-566.5 L 1473.8,-520.2 L 1485.8,-511.2 L 1470.6,-465.2 L 1396.9,-486.1 L 1391.0,-442.8 L 1358.3,-466.0 L 1353.4,-444.1 L 1147.5,-302.7 L 1091.7,-224.5 L 1042.8,-217.4 L 1044.9,-171.7 L 988.9,-117.8 L 1005.2,-91.4 L 898.3,-40.0 L 906.8,10.6 L 892.0,18.5 L 914.5,74.4 L 902.9,106.2 L 806.9,148.0 L 734.6,127.8 L 704.0,172.7 L 718.8,176.7 L 722.6,223.7 L 708.0,217.0 L 724.2,227.2 L 708.7,244.8 L 582.2,273.0 L 548.8,212.2 L 566.1,205.0 L 570.2,171.9 L 548.7,132.3 L 501.4,127.2 L 507.5,176.2 L 465.4,189.7 L 473.1,160.1 L 448.1,151.4 L 444.3,121.6 L 487.1,92.6 L 486.3,47.1 L 552.5,74.9 L 553.1,19.6 L 625.1,-68.1 L 629.0,-96.0 L 573.5,-216.7 L 601.5,-248.7 L 588.0,-260.5 L 609.4,-307.9 L 537.2,-346.6 L 557.1,-397.0 L 485.3,-454.4 L 504.1,-487.7 L 450.2,-532.4 L 443.7,-592.8 L 386.5,-575.0 L 312.2,-595.7 L 336.3,-614.8 L 322.7,-673.3 L 331.4,-708.8 L 370.0,-733.9 L 381.6,-774.4 L 356.4,-829.1 L 330.1,-833.2 L 365.3,-860.7 L 373.3,-948.8 L 525.2,-900.4 L 519.9,-861.9 L 536.9,-818.1 L 590.5,-801.8 L 648.8,-798.9 L 695.6,-878.4 L 729.5,-884.5 L 772.8,-850.8 L 721.6,-844.5 L 727.3,-795.4 L 665.1,-759.5 L 690.5,-702.8 L 784.8,-701.4 L 805.2,-740.5 L 843.1,-743.4 L 844.3,-812.8 L 815.3,-874.1 L 936.3,-974.2 L 988.8,-961.3 L 960.9,-909.7 L 1122.7,-846.0 Z' },
  { id: 'steinburg', path: 'M 743.2,1364.0 L 818.9,1431.2 L 935.9,1402.0 L 912.6,1341.8 L 1005.7,1297.4 L 1029.2,1237.6 L 1048.0,1147.1 L 1023.1,1127.9 L 1010.0,1081.8 L 1136.9,1053.2 L 1153.3,1031.3 L 1142.7,978.1 L 1211.5,948.3 L 1204.2,911.1 L 1179.2,908.6 L 1167.3,872.9 L 1198.5,871.3 L 1229.9,913.3 L 1236.9,876.8 L 1224.5,854.1 L 1272.8,810.7 L 1211.0,787.9 L 1217.2,746.3 L 1200.0,731.6 L 1096.6,747.9 L 1053.9,731.3 L 1051.9,705.2 L 1024.2,738.7 L 961.4,734.9 L 964.7,696.7 L 945.9,692.9 L 936.2,655.8 L 867.1,631.0 L 827.5,661.0 L 780.2,655.7 L 739.5,707.4 L 722.8,690.7 L 610.0,705.2 L 602.1,747.0 L 579.0,755.8 L 602.4,795.7 L 592.8,855.4 L 489.2,968.4 L 478.4,1042.6 L 494.3,1055.2 L 475.4,1058.1 L 476.7,1079.4 L 619.9,1138.9 L 743.2,1364.0 Z' },
  { id: 'rendsburg-eckernfoerde', path: 'M 1465.0,-381.2 L 1475.1,-435.2 L 1461.9,-477.0 L 1396.9,-486.1 L 1394.2,-443.0 L 1358.3,-466.0 L 1353.4,-444.1 L 1147.5,-302.7 L 1091.7,-224.5 L 1042.8,-217.4 L 1044.9,-171.7 L 988.9,-117.8 L 1005.2,-91.4 L 899.6,-41.9 L 906.8,10.6 L 892.0,18.5 L 914.5,74.4 L 902.9,106.2 L 806.9,148.0 L 726.2,138.1 L 704.0,172.7 L 718.8,176.7 L 722.6,223.7 L 708.0,217.0 L 724.2,227.2 L 708.3,243.1 L 722.1,293.5 L 767.8,332.5 L 755.8,350.6 L 767.5,379.7 L 750.5,407.2 L 764.5,438.2 L 748.3,449.7 L 766.6,480.2 L 601.7,578.1 L 613.2,592.3 L 610.0,705.2 L 722.8,690.7 L 739.5,707.4 L 780.2,655.7 L 827.5,661.0 L 867.1,631.0 L 936.2,655.8 L 945.9,692.9 L 964.7,696.7 L 961.4,734.9 L 1024.2,738.7 L 1051.9,705.2 L 1053.9,731.3 L 1096.6,747.9 L 1200.0,731.6 L 1217.2,746.3 L 1214.2,790.4 L 1314.7,814.9 L 1368.9,788.4 L 1382.2,734.4 L 1346.1,727.0 L 1356.2,679.0 L 1344.7,641.5 L 1410.2,533.1 L 1475.7,571.5 L 1572.4,570.2 L 1570.4,548.0 L 1588.5,538.9 L 1572.5,446.5 L 1590.7,407.1 L 1589.3,363.0 L 1549.7,347.0 L 1581.4,307.6 L 1533.6,286.9 L 1546.5,249.0 L 1502.9,246.3 L 1487.7,210.7 L 1498.9,201.4 L 1483.9,198.5 L 1497.2,152.1 L 1519.8,170.8 L 1562.1,146.9 L 1550.1,119.0 L 1473.4,114.1 L 1520.3,76.0 L 1585.8,72.4 L 1603.9,43.8 L 1598.3,-7.9 L 1671.8,-96.0 L 1580.9,-155.4 L 1315.5,-85.5 L 1260.6,-96.7 L 1285.2,-136.8 L 1430.5,-228.7 L 1467.0,-288.8 L 1465.0,-381.2 Z' },
  { id: 'nordfriesland', path: 'M -130.2,82.4 L -131.2,108.3 L -185.1,143.0 L -236.8,137.4 L -238.1,194.7 L -158.1,263.7 L -133.7,266.4 L -113.4,236.4 L -23.4,261.3 L 25.1,239.4 L 46.7,260.2 L 48.5,291.8 L 114.1,301.6 L 122.2,250.6 L 230.5,153.8 L 216.6,102.1 L 251.3,61.4 L 327.6,94.7 L 347.4,79.7 L 420.4,147.2 L 412.9,181.1 L 443.7,187.2 L 431.5,167.0 L 448.1,151.4 L 444.3,121.6 L 487.1,92.6 L 486.3,47.1 L 551.9,75.4 L 546.1,35.9 L 571.8,-21.8 L 628.9,-79.3 L 573.5,-216.7 L 601.5,-248.7 L 588.0,-260.5 L 609.4,-307.9 L 537.2,-346.6 L 557.1,-397.0 L 485.3,-454.4 L 504.1,-487.7 L 450.2,-532.4 L 443.7,-592.8 L 386.5,-575.0 L 312.2,-595.7 L 336.3,-614.8 L 322.7,-673.3 L 331.4,-708.8 L 370.0,-733.9 L 381.6,-774.4 L 356.4,-829.1 L 330.1,-833.2 L 365.3,-860.7 L 373.3,-948.8 L 295.0,-945.4 L 175.7,-1007.7 L 70.2,-995.9 L 27.4,-1016.5 L -87.5,-987.8 L -156.1,-1025.7 L -196.9,-1025.9 L -198.8,-994.0 L -238.3,-977.8 L -455.9,-962.8 L -517.9,-1013.6 L -533.8,-1140.7 L -504.7,-1198.2 L -429.6,-1240.7 L -447.2,-1268.8 L -436.0,-1287.1 L -478.0,-1278.6 L -483.5,-1299.7 L -401.9,-1301.1 L -481.5,-1318.1 L -604.3,-1021.5 L -624.7,-697.6 L -600.6,-677.8 L -603.3,-878.6 L -552.3,-959.7 L -458.7,-893.4 L -348.6,-964.8 L -233.9,-973.9 L -229.8,-882.0 L -119.6,-745.3 L -124.6,-718.3 L -103.0,-670.5 L -136.5,-656.6 L -72.2,-627.1 L -56.6,-556.4 L 36.6,-489.3 L 110.9,-385.4 L 82.9,-315.8 L 85.5,-247.1 L 6.3,-183.5 L 21.8,-158.5 L 7.2,-126.1 L 110.3,-104.6 L 176.3,-185.4 L 174.1,-213.2 L 218.8,-236.5 L 257.0,-162.1 L 233.9,-113.0 L 194.1,-100.8 L 84.4,3.7 L -153.7,16.5 L -196.0,70.7 L -130.2,82.4 Z' },
]

const NEIGHBOR_LABELS = [
  { id: 'schleswig-flensburg', x: 601, y: 50.1, text: "Schleswig-Flensburg", rotate: 0 },
  { id: 'steinburg', x: 782.3, y: 999.3, text: "Kreis Steinburg", rotate: 90 },
  { id: 'rendsburg-eckernfoerde', x: 782.3, y: 389.3, text: "Rendsburg-Eckernförde", rotate: 90 },
  { id: 'nordfriesland', x: 251, y: 50.1, text: "Kreis Nordfriesland", rotate: 0 },
]

const WATER_LABELS = [
  { x: 22.6, y: 834.6, text: "Nordsee", size: 13 },
  { x: 178, y: 1161.2, text: "Elbe", size: 12 },
  { x: 142.2, y: 140.5, text: "Eider", size: 11 },
  { x: 644.4, y: 906, text: "Nord-Ostsee-Kanal", size: 10 },
]

const ALL_DISTRICTS = [
  { id: 'heide', path: 'M 463.2,437.5 L 461.6,443.4 L 444.6,452.2 L 442.7,460.0 L 433.6,468.1 L 421.6,472.0 L 411.0,480.5 L 401.2,481.8 L 398.5,491.1 L 393.6,498.0 L 372.8,503.5 L 369.8,502.3 L 363.7,505.9 L 362.0,503.0 L 365.8,498.8 L 367.9,487.9 L 363.1,487.2 L 363.7,477.8 L 330.6,477.8 L 330.9,459.3 L 336.6,444.2 L 335.1,439.4 L 336.8,436.7 L 330.7,434.0 L 318.4,433.8 L 316.2,429.8 L 313.1,430.9 L 312.0,426.4 L 303.6,427.2 L 300.7,404.3 L 310.3,403.1 L 309.8,414.1 L 313.7,408.5 L 322.0,413.2 L 322.3,419.8 L 335.0,415.1 L 336.7,418.5 L 349.0,414.1 L 351.3,406.1 L 368.6,403.2 L 368.4,398.4 L 365.0,395.3 L 364.3,390.9 L 369.0,389.7 L 369.3,392.2 L 375.9,395.9 L 372.2,402.6 L 378.2,407.7 L 377.2,409.1 L 383.5,410.6 L 381.9,420.5 L 393.0,421.4 L 401.1,418.4 L 400.5,413.1 L 426.8,400.6 L 427.5,397.1 L 425.8,395.1 L 425.5,390.6 L 437.1,389.0 L 463.3,397.2 L 466.1,398.9 L 464.1,402.9 L 467.8,404.0 L 468.1,411.4 L 488.2,415.1 L 492.5,418.9 L 487.0,433.9 L 466.6,439.6 L 463.2,437.5 Z' },
  { id: 'hemmingstedt', path: 'M 289.3,537.7 L 290.2,544.8 L 303.7,542.2 L 303.1,549.6 L 306.0,554.3 L 304.9,555.5 L 306.1,559.5 L 308.7,559.0 L 309.2,562.5 L 316.6,567.1 L 317.3,562.8 L 324.3,565.4 L 344.8,566.5 L 367.7,559.2 L 368.7,562.1 L 377.0,554.3 L 389.9,552.6 L 391.2,548.2 L 391.2,527.3 L 398.6,514.5 L 398.9,509.5 L 393.6,498.0 L 372.8,503.5 L 369.8,502.3 L 363.7,505.9 L 362.0,503.0 L 365.8,498.8 L 367.9,487.9 L 363.1,487.2 L 363.7,477.8 L 338.9,478.0 L 336.3,489.1 L 340.6,490.6 L 337.8,504.6 L 332.5,504.5 L 326.9,512.3 L 333.9,515.1 L 327.6,525.8 L 323.5,525.4 L 325.1,520.4 L 320.9,520.7 L 319.1,526.6 L 313.8,527.6 L 314.5,531.5 L 303.9,532.8 L 303.7,536.4 L 289.3,537.7 Z' },
  { id: 'lohe-rickelshof', path: 'M 336.3,488.9 L 338.9,478.0 L 330.6,477.8 L 330.7,465.6 L 330.9,459.3 L 336.6,444.2 L 335.1,439.4 L 336.8,436.7 L 330.7,434.0 L 318.4,433.8 L 316.2,429.8 L 313.1,430.9 L 312.0,426.4 L 303.6,427.2 L 302.7,464.9 L 307.2,484.6 L 296.6,487.2 L 294.0,488.6 L 294.4,491.1 L 302.7,492.0 L 308.6,489.1 L 309.6,491.5 L 316.4,490.4 L 321.0,492.5 L 322.5,490.4 L 336.3,488.9 Z' },
  { id: 'weddingstedt', path: 'M 351.9,282.8 L 337.7,300.8 L 334.2,315.9 L 326.8,320.7 L 325.2,325.3 L 323.1,326.1 L 321.2,334.3 L 322.9,338.5 L 306.0,349.9 L 295.2,352.8 L 297.3,375.5 L 314.0,371.7 L 312.5,380.0 L 314.6,381.5 L 315.8,379.0 L 320.1,379.4 L 329.2,387.2 L 339.2,408.3 L 368.6,403.2 L 368.3,398.3 L 365.0,395.3 L 364.3,390.9 L 366.7,390.9 L 364.4,383.9 L 388.8,362.4 L 385.8,355.3 L 384.7,344.5 L 377.7,337.4 L 378.9,332.4 L 376.8,329.8 L 379.7,324.9 L 378.7,321.5 L 372.9,320.2 L 368.1,315.3 L 367.6,311.8 L 360.2,311.1 L 360.1,307.2 L 355.6,303.0 L 362.8,299.0 L 362.2,297.1 L 357.8,283.0 L 354.6,285.2 L 351.9,282.8 Z' },
  { id: 'meldorf', path: 'M 244.8,643.9 L 229.5,643.9 L 203.2,638.3 L 197.7,635.1 L 196.1,622.1 L 198.1,619.8 L 168.1,616.2 L 176.6,642.7 L 175.0,644.5 L 177.7,645.2 L 176.6,647.9 L 180.9,653.3 L 193.0,652.6 L 194.0,650.2 L 191.7,644.9 L 193.9,643.0 L 220.7,645.8 L 255.9,645.6 L 260.6,646.9 L 264.4,656.3 L 273.1,662.2 L 272.3,664.5 L 283.0,671.3 L 287.1,678.3 L 299.6,677.7 L 299.5,681.2 L 302.1,683.2 L 318.1,688.2 L 321.1,688.2 L 321.7,684.6 L 343.3,685.9 L 344.0,679.3 L 338.1,677.7 L 339.7,674.0 L 338.0,667.3 L 339.6,663.5 L 348.9,660.8 L 358.3,664.6 L 359.2,661.9 L 354.6,658.6 L 352.6,651.4 L 363.9,651.5 L 363.9,645.9 L 358.5,641.4 L 354.9,627.2 L 360.7,624.8 L 366.5,614.0 L 371.0,611.5 L 389.2,616.1 L 398.3,616.3 L 401.1,614.1 L 400.7,606.8 L 393.3,596.8 L 394.8,594.3 L 402.4,594.7 L 404.7,588.0 L 403.9,584.0 L 409.3,581.1 L 409.6,565.7 L 363.3,584.1 L 361.3,596.7 L 353.2,597.7 L 341.3,610.4 L 328.7,617.3 L 316.8,627.8 L 313.0,626.0 L 312.3,634.6 L 307.4,642.2 L 301.6,635.1 L 299.4,635.4 L 295.6,642.3 L 278.4,640.8 L 278.3,644.9 L 275.3,645.8 L 244.8,643.9 Z' },
  { id: 'schafstedt', path: 'M 607.8,714.1 L 602.1,747.0 L 593.3,742.8 L 590.5,744.5 L 591.4,749.0 L 584.0,747.1 L 576.1,694.6 L 564.0,678.9 L 544.0,672.5 L 549.0,663.5 L 533.6,668.9 L 535.6,664.0 L 535.5,657.8 L 556.7,648.1 L 556.6,646.5 L 563.9,648.2 L 566.0,644.1 L 569.0,645.1 L 570.3,638.7 L 569.6,632.6 L 562.9,617.3 L 563.9,611.2 L 566.1,608.1 L 611.7,602.3 L 616.7,646.6 L 612.3,654.2 L 607.2,655.7 L 611.8,674.9 L 611.2,683.5 L 613.8,684.3 L 610.4,695.6 L 611.2,698.6 L 607.8,714.1 Z' },
  { id: 'albersdorf', path: 'M 613.2,592.3 L 601.7,578.1 L 611.0,573.3 L 607.9,571.9 L 609.0,569.3 L 606.9,566.2 L 608.4,563.2 L 605.0,564.0 L 602.3,562.6 L 602.9,560.8 L 598.0,559.3 L 605.4,545.8 L 601.7,539.4 L 606.3,537.1 L 602.1,535.6 L 599.2,527.5 L 593.3,518.8 L 586.3,514.2 L 585.5,512.1 L 588.9,509.5 L 587.9,507.4 L 583.8,507.6 L 578.9,512.8 L 574.5,509.6 L 549.7,515.0 L 549.7,518.2 L 547.6,519.9 L 544.8,518.1 L 544.8,521.9 L 541.4,520.4 L 541.8,527.2 L 543.1,527.4 L 535.3,529.5 L 534.3,526.1 L 531.5,528.5 L 534.2,532.9 L 530.3,534.8 L 528.1,539.2 L 531.4,541.2 L 538.1,551.6 L 548.2,594.4 L 566.1,608.1 L 611.7,602.3 L 613.2,592.3 Z' },
  { id: 'buesumer-deichhausen', path: 'M 101.4,569.0 L 112.1,562.5 L 125.6,562.0 L 127.0,557.4 L 121.4,554.2 L 124.5,549.2 L 130.6,549.9 L 134.4,543.1 L 131.7,540.6 L 132.3,536.0 L 130.2,536.0 L 133.8,530.5 L 130.8,532.0 L 118.6,528.7 L 116.3,531.3 L 111.7,529.8 L 111.3,533.0 L 105.6,533.2 L 109.0,534.4 L 102.2,544.5 L 96.2,544.5 L 91.4,552.2 L 96.0,557.1 L 99.4,557.5 L 99.0,563.5 L 101.4,569.0 Z' },
  { id: 'buesum', path: 'M 105.3,534.3 L 91.1,536.4 L 90.8,531.5 L 88.8,532.0 L 88.6,527.5 L 82.9,528.2 L 78.7,532.5 L 77.8,521.8 L 70.2,524.7 L 70.1,518.2 L 61.8,521.8 L 62.7,524.8 L 54.6,527.8 L 55.6,531.3 L 47.5,536.8 L 37.3,540.4 L 33.9,533.6 L 29.3,536.0 L 44.3,563.7 L 64.3,573.0 L 66.9,577.9 L 66.2,585.1 L 67.6,590.9 L 68.8,591.0 L 69.0,586.1 L 72.6,587.5 L 70.9,591.8 L 84.4,579.3 L 91.9,577.8 L 101.4,569.0 L 99.0,563.5 L 99.4,557.5 L 96.0,557.1 L 91.4,552.2 L 96.2,544.5 L 102.2,544.5 L 109.0,534.4 L 105.3,534.3 Z' },
  { id: 'reinsbuettel', path: 'M 157.2,447.9 L 152.3,446.8 L 144.5,450.4 L 141.3,446.3 L 121.7,449.4 L 121.2,445.5 L 117.4,445.5 L 118.7,448.5 L 117.8,451.3 L 114.7,451.5 L 113.1,457.5 L 107.6,456.6 L 106.0,460.2 L 106.5,463.9 L 99.8,471.6 L 97.1,479.8 L 105.1,486.7 L 116.1,489.5 L 116.5,491.5 L 127.4,496.6 L 132.5,502.7 L 145.1,504.5 L 147.9,502.1 L 150.8,480.7 L 152.9,481.2 L 154.5,477.2 L 150.9,475.9 L 149.7,470.4 L 152.8,456.3 L 157.9,453.0 L 157.2,447.9 Z' },
  { id: 'wesselburenerkoog', path: 'M 125.9,246.5 L 118.9,257.4 L 120.3,291.9 L 119.3,296.8 L 115.9,301.0 L 94.4,302.6 L 61.2,291.7 L 48.5,291.7 L 49.8,297.3 L 52.0,298.0 L 52.0,311.1 L 47.3,313.2 L 45.2,329.5 L 41.4,341.6 L 42.8,350.2 L 47.6,357.4 L 46.9,384.2 L 42.8,393.7 L 55.7,398.8 L 66.7,379.8 L 104.9,352.8 L 122.6,336.5 L 130.2,323.8 L 154.2,295.3 L 155.1,284.2 L 153.3,272.8 L 125.9,246.5 Z' },
  { id: 'wesselburen', path: 'M 157.8,366.1 L 151.4,364.0 L 148.4,369.6 L 146.3,368.9 L 145.2,371.2 L 147.8,372.9 L 145.1,379.2 L 143.5,378.2 L 139.7,386.8 L 131.6,391.8 L 132.8,392.8 L 129.2,396.7 L 136.3,407.5 L 130.6,412.6 L 142.4,420.9 L 149.4,416.5 L 153.8,423.6 L 152.2,424.3 L 153.4,426.7 L 161.2,422.6 L 163.9,429.8 L 170.4,426.6 L 168.1,415.1 L 175.5,413.8 L 170.0,392.7 L 164.6,380.9 L 168.8,374.7 L 162.3,376.2 L 157.8,366.1 Z' },
  { id: 'brunsbuettel', path: 'M 415.4,955.0 L 429.4,935.7 L 436.4,946.0 L 434.4,947.2 L 438.5,952.8 L 439.7,951.7 L 453.7,972.8 L 459.2,969.6 L 465.8,976.3 L 467.3,974.6 L 471.0,977.0 L 484.3,999.3 L 481.4,1019.7 L 482.3,1029.5 L 478.2,1029.5 L 478.4,1042.6 L 493.7,1044.2 L 494.3,1055.2 L 491.4,1057.9 L 475.4,1058.1 L 476.7,1079.4 L 435.8,1080.4 L 408.0,1084.5 L 301.4,1076.9 L 264.7,1080.6 L 259.2,1042.7 L 259.4,1029.5 L 271.6,1017.9 L 274.8,1020.8 L 271.8,1017.7 L 276.7,1013.5 L 292.3,1004.3 L 293.5,1010.2 L 304.6,1009.6 L 312.9,1020.0 L 333.4,1006.8 L 327.1,1010.0 L 326.3,1008.2 L 332.5,1004.3 L 331.7,1001.0 L 338.5,996.0 L 336.7,993.5 L 338.1,992.5 L 337.0,990.9 L 332.1,988.5 L 336.4,985.8 L 336.4,979.3 L 337.7,978.4 L 338.9,979.9 L 370.4,959.1 L 368.0,962.0 L 371.5,972.6 L 377.4,979.0 L 381.1,977.8 L 378.2,971.1 L 412.1,960.6 L 415.4,955.0 Z' },
  { id: 'friedrichskoog', path: 'M 118.4,932.6 L 120.6,919.8 L 119.2,920.5 L 114.5,911.0 L 111.3,912.6 L 109.8,909.6 L 105.0,908.0 L 103.8,904.6 L 107.9,902.3 L 103.2,904.3 L 100.3,898.5 L 105.1,895.8 L 100.2,897.9 L 97.9,893.0 L 101.8,885.5 L 108.2,882.2 L 105.2,879.4 L 116.0,873.9 L 117.6,877.1 L 120.2,875.8 L 118.8,865.4 L 109.9,861.6 L 100.9,861.5 L 99.8,859.4 L 94.5,860.6 L 87.5,855.6 L 82.4,845.3 L 79.1,846.7 L 74.4,843.9 L 86.5,838.0 L 85.9,836.7 L 73.0,843.0 L 69.0,833.9 L 72.3,832.2 L 70.8,828.9 L 73.3,827.3 L 68.8,817.3 L 61.9,808.3 L 59.2,799.4 L 55.3,797.2 L 54.2,794.7 L 55.5,793.7 L 52.4,788.8 L 45.6,784.5 L 42.2,778.5 L 43.1,772.7 L 49.7,760.3 L 68.5,750.2 L 75.7,751.0 L 83.6,747.8 L 94.1,750.1 L 96.8,746.8 L 112.9,752.4 L 115.9,757.0 L 122.9,760.1 L 133.1,763.3 L 136.1,761.9 L 140.0,767.4 L 146.2,764.9 L 149.6,769.2 L 148.5,770.7 L 149.3,776.4 L 175.7,768.9 L 206.9,812.7 L 205.3,826.8 L 209.5,837.1 L 209.6,843.3 L 205.7,847.3 L 197.6,845.0 L 195.6,838.0 L 187.8,835.5 L 184.7,837.9 L 179.4,848.2 L 177.5,858.3 L 174.3,864.8 L 176.7,870.5 L 174.7,876.0 L 166.2,882.5 L 164.3,886.9 L 168.0,904.1 L 164.5,909.0 L 164.6,920.4 L 161.5,927.2 L 148.4,931.9 L 132.6,923.9 L 124.9,928.0 L 123.2,932.8 L 118.4,932.6 Z' },
  { id: 'volsemenhusen', path: 'M 293.8,838.4 L 296.1,841.9 L 284.8,841.7 L 284.9,844.9 L 283.1,844.9 L 283.4,851.3 L 286.5,851.2 L 286.5,853.4 L 282.8,862.9 L 288.8,865.8 L 288.5,870.2 L 291.5,869.7 L 292.4,874.0 L 301.4,871.3 L 302.0,873.7 L 298.1,875.0 L 304.4,888.9 L 294.3,893.2 L 297.1,900.5 L 292.7,902.5 L 295.2,907.9 L 288.6,910.9 L 288.9,913.9 L 285.7,917.1 L 292.0,922.3 L 293.8,928.4 L 299.7,929.4 L 307.6,941.7 L 311.7,940.2 L 313.1,942.6 L 335.8,931.1 L 339.6,937.9 L 352.5,930.0 L 352.8,924.3 L 363.1,919.2 L 367.7,908.3 L 377.9,902.8 L 374.4,896.8 L 367.1,900.5 L 363.5,890.5 L 361.9,891.3 L 356.4,881.3 L 347.6,885.3 L 342.5,874.9 L 337.6,875.1 L 333.6,865.7 L 343.1,861.6 L 341.8,857.1 L 334.0,854.9 L 333.0,847.1 L 339.7,846.4 L 339.4,840.7 L 293.8,838.4 Z' },
  { id: 'marne', path: 'M 240.1,950.0 L 250.1,946.0 L 253.1,948.2 L 253.9,952.5 L 261.1,947.1 L 258.8,944.1 L 260.8,942.8 L 259.0,939.2 L 278.0,935.4 L 279.4,934.4 L 278.4,927.1 L 289.9,921.3 L 292.7,925.0 L 292.0,922.3 L 286.6,918.8 L 281.2,907.4 L 273.0,915.4 L 272.1,912.6 L 269.7,913.5 L 269.0,908.7 L 258.7,911.5 L 258.2,908.6 L 251.4,911.3 L 250.7,908.3 L 237.5,907.9 L 236.9,922.1 L 228.2,930.9 L 235.8,943.3 L 240.9,946.7 L 240.1,950.0 Z' },
  { id: 'eddelak', path: 'M 428.0,903.4 L 446.3,912.0 L 459.8,913.6 L 463.5,915.2 L 463.4,918.4 L 451.6,923.5 L 445.9,930.8 L 447.7,934.7 L 441.4,935.1 L 433.0,941.2 L 428.3,935.4 L 412.1,960.6 L 378.2,971.1 L 381.1,977.8 L 377.4,979.0 L 371.5,972.6 L 368.0,962.0 L 370.4,959.1 L 362.1,946.7 L 428.0,903.4 Z' },
  { id: 'st-michaelisdonn', path: 'M 422.3,797.3 L 422.0,800.8 L 433.9,812.9 L 432.8,814.6 L 434.8,813.6 L 434.8,824.2 L 429.2,824.5 L 437.2,875.7 L 424.9,879.8 L 413.8,880.2 L 411.5,885.4 L 403.2,886.7 L 412.3,893.2 L 402.4,897.0 L 404.1,899.6 L 396.7,903.8 L 394.4,900.4 L 391.9,900.5 L 383.3,905.5 L 382.7,903.2 L 377.4,904.5 L 368.2,909.4 L 377.9,902.8 L 374.4,896.8 L 367.1,900.5 L 363.5,890.5 L 361.9,891.3 L 356.4,881.3 L 347.6,885.3 L 342.5,874.9 L 337.6,875.1 L 333.6,865.7 L 343.1,861.6 L 341.8,857.1 L 334.0,854.9 L 333.0,847.1 L 339.7,846.4 L 339.4,840.7 L 346.6,840.8 L 347.3,831.9 L 343.8,831.4 L 344.1,828.9 L 348.5,829.6 L 344.6,822.9 L 343.2,814.4 L 347.8,814.8 L 347.4,810.0 L 354.4,810.5 L 354.6,812.9 L 360.3,815.5 L 361.5,813.3 L 375.7,814.7 L 380.1,812.1 L 386.0,803.4 L 407.3,804.5 L 413.8,799.0 L 422.3,797.3 Z' },
  { id: 'suederhastedt', path: 'M 430.7,721.7 L 448.5,714.4 L 463.9,697.2 L 472.2,693.0 L 473.6,696.1 L 486.0,695.8 L 485.8,686.7 L 494.9,682.7 L 494.9,674.6 L 532.0,680.5 L 517.7,708.2 L 523.1,710.6 L 522.6,746.6 L 525.7,748.9 L 503.3,753.1 L 497.1,759.0 L 495.7,763.1 L 492.7,764.1 L 496.9,773.1 L 493.3,773.8 L 493.3,777.3 L 483.0,774.1 L 475.1,763.5 L 430.4,725.7 L 430.7,721.7 Z' },
  { id: 'burg-in-dithmarschen', path: 'M 552.7,897.0 L 566.0,878.8 L 578.9,877.6 L 582.3,875.4 L 582.0,872.5 L 585.2,871.2 L 584.8,865.3 L 579.2,862.0 L 581.6,858.6 L 586.0,860.0 L 588.1,855.3 L 592.6,855.8 L 591.1,850.2 L 595.0,847.4 L 590.5,845.7 L 588.0,841.4 L 590.6,833.3 L 594.7,829.7 L 570.6,804.9 L 565.9,816.1 L 560.3,810.6 L 544.1,809.1 L 529.3,820.4 L 531.3,830.5 L 529.0,831.2 L 525.6,844.6 L 525.9,851.3 L 524.6,851.6 L 529.6,858.3 L 545.7,862.8 L 543.7,866.0 L 552.1,858.3 L 542.4,867.9 L 549.6,874.2 L 546.5,878.4 L 552.7,897.0 Z' },
  { id: 'lunden', path: 'M 258.5,180.9 L 267.0,170.6 L 268.9,175.7 L 291.1,169.9 L 291.5,177.3 L 298.3,181.8 L 305.5,181.6 L 314.8,171.6 L 314.3,146.0 L 266.2,151.3 L 258.6,154.3 L 256.3,161.9 L 253.8,163.7 L 257.2,167.8 L 252.5,174.0 L 258.5,180.9 Z' },
  { id: 'hennstedt', path: 'M 413.9,247.7 L 412.1,221.0 L 419.1,221.2 L 422.7,184.1 L 435.8,187.5 L 444.5,186.2 L 432.0,168.4 L 433.3,162.9 L 440.8,155.0 L 448.1,151.4 L 467.4,154.6 L 472.2,157.9 L 473.3,163.1 L 467.9,174.7 L 465.1,188.8 L 483.9,200.7 L 479.8,208.1 L 476.1,229.4 L 478.2,251.0 L 483.7,267.7 L 476.9,286.9 L 470.7,290.5 L 429.7,291.8 L 418.7,276.8 L 417.4,262.1 L 418.4,262.1 L 413.9,247.7 Z' },
  { id: 'tellingstedt', path: 'M 644.0,350.3 L 642.7,352.7 L 636.1,354.0 L 635.3,351.1 L 622.6,360.0 L 622.9,364.8 L 626.6,368.9 L 618.0,368.4 L 617.9,373.3 L 621.0,380.0 L 612.9,381.3 L 611.0,412.3 L 601.0,433.9 L 587.8,446.7 L 580.4,449.6 L 574.8,438.4 L 550.6,413.7 L 536.2,409.2 L 537.3,400.5 L 551.7,396.1 L 557.9,387.8 L 555.7,387.1 L 558.5,381.9 L 555.6,380.7 L 556.7,377.5 L 549.0,376.3 L 547.0,367.6 L 571.3,362.5 L 593.0,353.9 L 595.9,346.0 L 601.9,344.5 L 601.8,340.7 L 609.4,332.8 L 631.3,337.0 L 640.6,332.6 L 638.6,342.4 L 644.0,350.3 Z M 513.3,374.5 L 512.7,376.8 L 514.1,377.3 L 507.4,385.2 L 502.1,383.3 L 492.1,386.2 L 476.7,395.0 L 475.1,393.1 L 471.6,366.5 L 464.1,364.6 L 458.0,366.7 L 456.8,363.5 L 468.0,354.9 L 473.4,354.0 L 479.7,356.8 L 482.1,355.1 L 485.1,341.9 L 488.2,341.5 L 489.0,346.8 L 491.2,346.7 L 503.0,360.6 L 501.4,361.1 L 502.4,363.8 L 507.3,366.3 L 513.3,374.5 Z' },
]

const DARK_DISTRICTS = new Set(['heide', 'meldorf', 'buesumer-deichhausen', 'buesum', 'wesselburenerkoog', 'friedrichskoog', 'tellingstedt'])
const COASTAL_DISTRICTS = new Set(['buesumer-deichhausen', 'buesum', 'wesselburenerkoog', 'friedrichskoog'])

const LABELS = [
  { id: 'heide', x: 385.2, y: 453.4, lines: ["Heide"], size: 11 },
  { id: 'hemmingstedt', x: 356.9, y: 532.9, lines: ["Hemmingstedt"], size: 11 },
  { id: 'lohe-rickelshof', x: 318.6, y: 449.6, lines: ["Lohe-","Rickelshof"], size: 11 },
  { id: 'weddingstedt', x: 350.4, y: 354.1, lines: ["Weddingstedt"], size: 11 },
  { id: 'meldorf', x: 316.4, y: 662.4, lines: ["Meldorf"], size: 11 },
  { id: 'schafstedt', x: 584.9, y: 666.6, lines: ["Schafstedt"], size: 11 },
  { id: 'albersdorf', x: 569.3, y: 546, lines: ["Albersdorf"], size: 11 },
  { id: 'buesumer-deichhausen', x: 220, y: 540, lines: ["Büsumer","Deichhausen"], size: 11, leaderFrom: { x: 110.9, y: 550.7 } },
  { id: 'buesum', x: 67.8, y: 551, lines: ["Büsum"], size: 11 },
  { id: 'reinsbuettel', x: 128.9, y: 472.7, lines: ["Reinsbüttel"], size: 11 },
  { id: 'wesselburenerkoog', x: 78.2, y: 331.4, lines: ["Wesselburener-","koog"], size: 11 },
  { id: 'wesselburen', x: 152.7, y: 399.1, lines: ["Wesselburen"], size: 11 },
  { id: 'brunsbuettel', x: 419.1, y: 1023.5, lines: ["Brunsbüttel"], size: 11 },
  { id: 'friedrichskoog', x: 139, y: 822.7, lines: ["Friedrichskoog"], size: 11 },
  { id: 'volsemenhusen', x: 327.7, y: 904.2, lines: ["Volsemenhusen"], size: 11 },
  { id: 'marne', x: 251.5, y: 926.5, lines: ["Marne"], size: 11 },
  { id: 'eddelak', x: 400.5, y: 944.1, lines: ["Eddelak"], size: 11 },
  { id: 'st-michaelisdonn', x: 385.5, y: 852.3, lines: ["St. Michaelis-","donn"], size: 11 },
  { id: 'suederhastedt', x: 483.2, y: 728.1, lines: ["Süderhastedt"], size: 11 },
  { id: 'burg-in-dithmarschen', x: 565.3, y: 838.9, lines: ["Burg in","Dithmarschen"], size: 11 },
  { id: 'lunden', x: 301.2, y: 161.1, lines: ["Lunden"], size: 11 },
  { id: 'hennstedt', x: 445.2, y: 240.6, lines: ["Hennstedt"], size: 11 },
  { id: 'tellingstedt', x: 582.1, y: 403.7, lines: ["Tellingstedt"], size: 11 },
]

const STAGGER_ORDER = ['wesselburenerkoog', 'lunden', 'wesselburen', 'reinsbuettel', 'buesum', 'hennstedt', 'weddingstedt', 'buesumer-deichhausen', 'lohe-rickelshof', 'heide', 'hemmingstedt', 'friedrichskoog', 'meldorf', 'tellingstedt', 'albersdorf', 'marne', 'suederhastedt', 'volsemenhusen', 'st-michaelisdonn', 'schafstedt', 'eddelak', 'burg-in-dithmarschen', 'brunsbuettel']

/** Einzelner klickbarer Gemeinde-Pfad. React.memo verhindert Re-Renders bei Hover anderer Gemeinden. */
const DistrictPath = memo(function DistrictPath({
  id, d, fill, label, isSelected, isHovered, isDimmed, isCoastal, loaded, staggerDelay,
  onClick, onMouseEnter, onMouseLeave,
}) {
  const stroke = isCoastal ? '#2E6A8A' : '#B8B4AC'
  const strokeWidth = isCoastal ? 1.5 : 0.8
  return (
    <path
      id={id}
      role="listitem"
      tabIndex={0}
      aria-label={`Gemeinde ${label}`}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
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

export function KreisDithmarschenSVG({
  data,
  selectedId = null,
  hoveredId = null,
  searchDimmedIds = null,
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
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="block mx-auto w-auto h-auto"
      style={{ maxHeight: '600px', maxWidth: '100%' }}
      role="img"
      aria-label="Gemeinde-Karte Kreis Dithmarschen mit Immobilienpreisen"
    >
      <defs>
        {/* Clip auf viewBox, damit Nachbarkreise sauber an der Kante enden */}
        <clipPath id="viewBoxClip">
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} />
        </clipPath>
      </defs>

      {/* LAYER 1: Wasser als Hintergrund */}
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#DCE9F0" />

      <g clipPath="url(#viewBoxClip)">
        {/* LAYER 1.5: Land-Filler mit dickem gleichfarbigen Stroke — schließt
            Gaps zwischen den unabhängig simplifizierten Polygonen (besonders
            an der Eider-Mündung), sodass kein Wasser zwischen den Kreisen
            durchscheint. Stroke wird später vom Detail-Layer überdeckt. */}
        <g>
          {NEIGHBORS.map(({ id, path: d }) => (
            <path key={`fill-${id}`} d={d} fill="#EDEAE5" stroke="#EDEAE5" strokeWidth="40" strokeLinejoin="round" />
          ))}
          <path d={KREIS_PATH} fill="#EDEAE5" stroke="#EDEAE5" strokeWidth="40" strokeLinejoin="round" />
        </g>

        {/* LAYER 2: Nachbarkreise (dezentes Land-Grau, gestrichelte Grenze) */}
        <g>
          {NEIGHBORS.map(({ id, path: d }) => (
            <path
              key={id}
              d={d}
              fill="#F5F2F0"
              stroke="#CFC9BD"
              strokeWidth="1"
              strokeDasharray="4 3"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* LAYER 3: Kreis Dithmarschen als Canvas */}
        <path
          d={KREIS_PATH}
          fill="#EDEAE5"
          stroke="#A8A498"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />

        {/* LAYER 4: Nachbarkreis-Labels (dezent, außerhalb Dithmarschen-Canvas;
            rechte Labels vertikal gedreht für schmalen Padding-Streifen). */}
        <g fontFamily="'DM Sans', system-ui, sans-serif" fill="#8A857A" fontSize="10" style={{ pointerEvents: 'none' }}>
          {NEIGHBOR_LABELS.map(l => (
            <text
              key={l.id}
              x={l.x}
              y={l.y}
              textAnchor="middle"
              fontStyle="italic"
              transform={l.rotate ? `rotate(${l.rotate} ${l.x} ${l.y})` : undefined}
            >{l.text}</text>
          ))}
        </g>

        {/* LAYER 5: Gemeinden */}
        <g className="interactive-districts" role="list">
          {ALL_DISTRICTS.map(({ id, path: d }) => (
            <DistrictPath
              key={id}
              id={id}
              d={d}
              fill={getDistrictColor(id, data)}
              label={data.districts.find(dd => dd.id === id)?.name || id}
              isSelected={selectedId === id}
              isHovered={hoveredId === id}
              isDimmed={!!(selectedId && selectedId !== id) || !!(searchDimmedIds && !searchDimmedIds.has(id))}
              isCoastal={COASTAL_DISTRICTS.has(id)}
              loaded={loaded}
              staggerDelay={STAGGER_ORDER.indexOf(id) * 30}
              onClick={onDistrictClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={onDistrictLeave}
            />
          ))}
        </g>

        {/* LAYER 5.5: Nord-Ostsee-Kanal als blaue Linie ÜBER allen Gemeinde-
            Polygonen (sonst überdeckt z.B. Brunsbüttel den Kanal-Abschnitt
            an der Schleuse). Heller Halo unten für Kontrast auf grünen
            Polygon-Flächen, blaue Linie oben drüber. Bleibt unter Labels. */}
        <path
          d={KANAL_PATH}
          fill="none"
          stroke="#F5F2F0"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        />
        <path
          d={KANAL_PATH}
          fill="none"
          stroke="#5A8FAC"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        />

        {/* LAYER 6a: Leader-Lines für versetzte Labels (z.B. Büsumer Deichhausen) */}
        <g style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
          {LABELS.filter(l => l.leaderFrom).map(({ id, x, y, leaderFrom }) => (
            <line
              key={`leader-${id}`}
              x1={leaderFrom.x}
              y1={leaderFrom.y}
              x2={x}
              y2={y - 4}
              stroke="#8A857A"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* LAYER 6b: Gemeinde-Labels */}
        <g fontFamily="'DM Sans', system-ui, sans-serif" style={{ pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 400ms ease 500ms' }}>
          {LABELS.map(({ id, x, y, lines, size }) => (
            <text key={id} textAnchor="middle" fontSize={size} fontWeight="500" fill={DARK_DISTRICTS.has(id) ? '#F5F2F0' : '#333'}>
              {lines.map((line, i) => (
                <tspan key={i} x={x} y={y + i * (size * 1.2)}>{line}</tspan>
              ))}
            </text>
          ))}
        </g>

        {/* LAYER 7: Wasser-Labels (kursiv, dezent blau) */}
        <g fontFamily="'DM Sans', system-ui, sans-serif" fill="#6A8A98" fontStyle="italic" style={{ pointerEvents: 'none' }}>
          {WATER_LABELS.map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize={l.size}>{l.text}</text>
          ))}
        </g>
      </g>
    </svg>
  )
}
