import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLocalFriendRequests,
  saveLocalFriendRequest,
  updateLocalFriendRequestStatus,
  removeLocalFriendRequest,
  sendCloudFriendRequest,
  acceptCloudFriendRequest,
  declineCloudFriendRequest,
  cancelCloudFriendRequest,
  addCloudFriend,
  removeCloudFriend,
  isCloudFriend
} from '../services/cloudDatabaseService';
import { FriendRequest } from '../types/superApp';

describe('2-Way Friend Request & Mutual Acceptance Lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Sending a friend request creates a pending request and does NOT immediately make them friends', async () => {
    const senderId = 'usr-alice';
    const receiverId = 'usr-bob';

    const req: FriendRequest = {
      id: 'freq-test-101',
      fromUserId: senderId,
      fromUserName: 'Alice Wonderland',
      fromUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      fromUserRole: 'Explorer',
      toUserId: receiverId,
      toUserName: 'Bob Builder',
      status: 'pending',
      timestamp: '10:00 AM',
      createdAt: Date.now()
    };

    await sendCloudFriendRequest(req);

    const savedRequests = getLocalFriendRequests();
    expect(savedRequests.length).toBe(1);
    expect(savedRequests[0].id).toBe('freq-test-101');
    expect(savedRequests[0].status).toBe('pending');
    expect(savedRequests[0].fromUserId).toBe(senderId);
    expect(savedRequests[0].toUserId).toBe(receiverId);

    // CRITICAL: They must NOT be friends yet!
    const isFriendSender = isCloudFriend(receiverId);
    const isFriendReceiver = isCloudFriend(senderId);
    expect(isFriendSender).toBe(false);
    expect(isFriendReceiver).toBe(false);
  });

  it('2. Receiver accepts friend request -> status becomes accepted and both become mutual friends', async () => {
    const senderId = 'usr-alice';
    const receiverId = 'usr-bob';

    const req: FriendRequest = {
      id: 'freq-test-102',
      fromUserId: senderId,
      fromUserName: 'Alice Wonderland',
      toUserId: receiverId,
      toUserName: 'Bob Builder',
      status: 'pending',
      timestamp: '10:05 AM',
      createdAt: Date.now()
    };

    await sendCloudFriendRequest(req);

    // Receiver Bob accepts the request
    await acceptCloudFriendRequest(req.id, senderId, receiverId);

    const updatedRequests = getLocalFriendRequests();
    const acceptedReq = updatedRequests.find((r) => r.id === req.id);
    expect(acceptedReq?.status).toBe('accepted');

    // Both IDs are recorded in the friends list
    expect(isCloudFriend(senderId)).toBe(true);
    expect(isCloudFriend(receiverId)).toBe(true);
  });

  it('3. Receiver declines friend request -> request is removed and they remain non-friends', async () => {
    const senderId = 'usr-alice';
    const receiverId = 'usr-charlie';

    const req: FriendRequest = {
      id: 'freq-test-103',
      fromUserId: senderId,
      fromUserName: 'Alice Wonderland',
      toUserId: receiverId,
      toUserName: 'Charlie Brown',
      status: 'pending',
      timestamp: '10:10 AM',
      createdAt: Date.now()
    };

    await sendCloudFriendRequest(req);
    expect(getLocalFriendRequests().length).toBe(1);

    // Receiver Charlie declines
    await declineCloudFriendRequest(req.id, senderId, receiverId);

    const remainingRequests = getLocalFriendRequests();
    expect(remainingRequests.length).toBe(0);
    expect(isCloudFriend(senderId)).toBe(false);
    expect(isCloudFriend(receiverId)).toBe(false);
  });

  it('4. Sender cancels sent friend request -> request is cancelled and removed cleanly', async () => {
    const senderId = 'usr-alice';
    const receiverId = 'usr-dave';

    const req: FriendRequest = {
      id: 'freq-test-104',
      fromUserId: senderId,
      fromUserName: 'Alice Wonderland',
      toUserId: receiverId,
      toUserName: 'Dave Developer',
      status: 'pending',
      timestamp: '10:15 AM',
      createdAt: Date.now()
    };

    await sendCloudFriendRequest(req);
    expect(getLocalFriendRequests().length).toBe(1);

    // Alice decides to cancel the request
    await cancelCloudFriendRequest(senderId, receiverId);

    const remaining = getLocalFriendRequests();
    expect(remaining.length).toBe(0);
    expect(isCloudFriend(receiverId)).toBe(false);
  });

  it('5. Unfriending removes friend status and resets friendship', async () => {
    const friendId = 'usr-eve';

    await addCloudFriend(friendId);
    expect(isCloudFriend(friendId)).toBe(true);

    await removeCloudFriend(friendId);
    expect(isCloudFriend(friendId)).toBe(false);
  });
});
