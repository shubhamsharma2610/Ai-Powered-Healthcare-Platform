import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { getDoctorSchedule, updateDoctorSchedule } from '../services/doctorApi';
import { toast } from 'react-hot-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export default function DoctorScheduleSection() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await getDoctorSchedule();
      setSchedule(response.data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSlot = (day) => {
    const newSlot = { day, startTime: '09:00', endTime: '10:00', isAvailable: true };
    setSchedule([...schedule, newSlot]);
  };

  const removeSlot = (index) => {
    const newSchedule = [...schedule];
    newSchedule.splice(index, 1);
    setSchedule(newSchedule);
  };

  const updateSlot = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoctorSchedule(schedule);
      toast.success('Schedule updated successfully');
    } catch (error) {
      toast.error('Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">My Schedule</h2>
          <p className="text-sm text-gray-500">Set your availability for appointments</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-dark"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>

      {/* Schedule by Day */}
      {days.map((day) => {
        const daySlots = schedule.filter(s => s.day === day);
        return (
          <div key={day} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{day}</h3>
              <button
                onClick={() => addSlot(day)}
                className="text-primary text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Slot
              </button>
            </div>

            {daySlots.length === 0 ? (
              <p className="text-sm text-gray-400">No slots added. Click "Add Slot" to set availability.</p>
            ) : (
              <div className="space-y-2">
                {daySlots.map((slot, idx) => {
                  const originalIndex = schedule.findIndex(s => s.day === day && s.startTime === slot.startTime && s.endTime === slot.endTime);
                  return (
                    <div key={idx} className="flex items-center gap-3 flex-wrap">
                      <select
                        value={slot.startTime}
                        onChange={(e) => updateSlot(originalIndex, 'startTime', e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      >
                        {timeSlots.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <span>to</span>
                      <select
                        value={slot.endTime}
                        onChange={(e) => updateSlot(originalIndex, 'endTime', e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      >
                        {timeSlots.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <button
                        onClick={() => removeSlot(originalIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}