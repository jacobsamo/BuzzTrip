/**
 * Return the subscription
 * @param userId
 * @return the subscription of the user and their status
 */
export async function checkSubscription() {
  return 100;
}

/**
 * checks if the user can create an item based on whether their subscription supports it
 * @param userId
 * @returns {boolean} returns the value on whether they can actually create it
 */
export async function canCreate(): Promise<boolean> {
  const subscription = await checkSubscription();

  if (subscription == 0) {
    return false;
  }

  return true;
}
