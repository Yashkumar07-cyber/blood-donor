const COLORS = {
  'A+': 'bg-red-100 text-red-700',
  'A-': 'bg-red-100 text-red-800',
  'B+': 'bg-blue-100 text-blue-700',
  'B-': 'bg-blue-100 text-blue-800',
  'AB+': 'bg-purple-100 text-purple-700',
  'AB-': 'bg-purple-100 text-purple-800',
  'O+': 'bg-green-100 text-green-700',
  'O-': 'bg-green-100 text-green-800',
};

const BloodBadge = ({ group, size = 'md' }) => {
  const color = COLORS[group] || 'bg-gray-100 text-gray-700';
  const sz = size === 'lg' ? 'text-lg px-4 py-1.5 font-bold' : 'text-xs px-2.5 py-0.5 font-medium';
  return (
    <span className={`badge ${color} ${sz}`}>{group}</span>
  );
};

export default BloodBadge;
