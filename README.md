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
