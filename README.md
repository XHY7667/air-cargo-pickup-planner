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

```text
scripts/                 Apps Script source code
template/                AWB tracking template or documentation
images/                  Dashboard & output examples
README.md                Project documentation

---

## 🛠 Setup & Usage

1. **Prepare your tracking sheet**
   - Create a Google Sheet with one tab per vendor (e.g., `MCF`, `ZJZhuoHang`, `Sunlink`, `xingkong`).
   - Ensure each sheet shares a similar column layout (prefix, AWB, pieces, weight, volume, etc.).
   - Use a specific yellow highlight (e.g., `#ffe599`) to mark rows that are **ready for pickup today**.

2. **Open Apps Script**
   - In the Google Sheet, go to:  
     **Extensions → Apps Script**
   - Create a new script file (or replace the default `Code.gs` content).

3. **Copy the script code**
   - Copy the full content from:  
     [`scripts/PickupDashboard.js`](scripts/PickupDashboard.js)
   - Paste it into the Apps Script editor.

4. **Adjust configuration**
   - Update the configuration section if needed:
     - `COMPANY_SHEETS` → your actual sheet tab names  
     - `DATA_START_ROW`, `DATA_END_ROW` → your data range  
     - `DATA_START_COL`, `DATA_END_COL` → your highlighted column range  
     - `COL_PREFIX`, `COL_AWB`, `COL_PIECES`, `COL_WEIGHT`, `COL_VOLUME` → your column indexes  
     - `PREFIX_MAP` → your **prefix → warehouse / cluster** mapping

5. **Run the functions**
   - In the Apps Script editor, select and run:
     - `PickupDashboard()` → generates cluster & warehouse summary  
     - `PickupCompanyBreakdown()` → company + cluster + warehouse summary  
     - `PickupCompanyAwbDetail()` → AWB-level breakdown  
   - For practical use, you may enhance these functions to automatically write output to dedicated sheets.

6. **Optional: Add a custom menu or buttons**
   - Implement an `onOpen()` function in Apps Script to add menu items:
     - e.g., `Pickup Dashboard`, `Breakdown`, `AWB Detail`
   - Or assign the functions to buttons inside Google Sheets for daily operations.

---

## 👤 Author

**Hongyu Xiang**  
Software Engineer / SRE  
Boston, MA  

- GitHub: https://github.com/YOUR_USERNAME  
- LinkedIn: https://www.linkedin.com/in/hongyu-xiang-a5a463117/  
- Portfolio: (add your Wix site link once it’s ready)
