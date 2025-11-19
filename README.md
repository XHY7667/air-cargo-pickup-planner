# Air Cargo Pickup Planner (Google Sheets + Apps Script)

A lightweight automation tool built with **Google Sheets + Apps Script** that streamlines daily air cargo pickup planning.  
It aggregates AWB data across multiple vendors, detects ready-for-pickup shipments, and generates dashboards grouped by **warehouse** and **region clusters**.

---

## 🚀 Project Overview

In many freight forwarding operations, warehouse staff manually review multiple Excel/Sheets files from different vendors to determine which shipments (AWBs) are ready for pickup at airport cargo terminals.  
This tool automates that workflow.

I designed a unified AWB tracking format based on the company’s existing habits and implemented Google Apps Script functions to:

- Read and process data across **multiple vendor sheets** (e.g., MCF, ZJZhuoHang, Sunlink, Xingkong)
- Detect “ready for pickup” shipments based on **highlighted yellow rows**
- Map AWB prefixes to the correct **warehouse** and **region cluster (A/B/C/D)**
- Aggregate shipment data (shipments, pieces, weight, volume)
- Generate three summary views:
  - **Cluster & warehouse dashboard**
  - **Company-level breakdown**
  - **AWB-level pickup detail list**

This automation significantly reduces manual sorting time and improves daily pickup planning efficiency.

---

## 🧩 Features

- Multi-sheet AWB parsing  
- Prefix → warehouse & cluster mapping  
- Region-based clustering (A / B / C / D)  
- Aggregated dashboards for dispatch planning  
- Detailed AWB-level pickup lists  

---

## 🏗 Tech Stack

- Google Sheets  
- Google Apps Script (JavaScript)  
- Spreadsheet data modeling & workflow automation  

---

## 📂 Repository Structure

```
scripts/                 Apps Script source code
template/                AWB tracking template or documentation
images/                  Dashboard & output examples
README.md                Project documentation
```

---

## 🛠 Setup & Usage

1. **Prepare your tracking sheet**
   - Create a Google Sheet with one tab per vendor (e.g., `MCF`, `ZJZhuoHang`, `Sunlink`, `xingkong`).
   - Ensure each sheet shares a similar column layout (prefix, AWB, pieces, weight, volume, etc.).
   - Use the specific yellow highlight color `#ffe599` to mark rows **ready for pickup today**.

2. **Open Apps Script**
   - In your Google Sheet, go to:  
     **Extensions → Apps Script**
   - Create a new script file or replace the existing `Code.gs`.

3. **Copy the script code**
   - Copy everything from:  
     `scripts/PickupDashboard.js`
   - Paste the content into the Google Apps Script editor.

4. **Adjust configuration**
   - Update the configuration block at the top of the script:
     - `COMPANY_SHEETS` → your sheet tab names  
     - `DATA_START_ROW`, `DATA_END_ROW` → your data rows  
     - `DATA_START_COL`, `DATA_END_COL` → your highlighted columns  
     - `COL_PREFIX`, `COL_AWB`, `COL_PIECES`, `COL_WEIGHT`, `COL_VOLUME` → correct column indexes  
     - `PREFIX_MAP` → your AWB prefix → warehouse/cluster mapping

5. **Run the functions**
   - From the Apps Script editor, run:
     - `PickupDashboard()`  
     - `PickupCompanyBreakdown()`  
     - `PickupCompanyAwbDetail()`  
   - Each function returns a table of rows (2D array) and can be extended to write output directly to sheets.

6. **Optional Enhancements**
   - Add a custom menu via an `onOpen()` function to run reports with one click.
   - Add UI buttons inside the Google Sheet for easier daily operations.

---

## 👤 Author

**Hongyu Xiang**  
Software Engineer / SRE  


