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

const SORT_OPTIONS = ["title-asc", "price-asc", "price-desc"] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

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

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option === value);
}

export default function ShopFilters({
  categories,
  filters,
  onChange,
}: ShopFiltersProps) {
  const handleSortChange = (value: string) => {
    if (!isSortOption(value)) {
      console.warn(`Unknown sort option: ${value}`);
      return;
    }

    onChange({ ...filters, sortBy: value });
  };

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
        onChange={(e) => handleSortChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SwapVertIcon fontSize="small" color="action" />
          </InputAdornment>
        }
        sx={{ minWidth: 200 }}
      >
        {SORT_OPTIONS.map((key) => (
          <MenuItem key={key} value={key}>
            {sortLabels[key]}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
