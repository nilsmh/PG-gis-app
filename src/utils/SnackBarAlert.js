import { enqueueSnackbar } from 'notistack';

export default function snackBarAlert(message, variant) {
  return enqueueSnackbar(message, {
    variant: variant,
  });
}
