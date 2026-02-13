import Swal, { SweetAlertOptions } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Base configuration for all alerts to ensure consistency
const baseConfig: SweetAlertOptions = {
    buttonsStyling: false,
    customClass: {
        confirmButton: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md shadow-primary-500/20 font-medium py-2 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mx-1',
        cancelButton: 'bg-white text-secondary-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm font-medium py-2 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 mx-1',
        popup: 'rounded-2xl shadow-soft-xl border border-secondary-100',
        title: 'font-display text-xl text-secondary-900',
        htmlContainer: 'text-secondary-600 text-sm',
        icon: 'text-xs', // scaling
    },
    width: '24em',
    padding: '1.5em',
};

// Toast configuration
const toastConfig: SweetAlertOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'rounded-xl shadow-soft-lg border-l-4 bg-white',
        title: 'font-medium text-sm text-secondary-900',
        timerProgressBar: 'bg-primary-500',
    },
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
};

export const Alert = {
    success: (title: string, text?: string) => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'success',
            title,
            text,
            confirmButtonText: 'Aceptar',
        });
    },

    error: (title: string, text?: string) => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'error',
            title,
            text,
            confirmButtonText: 'Entendido',
        });
    },

    warning: (title: string, text?: string) => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'warning',
            title,
            text,
            confirmButtonText: 'Aceptar',
        });
    },

    info: (title: string, text?: string) => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'info',
            title,
            text,
            confirmButtonText: 'Aceptar',
        });
    },

    confirm: async (title: string, text: string, confirmButtonText = 'Sí, confirmar'): Promise<boolean> => {
        const result = await MySwal.fire({
            ...baseConfig,
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });
        return result.isConfirmed;
    },

    // Toast notifications
    toast: {
        success: (title: string) => {
            MySwal.fire({
                ...toastConfig,
                icon: 'success',
                title,
                customClass: {
                    ...toastConfig.customClass,
                    popup: 'rounded-xl shadow-soft-lg border-l-4 border-success-500 bg-white',
                }
            });
        },
        error: (title: string) => {
            MySwal.fire({
                ...toastConfig,
                icon: 'error',
                title,
                customClass: {
                    ...toastConfig.customClass,
                    popup: 'rounded-xl shadow-soft-lg border-l-4 border-error-500 bg-white',
                }
            });
        },
        info: (title: string) => {
            MySwal.fire({
                ...toastConfig,
                icon: 'info',
                title,
                customClass: {
                    ...toastConfig.customClass,
                    popup: 'rounded-xl shadow-soft-lg border-l-4 border-primary-500 bg-white',
                }
            });
        },
    },
};
