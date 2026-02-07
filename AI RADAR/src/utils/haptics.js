export const Haptics = {
    light: () => {
        if (navigator.vibrate) navigator.vibrate(10);
    },
    medium: () => {
        if (navigator.vibrate) navigator.vibrate(40);
    },
    success: () => {
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    },
    error: () => {
        if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100]);
    }
};
