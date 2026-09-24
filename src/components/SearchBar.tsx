import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { InputAdornment, TextField, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  initialValue?: string;
}

function SearchBar({ initialValue = "" }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      navigate("/shop");
      return;
    }
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "background.paper",
          },
        }}
      />
    </Box>
  );
}

export default SearchBar;
