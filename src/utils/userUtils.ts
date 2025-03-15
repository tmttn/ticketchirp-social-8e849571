
// Basic user and follow system simulation
// In a real app, this would connect to a backend API

export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  followingCount: number;
  followersCount: number;
}

// Map to store follow relationships (userId -> array of ids they follow)
const followMap: Record<string, string[]> = {
  '1': ['2', '3'],   // Alex follows Sarah and Miguel
  '2': ['1', '4'],   // Sarah follows Alex and Emma
  '3': ['1', '2'],   // Miguel follows Alex and Sarah
  '4': ['2', '3'],   // Emma follows Sarah and Miguel
};

// Example users
export const users: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    initials: 'AJ',
    followingCount: followMap['1'].length,
    followersCount: Object.entries(followMap).filter(([_, following]) => following.includes('1')).length,
  },
  '2': {
    id: '2',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    initials: 'SW',
    followingCount: followMap['2'].length,
    followersCount: Object.entries(followMap).filter(([_, following]) => following.includes('2')).length,
  },
  '3': {
    id: '3',
    name: 'Miguel Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=12',
    initials: 'MR',
    followingCount: followMap['3'].length,
    followersCount: Object.entries(followMap).filter(([_, following]) => following.includes('3')).length,
  },
  '4': {
    id: '4',
    name: 'Emma Chen',
    avatar: 'https://i.pravatar.cc/150?img=9',
    initials: 'EC',
    followingCount: followMap['4'].length,
    followersCount: Object.entries(followMap).filter(([_, following]) => following.includes('4')).length,
  },
};

// Get current user - normally this would be from auth
export const getCurrentUser = (): User => {
  return users['1']; // Default to Alex for demo
};

// Check if a user is following another user
export const isFollowing = (userId: string, targetId: string): boolean => {
  return followMap[userId]?.includes(targetId) || false;
};

// Follow a user
export const followUser = (userId: string, targetId: string): void => {
  if (!followMap[userId]) {
    followMap[userId] = [];
  }
  
  if (!isFollowing(userId, targetId)) {
    followMap[userId].push(targetId);
    users[userId].followingCount += 1;
    users[targetId].followersCount += 1;
  }
};

// Unfollow a user
export const unfollowUser = (userId: string, targetId: string): void => {
  if (isFollowing(userId, targetId)) {
    followMap[userId] = followMap[userId].filter(id => id !== targetId);
    users[userId].followingCount -= 1;
    users[targetId].followersCount -= 1;
  }
};

// Get users that a specific user is following
export const getFollowing = (userId: string): User[] => {
  return (followMap[userId] || []).map(id => users[id]);
};

// Get users who follow a specific user
export const getFollowers = (userId: string): User[] => {
  const followerIds = Object.entries(followMap)
    .filter(([_, following]) => following.includes(userId))
    .map(([id]) => id);
  
  return followerIds.map(id => users[id]);
};
