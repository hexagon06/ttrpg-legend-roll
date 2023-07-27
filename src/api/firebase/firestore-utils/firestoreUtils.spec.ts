import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from 'firebase/auth';
import { userHasRole } from '.';
import { Mock } from 'moq.ts';

describe('userHasRole', () => {
  let mockUser: Mock<User>;
  beforeEach(() => {
    mockUser = new Mock<User>();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a path for roles', () => {
    mockUser.setup((instance) => instance.uid).returns('userID');

    const result = userHasRole(mockUser.object(), 'my-role');
    expect(result.type).toEqual('where');
  });
});
