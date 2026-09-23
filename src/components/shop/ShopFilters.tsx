import {
  Box,
  Chip,
  Stack,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import type { Product } from "../../types";

export type SortOption = "price-asc" | "price-desc" | "title-asc";

export interface ShopFiltersState {
  category: Product["category"] | "all";
  sortBy: SortOption;
}

interface ShopFiltersProps {
  categories: Product["category"][];
  filters: ShopFiltersState;
  onChange: (filters: ShopFiltersState) => void;
}

const sortLabels: Record<SortOption, string> = {
  "title-asc": "Name: A-Z",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export default function ShopFilters({
  categories,
  filters,
  onChange,
}: ShopFiltersProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Chip
          label="All"
          clickable
          onClick={() => onChange({ ...filters, category: "all" })}
          color={filters.category === "all" ? "primary" : "default"}
          variant={filters.category === "all" ? "filled" : "outlined"}
        />
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            onClick={() => onChange({ ...filters, category })}
            color={filters.category === category ? "primary" : "default"}
            variant={filters.category === category ? "filled" : "outlined"}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Stack>

      <Select
        size="small"
        value={filters.sortBy}
        onChange={(e) =>
          onChange({ ...filters, sortBy: e.target.value as SortOption })
        }
        startAdornment={
          <InputAdornment position="start">
            <SwapVertIcon fontSize="small" color="action" />
          </InputAdornment>
        }
        sx={{ minWidth: 200 }}
      >
        {(Object.keys(sortLabels) as SortOption[]).map((key) => (
          <MenuItem key={key} value={key}>
            {sortLabels[key]}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
