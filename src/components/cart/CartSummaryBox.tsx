import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import type { CartSummary } from "../../types";
import { formatPrice } from "../cart/utils";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";

interface CartSummaryBoxProps {
  summary: CartSummary;
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" sx={{ py: 1.5, justifyContent: "space-between" }}>
    <Typography sx={{ fontWeight: 400, color: "text.secondary" }}>
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 400, color: "content.main" }}>
      {value}
    </Typography>
  </Stack>
);

const CartSummaryBox = ({ summary }: CartSummaryBoxProps) => {
  const [isCheckedout, setIsCheckedout] = useState(false);
  const [open, setOpen] = useState(false);
  const handleCheckout = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsCheckedout(false);
  };
  const handleConfirm = () => {
    setIsCheckedout(true);
    setOpen(false);
    setTimeout(() => {
      setIsCheckedout(false);
    }, 2000);
  };
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 3 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "content.main",
          }}
        >
          Summary
        </Typography>
        <Divider />
        <SummaryRow label="Subtotal" value={formatPrice(summary.subtotal)} />
        <Divider />
        <SummaryRow
          label="Shipping (Flat Rate - Fixed)"
          value={formatPrice(summary.shipping)}
        />
        <Divider />
        <SummaryRow label="Order Total" value={formatPrice(summary.total)} />
        <Box
          sx={{
            textAlign: "center",
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{
              py: 1.5,
              mt: 2,
              mb: 2,
              fontWeight: 700,
              wordSpacing: 2,
              width: { xs: "100%", sm: "70%", md: "80%" },
            }}
            onClick={handleCheckout}
          >
            GO TO CHECKOUT
          </Button>
          <Typography
            sx={{
              mt: 2,
              fontSize: 14,
            }}
          >
            Check Out with Multiple Addresses
          </Typography>
        </Box>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Checkout Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to proceed to make the order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Disagree
          </Button>
          <Button onClick={handleConfirm}>Agree</Button>
        </DialogActions>
      </Dialog>
      <Alert
        variant="filled"
        severity="success"
        sx={{
          display: isCheckedout ? "flex" : "none",
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 9999,
        }}
      >
        Order placed successfully!
      </Alert>
    </>
  );
};

export default CartSummaryBox;
