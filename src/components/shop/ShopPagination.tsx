import { Box, Pagination } from "@mui/material";

interface ShopPaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

export default function ShopPagination({
  page,
  count,
  onChange,
}: ShopPaginationProps) {
  if (count <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 2,
        color: "primary.main",
      }}
    >
      <Pagination
        page={page}
        count={count}
        onChange={(_, value) => onChange(value)}
        color="primary"
        shape="rounded"
        size="large"
      />
    </Box>
  );
}
