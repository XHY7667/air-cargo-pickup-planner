// ====== Configuration Area (based on your current spreadsheet structure) ======

// Vendor sheet names
// Note: These must match the sheet tab names exactly (case-sensitive)
const COMPANY_SHEETS = ['MCF', 'ZJZhuoHang', 'Sunlink', 'xingkong'];

// Data row range (starting from row 3 — row 2 is header)
const DATA_START_ROW = 3;
const DATA_END_ROW   = 500;   // Estimate up to 500 rows

// Column range (A to R will be checked for yellow highlight)
const DATA_START_COL = 1;     // Column A
const DATA_END_COL   = 18;    // Column R

// Key field column indexes (A=1, B=2, C=3, G=7, H=8, I=9)
const COL_PREFIX = 1;   // Prefix in Column A
const COL_AWB    = 3;   // AWB in Column C
const COL_PIECES = 7;   // Pieces in Column G
const COL_WEIGHT = 8;   // Weight in Column H
const COL_VOLUME = 9;   // Volume in Column I

// The yellow color used to mark shipments ready for pickup (HEX)
const YELLOW_HEX = '#ffe599';

// Prefix → Warehouse & Cluster mapping table
const PREFIX_MAP = {
  '131': {wh:'836', cluster:'A'},
  '921': {wh:'836', cluster:'A'},
  '936': {wh:'836', cluster:'A'},
  '081': {wh:'836', cluster:'A'},
  '994': {wh:'836', cluster:'A'},

  '369': {wh:'837', cluster:'A'},
  '297': {wh:'838', cluster:'A'},

  '272': {wh:'514', cluster:'B'},
  '180': {wh:'513', cluster:'B'},
  '160': {wh:'517', cluster:'B'},

  '112': {wh:'618', cluster:'C'},
  '933': {wh:'663', cluster:'C'},

  '999': {wh:'2250', cluster:'D'},
  '205': {wh:'1717', cluster:'D'},
  '784': {wh:'1717', cluster:'D'},
  '871': {wh:'1717', cluster:'D'},
};

// ========== Internal Helper: Collect all highlighted (yellow) shipment rows ==========
function collectPickupRecords_() {
  const ss = SpreadsheetApp.getActive();
  let records = [];

  COMPANY_SHEETS.forEach(name => {
    const sh = ss.getSheetByName(name);
    if (!sh) return;

    const numRows = DATA_END_ROW - DATA_START_ROW + 1;
    const numCols = DATA_END_COL - DATA_START_COL + 1;

    const rgValues = sh.getRange(DATA_START_ROW, DATA_START_COL, numRows, numCols).getValues();
    const rgColors = sh.getRange(DATA_START_ROW, DATA_START_COL, numRows, numCols).getBackgrounds();

    for (let i = 0; i < numRows; i++) {
      const rowValues = rgValues[i];
      const rowColors = rgColors[i];

      // Check if the row contains the highlight color
      const isYellow = rowColors.some(c => c.toLowerCase() === YELLOW_HEX.toLowerCase());
      if (!isYellow) continue;

      // Extract AWB prefix
      const prefixIndex = COL_PREFIX - DATA_START_COL;
      const prefix = String(rowValues[prefixIndex] || '').trim();
      if (!prefix) continue;

      const rule = PREFIX_MAP[prefix];
      if (!rule) continue;  // Skip prefixes not in the mapping table

      // Extract AWB number
      const awbIndex = COL_AWB - DATA_START_COL;
      const awb = String(rowValues[awbIndex] || '').trim();

      // Extract pieces, weight, volume
      const piecesIndex = COL_PIECES - DATA_START_COL;
      const weightIndex = COL_WEIGHT - DATA_START_COL;
      const volumeIndex = COL_VOLUME - DATA_START_COL;

      const pieces = parseFloat(rowValues[piecesIndex]) || 0;
      const weight = parseFloat(rowValues[weightIndex]) || 0;
      const volume = parseFloat(rowValues[volumeIndex]) || 0;

      records.push({
        company: name,
        prefix,
        awb,
        warehouse: rule.wh,
        cluster: rule.cluster,
        pieces,
        weight,
        volume
      });
    }
  });

  return records;
}

// ========== Function 1: Summary grouped by Cluster + Warehouse (Dashboard View) ==========
function PickupDashboard(trigger) {
  const records = collectPickupRecords_();

  const agg = {};
  records.forEach(r => {
    const key = r.cluster + '|' + r.warehouse;
    if (!agg[key]) {
      agg[key] = {
        cluster: r.cluster,
        warehouse: r.warehouse,
        shipments: 0,
        pieces: 0,
        weight: 0,
        volume: 0
      };
    }
    agg[key].shipments += 1;
    agg[key].pieces   += r.pieces;
    agg[key].weight   += r.weight;
    agg[key].volume   += r.volume;
  });

  const header = ['Cluster', 'Warehouse', 'Shipments', 'Pieces', 'Weight(kg)', 'Volume(CBM)'];
  const rows = [header];

  Object.values(agg)
    .sort((a, b) => a.cluster.localeCompare(b.cluster) || a.warehouse.localeCompare(b.warehouse))
    .forEach(r => {
      rows.push([
        r.cluster,
        r.warehouse,
        r.shipments,
        r.pieces,
        r.weight,
        r.volume
      ]);
    });

  return rows;
}

// ========== Function 2: Summary grouped by Company + Cluster + Warehouse ==========
function PickupCompanyBreakdown(trigger) {
  const records = collectPickupRecords_();

  const agg = {};
  records.forEach(r => {
    const key = r.company + '|' + r.cluster + '|' + r.warehouse;
    if (!agg[key]) {
      agg[key] = {
        company: r.company,
        cluster: r.cluster,
        warehouse: r.warehouse,
        shipments: 0,
        pieces: 0,
        weight: 0,
        volume: 0
      };
    }
    agg[key].shipments += 1;
    agg[key].pieces   += r.pieces;
    agg[key].weight   += r.weight;
    agg[key].volume   += r.volume;
  });

  const header = ['Company', 'Cluster', 'Warehouse', 'Shipments', 'Pieces', 'Weight(kg)', 'Volume(CBM)'];
  const rows = [header];

  Object.values(agg)
    .sort((a, b) =>
      a.cluster.localeCompare(b.cluster) ||
      a.warehouse.localeCompare(b.warehouse) ||
      a.company.localeCompare(b.company)
    )
    .forEach(r => {
      rows.push([
        r.company,
        r.cluster,
        r.warehouse,
        r.shipments,
        r.pieces,
        r.weight,
        r.volume
      ]);
    });

  return rows;
}

// ========== Function 3: Company + Cluster + Warehouse + AWB Detail ==========
function PickupCompanyAwbDetail(trigger) {
  const records = collectPickupRecords_();

  // Step 1: Group by Company + Cluster + Warehouse and calculate totals
  const groupTotals = {};
  records.forEach(r => {
    const key = r.company + '|' + r.cluster + '|' + r.warehouse;
    if (!groupTotals[key]) {
      groupTotals[key] = {
        company: r.company,
        cluster: r.cluster,
        warehouse: r.warehouse,
        totalPieces: 0,
        totalWeight: 0,
        totalVolume: 0,
        items: []
      };
    }
    groupTotals[key].totalPieces += r.pieces;
    groupTotals[key].totalWeight += r.weight;
    groupTotals[key].totalVolume += r.volume;

    groupTotals[key].items.push({
      awb: r.awb,
      pieces: r.pieces,
      weight: r.weight,
      volume: r.volume
    });
  });

  // Step 2: Expand groups into summary row + AWB detail rows
  const header = [
    'Company',
    'Cluster',
    'Warehouse',
    'TotalPieces',
    'TotalWeight(kg)',
    'TotalVolume(CBM)',
    'AWB',
    'AWB_Pieces'
  ];
  const rows = [header];

  Object.values(groupTotals)
    .sort((a, b) =>
      a.cluster.localeCompare(b.cluster) ||
      a.warehouse.localeCompare(b.warehouse) ||
      a.company.localeCompare(b.company)
    )
    .forEach(g => {
      // Summary row (AWB columns empty)
      rows.push([
        g.company,
        g.cluster,
        g.warehouse,
        g.totalPieces,
        g.totalWeight,
        g.totalVolume,
        '',
        ''
      ]);

      // Detail rows (Company/Cluster/Warehouse empty, only AWB info)
      g.items.forEach(item => {
        rows.push([
          '',
          '',
          '',
          '',
          '',
          '',
          item.awb,
          item.pieces
        ]);
      });
    });

  return rows;
}

