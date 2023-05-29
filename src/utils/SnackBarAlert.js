import { enqueueSnackbar } from 'notistack';

// Snackbar alert for when doing spatial analysis with the GP-tools
export default function snackBarAlert(message, variant) {
  return enqueueSnackbar(message, {
    variant: variant,
  });
}
