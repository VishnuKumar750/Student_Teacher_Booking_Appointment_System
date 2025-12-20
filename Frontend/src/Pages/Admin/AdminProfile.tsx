import ProfilePage from '@/components/ProfilePage';
import React from 'react';

const AdminProfile = () => {
  return (
    <div>
      <ProfilePage
        role="teacher"
        data={{
          fullName: 'Rahul Sharma',
          email: 'rahul@school.com',
          department: 'CSE',
          course: 'B.Tech',
          subject: 'Programming in Java',
          phone: '9876543210',
          address: 'Delhi, India',
          image: '/avatar.png',
        }}
      />
    </div>
  );
};

export default AdminProfile;
