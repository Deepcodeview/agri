'use client'
import { useState } from 'react'
import { Calendar, Leaf, Droplets, Scissors, Sprout } from 'lucide-react'

export default function CropCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const cropActivities = {
    0: [ // January
      { crop: 'Wheat', activity: 'Harvesting', icon: <Scissors className="w-4 h-4" />, color: 'text-yellow-600' },
      { crop: 'Mustard', activity: 'Flowering', icon: <Leaf className="w-4 h-4" />, color: 'text-green-600' }
    ],
    1: [ // February
      { crop: 'Potato', activity: 'Harvesting', icon: <Scissors className="w-4 h-4" />, color: 'text-yellow-600' },
      { crop: 'Tomato', activity: 'Transplanting', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' }
    ],
    2: [ // March
      { crop: 'Rice', activity: 'Land Preparation', icon: <Droplets className="w-4 h-4" />, color: 'text-blue-600' },
      { crop: 'Cotton', activity: 'Sowing', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' }
    ],
    3: [ // April
      { crop: 'Maize', activity: 'Sowing', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Sugarcane', activity: 'Planting', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' }
    ],
    4: [ // May
      { crop: 'Rice', activity: 'Nursery Preparation', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Cotton', activity: 'Weeding', icon: <Leaf className="w-4 h-4" />, color: 'text-green-600' }
    ],
    5: [ // June
      { crop: 'Rice', activity: 'Transplanting', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Soybean', activity: 'Sowing', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' }
    ],
    6: [ // July
      { crop: 'Rice', activity: 'Weeding', icon: <Leaf className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Maize', activity: 'Fertilizer Application', icon: <Droplets className="w-4 h-4" />, color: 'text-blue-600' }
    ],
    7: [ // August
      { crop: 'Cotton', activity: 'Flowering', icon: <Leaf className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Sugarcane', activity: 'Irrigation', icon: <Droplets className="w-4 h-4" />, color: 'text-blue-600' }
    ],
    8: [ // September
      { crop: 'Rice', activity: 'Flowering', icon: <Leaf className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Soybean', activity: 'Pod Formation', icon: <Leaf className="w-4 h-4" />, color: 'text-green-600' }
    ],
    9: [ // October
      { crop: 'Rice', activity: 'Harvesting', icon: <Scissors className="w-4 h-4" />, color: 'text-yellow-600' },
      { crop: 'Cotton', activity: 'Picking', icon: <Scissors className="w-4 h-4" />, color: 'text-yellow-600' }
    ],
    10: [ // November
      { crop: 'Wheat', activity: 'Sowing', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Mustard', activity: 'Sowing', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' }
    ],
    11: [ // December
      { crop: 'Potato', activity: 'Planting', icon: <Sprout className="w-4 h-4" />, color: 'text-green-600' },
      { crop: 'Wheat', activity: 'Irrigation', icon: <Droplets className="w-4 h-4" />, color: 'text-blue-600' }
    ]
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          Crop Calendar
        </h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="input-field text-sm"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-neutral-800">
          Activities for {months[selectedMonth]}
        </h4>
        
        {cropActivities[selectedMonth as keyof typeof cropActivities]?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <div className="font-medium text-neutral-900">{item.crop}</div>
                <div className="text-sm text-neutral-600">{item.activity}</div>
              </div>
            </div>
            <div className="text-xs text-neutral-500">
              {months[selectedMonth]}
            </div>
          </div>
        )) || (
          <div className="text-center py-4 text-neutral-500">
            No activities scheduled for this month
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-primary-50 rounded-lg">
        <div className="text-sm text-primary-800">
          <strong>Tip:</strong> Plan your crop activities based on weather conditions and soil moisture levels.
        </div>
      </div>
    </div>
  )
}