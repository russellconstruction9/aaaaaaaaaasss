/**
 * Utility to clear all stored app data and start fresh
 */
export const clearAllAppData = () => {
  // Clear all localStorage data
  const keysToRemove = [
    'scc_users',
    'scc_projects', 
    'scc_tasks',
    'scc_timeLogs',
    'scc_invoices',
    'scc_inventory',
    'scc_orderList',
    'scc_currentUser'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear IndexedDB data
  return new Promise<void>((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase('ConstructTrackProDB');
    
    deleteRequest.onsuccess = () => {
      console.log('All app data cleared successfully');
      resolve();
    };
    
    deleteRequest.onerror = () => {
      console.error('Error clearing IndexedDB data:', deleteRequest.error);
      reject(deleteRequest.error);
    };
    
    deleteRequest.onblocked = () => {
      console.warn('IndexedDB deletion blocked');
      // Still resolve since localStorage was cleared
      resolve();
    };
  });
};