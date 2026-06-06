import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SCHOOLS = [
  { name: 'Yaba College of Technology', type: 'Polytechnic', abbr: 'YabaTech' },
  { name: 'University of Lagos', type: 'Federal', abbr: 'Unilag' },
  { name: 'Lagos State University', type: 'State', abbr: 'LASU' },
  { name: 'Covenant University', type: 'Private', abbr: 'CU' },
  { name: 'Federal University of Technology Akure', type: 'Federal', abbr: 'FUTA' },
  { name: 'Obafemi Awolowo University', type: 'Federal', abbr: 'OAU' },
  { name: 'University of Ibadan', type: 'Federal', abbr: 'UI' },
  { name: 'Ahmadu Bello University', type: 'Federal', abbr: 'ABU' },
];

const DEPARTMENTS: Record<string, string[]> = {
  'Engineering': ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Computer Engineering', 'Chemical Engineering'],
  'Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
  'Arts': ['English Language', 'Literature', 'History', 'Philosophy', 'Theatre Arts'],
  'Social Sciences': ['Economics', 'Political Science', 'Sociology', 'Psychology', 'Mass Communication'],
  'Business': ['Accounting', 'Business Administration', 'Marketing', 'Banking and Finance', 'Entrepreneurship'],
  'Technology': ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Cyber Security'],
};

const LEVELS = ['100L', '200L', '300L', '400L', '500L', 'ND1', 'ND2', 'HND1', 'HND2'];

export default function SchoolSetup() {
  const { state, dispatch, navigate, showToast } = useApp();
  const [step, setStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDept] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(state.profile.level || '');
  const [gender, setGender] = useState(state.profile.gender || '');

  const filteredSchools = SCHOOLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.abbr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || s.type === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const finish = () => {
    dispatch({ type: 'SET_PROFILE', profile: {
      school: selectedSchool,
      department: selectedDept,
      level: selectedLevel,
      gender,
    } });
    dispatch({ type: 'NAVIGATE', page: 'home' });
    showToast('School setup complete!');
  };

  const close = () => navigate('home');

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col"
      style={{ background: 'rgba(4,6,15,0.96)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-5 h-[54px]" style={{ background: 'rgba(4,6,15,0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="text-[rgba(255,255,255,0.6)]">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}
        <h2 className="text-[17px] font-extrabold tracking-tight flex-1" style={{ color: '#fff' }}>School Setup</h2>
        <button onClick={close} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <X size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 px-5 py-3">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-sm transition-colors"
            style={{ background: step >= i ? '#6366f1' : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {step === 0 && (
          <div>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: '#fff' }}>Select your level</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>This helps us show the right courses</p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLevel(l)}
                  className="py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: selectedLevel === l ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                    border: selectedLevel === l ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.12)',
                    color: selectedLevel === l ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Gender</div>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Prefer not to say'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className="py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: gender === g ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: gender === g ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px solid rgba(255,255,255,0.1)',
                      color: gender === g ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!selectedLevel || !gender}
              className="w-full mt-6 py-4 rounded-2xl text-base font-bold disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: '#fff' }}>Find your school</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>Search or browse schools in Nigeria</p>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search schools..."
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['All', 'Federal', 'State', 'Private', 'Polytechnic'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                  style={{
                    background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                    border: filter === f ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.15)',
                    color: filter === f ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredSchools.map(s => (
                <button
                  key={s.name}
                  onClick={() => { setSelectedSchool(s.name); setStep(2); }}
                  className="w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition-colors"
                  style={{
                    background: selectedSchool === s.name ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedSchool === s.name ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>🏫</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: '#fff' }}>{s.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.type}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: '#fff' }}>Select department</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>Choose courses to study</p>
            <div className="space-y-3">
              {Object.entries(DEPARTMENTS).map(([dept, courses]) => (
                <details key={dept} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <summary className="flex items-center gap-3 p-3.5 cursor-pointer list-none">
                    <div className="text-xl">📁</div>
                    <span className="flex-1 text-sm font-bold" style={{ color: '#fff' }}>{dept}</span>
                  </summary>
                  <div className="px-3.5 pb-3.5 space-y-2">
                    {courses.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleCourse(c)}
                        className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all"
                        style={{
                          background: selectedCourses.includes(c) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selectedCourses.includes(c) ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-[6px] flex items-center justify-center flex-shrink-0"
                          style={{
                            background: selectedCourses.includes(c) ? '#6366f1' : 'rgba(255,255,255,0.1)',
                            border: selectedCourses.includes(c) ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                          }}
                        >
                          {selectedCourses.includes(c) && <span style={{ color: '#fff', fontSize: '11px' }}>✓</span>}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{c}</span>
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            {selectedCourses.length > 0 && (
              <button
                onClick={() => setStep(3)}
                className="w-full mt-4 py-4 rounded-2xl text-base font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
              >
                Continue ({selectedCourses.length} courses)
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-6">🎓</div>
            <h3 className="text-xl font-extrabold mb-2" style={{ color: '#fff' }}>Almost done!</h3>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              You're ready to start practicing!
            </p>
            <div
              className="rounded-[18px] p-5 mb-8 text-left"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="text-lg">🏫</div>
                <span className="text-sm font-bold" style={{ color: '#fff' }}>{selectedSchool}</span>
              </div>
              {selectedDept && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-lg">📂</div>
                  <span className="text-sm font-bold" style={{ color: '#fff' }}>{selectedDept}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className="text-lg">📚</div>
                <div className="flex flex-wrap gap-1">
                  {selectedCourses.map(c => (
                    <span key={c} className="rounded-[20px] px-3 py-1 text-[11px] font-bold" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>{c}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-lg">🎓</div>
                <span className="text-sm font-bold" style={{ color: '#fff' }}>{selectedLevel}</span>
              </div>
            </div>
            <button
              onClick={finish}
              className="w-full py-4 rounded-2xl text-base font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
