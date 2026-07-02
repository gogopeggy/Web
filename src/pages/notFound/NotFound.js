import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NotFound = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography variant="h2" color="primary">
        404
      </Typography>
      <Typography variant="h6">Sorry, this page cannot be found.</Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 1 }}>
        Back to home
      </Button>
    </Box>
  );
};

export default NotFound;
