from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import uuid
import random
import pandas as pd
import os

app = FastAPI(title="MEGAMP Project Q Backend - Enterprise Edition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---

class GridCastingEntry(BaseModel):
    id: str
    timestamp: datetime
    shift: str
    operatorName: str
    gridType: str
    potTemp: float
    ladleTemp: float
    panelWeightOperator: float
    totalShiftProduction: int

class IngressEntry(BaseModel):
    id: str
    timestamp: datetime
    material: str
    vendor: str
    qty: float
    qualityScore: float # 0 to 100

class LabEntry(BaseModel):
    id: str
    timestamp: datetime
    batteryType: str
    capacity: float
    voltage: float
    cycles: int
    status: str # Pass / Fail

class ChargingEntry(BaseModel):
    date: str
    batch_no: int
    circuit_id: str
    battery_model: str
    initial_sp_gravity: float
    charging_current_amps: float
    peak_voltage_v: float
    final_sp_gravity: float
    final_temp_c: float
    charge_duration_hrs: float
    status: str

# --- IN-MEMORY DB ---
db_process = []
db_ingress = []
db_lab = []
db_charging = []
db_filing = []
db_pasting = []

# --- LOAD DATA FROM EXCEL ---

def load_excel_data():
    excel_path = os.path.join(os.path.dirname(__file__), '..', 'Battery_Manufacturing_Dashboard_Data_Updated.xlsx')
    
    # Grid Casting
    df_grid = pd.read_excel(excel_path, sheet_name='Grid Casting')
    for _, row in df_grid.iterrows():
        db_process.append({
            'id': str(uuid.uuid4()),
            'timestamp': pd.to_datetime(row['Date']).to_pydatetime(),
            'shift': 'A',  # Assuming default
            'operatorName': row['Operator'],
            'gridType': row['Alloy Type'],
            'potTemp': row['Lead Pot Temp (°C)'],
            'ladleTemp': row['Mold Temp (°C)'],
            'panelWeightOperator': row['Grid Weight (g)'],
            'totalShiftProduction': 5000  # Default
        })
    
    # Charging
    df_charging = pd.read_excel(excel_path, sheet_name='Charging')
    for _, row in df_charging.iterrows():
        db_charging.append({
            'date': str(row['Date']),
            'batch_no': int(row['Batch No']),
            'circuit_id': str(row['Circuit ID']),
            'battery_model': str(row['Battery Model']),
            'initial_sp_gravity': float(row['Initial Sp. Gravity']),
            'charging_current_amps': float(row['Charging Current (Amps)']),
            'peak_voltage_v': float(row['Peak Voltage (V)']),
            'final_sp_gravity': float(row['Final Sp. Gravity']),
            'final_temp_c': float(row['Final Temp (°C)']),
            'charge_duration_hrs': float(row['Charge Duration (Hrs)']),
            'status': str(row['Status'])
        })
    
    # Filing - load as raw data
    df_filing = pd.read_excel(excel_path, sheet_name='Filing')
    db_filing = df_filing.to_dict('records')
    
    # Pasting - load as raw data
    df_pasting = pd.read_excel(excel_path, sheet_name='Pasting')
    db_pasting = df_pasting.to_dict('records')

load_excel_data()

# --- ENDPOINTS ---

@app.get("/api/grid_casting")
async def get_process(): return db_process

@app.get("/api/charging")
async def get_charging(): return db_charging

@app.get("/api/filing")
async def get_filing(): return db_filing

@app.get("/api/pasting")
async def get_pasting(): return db_pasting

@app.get("/api/ingress")
async def get_ingress(): return db_ingress

@app.get("/api/lab")
async def get_lab(): return db_lab

@app.post("/api/grid_casting")
async def add_process(entry: GridCastingEntry):
    db_process.append(entry)
    return entry

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
