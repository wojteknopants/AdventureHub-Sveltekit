import { writable } from 'svelte/store';
import toast from 'svelte-french-toast';

function createNotifier() {
  const { subscribe } = writable();

  return {
    subscribe,
    notify: (title, message, type = 'primary') => {
      console.log('NOTIFY FUNCTION -> Title: ' + title + ' Message: ' + message + ' Type: ' + type);
      switch (type.toLowerCase()) {
        case 'success':
          toast.success(message, { position: 'bottom-center' });
          break;
        case 'error':
          toast.error(message, { position: 'bottom-center' });
          break;
        default:
          toast(message, { position: 'bottom-center' });
          break;
      }
    }
  };
}

export const notifier = createNotifier();