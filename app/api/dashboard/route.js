import { NextResponse } from 'next/server';
const db = require('../../../lib/database');

export async function GET() {
  try {
    // Get dashboard statistics
    const stats = await Promise.all([
      // Total users
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      }),
      
      // Total consultations
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM consultations', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      }),
      
      // Recent consultations
      new Promise((resolve, reject) => {
        db.all(`
          SELECT c.*, u.name as user_name 
          FROM consultations c 
          JOIN users u ON c.user_id = u.id 
          ORDER BY c.created_at DESC 
          LIMIT 5
        `, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      
      // Disease statistics
      new Promise((resolve, reject) => {
        db.all(`
          SELECT 
            JSON_EXTRACT(prediction_result, '$.disease') as disease,
            COUNT(*) as count
          FROM consultations 
          WHERE prediction_result IS NOT NULL
          GROUP BY disease
          ORDER BY count DESC
          LIMIT 5
        `, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      })
    ]);

    return NextResponse.json({
      totalUsers: stats[0],
      totalConsultations: stats[1],
      recentConsultations: stats[2],
      diseaseStats: stats[3],
      systemHealth: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}