import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
const db = require('../../../lib/database');

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cropType, isFollowup, symptoms, query, images, predictionResult } = await request.json();

    const consultationId = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO consultations 
        (user_id, crop_type, is_followup, symptoms, query, images, prediction_result)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        user.userId,
        cropType,
        isFollowup,
        JSON.stringify(symptoms),
        query,
        JSON.stringify(images),
        JSON.stringify(predictionResult)
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });

    return NextResponse.json({
      success: true,
      consultationId,
      message: 'Consultation saved successfully'
    });

  } catch (error) {
    console.error('Consultation save error:', error);
    return NextResponse.json({ error: 'Failed to save consultation' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consultations = await new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM consultations 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `, [user.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    return NextResponse.json({ consultations });

  } catch (error) {
    console.error('Consultations fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}