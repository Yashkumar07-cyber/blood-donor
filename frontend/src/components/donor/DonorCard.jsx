import BloodBadge from '../common/BloodBadge';

const DonorCard = ({ donor, onContact }) => {
  const { user, bloodGroup, location, isAvailable, totalDonations, lastDonated } = donor;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-blood-600 font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name || 'Anonymous Donor'}</p>
            <p className="text-xs text-gray-500">{location?.city || 'Location not set'}</p>
          </div>
        </div>
        <BloodBadge group={bloodGroup} size="md" />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span>🩸 {totalDonations} donations</span>
        {lastDonated && (
          <span>Last: {new Date(lastDonated).toLocaleDateString()}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1 text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></span>
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
        {isAvailable && (
          <button
            onClick={() => onContact?.(donor)}
            className="btn-primary text-xs py-1.5 px-3"
          >
            Contact Donor
          </button>
        )}
      </div>
    </div>
  );
};

export default DonorCard;
