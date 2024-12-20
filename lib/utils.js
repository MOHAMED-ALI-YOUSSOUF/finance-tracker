export const currencyFormatter = (amount) => {
  const formatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  });
  return formatter.format(amount);
};

import Swal from "sweetalert2";

export const swalAlert = (title, icon = "info", text = "") => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "Ok",
  });
};

export const swalConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });
};
