# BeejHealth - Plant Disease Diagnosis Platform

A Next.js application connecting farmers with agricultural experts for plant disease diagnosis and consultation.

## Features

- **User Authentication**: Login/Register with OTP or password
- **Plant Health Consultation**: Upload images and get AI-powered disease diagnosis
- **Real-time Progress Tracking**: Completion score updates as users fill forms
- **Expert Matching**: Connect with agricultural experts by location
- **Report Generation**: Download consultation reports as PDF

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Model Setup

Your ResNet50 model file `Resnet50-from-scratch-with-New-Plant-Disease.pth` is already in the project root.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── api/predict/          # API endpoint for disease prediction
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── AuthModal.tsx        # Login/Register modal
│   ├── ConsultationDashboard.tsx  # Main consultation form
│   └── Navbar.tsx           # Navigation bar
├── predict.py               # Python script for AI prediction
├── temp/                    # Temporary file storage
└── Resnet50-from-scratch-with-New-Plant-Disease.pth  # Your trained model

## Usage

1. **Authentication**: Click Login/Register to access the platform
2. **Consultation**: 
   - Select if it's a follow-up consultation
   - Choose crop type from the grid
   - Upload 2-3 leaf images
   - Describe symptoms
   - Add detailed query
3. **Diagnosis**: Get AI-powered disease prediction with confidence score
4. **Report**: Download consultation report and connect with experts

## API Endpoints

- `POST /api/predict` - Upload images and get disease prediction

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Model**: PyTorch ResNet50
- **File Upload**: Formidable
- **Icons**: Lucide React

## Model Integration

The application integrates your pre-trained ResNet50 model for plant disease classification. The model supports 38+ disease classes across multiple crops including:

- Apple, Orange, Tomato, Potato
- Grape, Corn, Pepper, Peach
- Strawberry, Raspberry, Soybean
- And more...

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request