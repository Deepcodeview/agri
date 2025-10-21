# BeejHealth - Installation Guide

## Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Git

## Step 1: Clone Repository
```bash
git clone https://github.com/Deepcodeview/agri.git
cd agri
```

## Step 2: Install Node.js Dependencies
```bash
npm install
```

## Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

## Step 4: Add Model File
Download and place `Resnet50-from-scratch-with-New-Plant-Disease.pth` in the project root directory.

## Step 5: Environment Setup
1. Copy `.env.example` to `.env`
2. Update environment variables as needed

## Step 6: Run Development Server
```bash
npm run dev
```

## Step 7: Access Application
Open http://localhost:3000 in your browser

## Troubleshooting

### Python Issues
```bash
# If pip install fails, try:
python -m pip install -r requirements.txt

# For virtual environment:
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### Node.js Issues
```bash
# Clear cache and reinstall:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Model File Issues
- Ensure model file is exactly named: `Resnet50-from-scratch-with-New-Plant-Disease.pth`
- File should be in project root directory
- File size should be around 100MB+

## Production Deployment
```bash
npm run build
npm start
```