/**
 * Unified Local Storage & Cloud Backup Service
 * 100% Client-side, completely free, zero server fees.
 */

export function saveToLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`omnilife_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage:`, e);
  }
}

export function loadFromLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`omnilife_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage:`, e);
    return fallback;
  }
}

export function exportBackupJSON(fullState: Record<string, unknown>): void {
  const jsonStr = JSON.stringify(fullState, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `omnilife_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importBackupJSON(file: File): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid backup file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read backup file'));
    reader.readAsText(file);
  });
}
