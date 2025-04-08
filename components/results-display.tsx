"use client";

import { Alert, Box, Chip, Typography } from "@mui/material";
import { CheckCircle, Cancel, LocationOn } from "@mui/icons-material";

interface ResultsDisplayProps {
  result: {
    isWithinRadius: boolean;
    distance: number;
    postcode: string;
  };
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <Box className="mt-6 p-4 border rounded-lg bg-gray-50">
      <Typography variant="h6" className="mb-2">
        Results
      </Typography>

      <Box className="flex items-center mb-2">
        <LocationOn className="mr-2" />
        <Typography>
          Postcode: <strong>{result.postcode}</strong>
        </Typography>
      </Box>

      <Box className="flex items-center mb-2">
        <Typography>
          Distance from campus: <strong>{result.distance} km</strong>
        </Typography>
      </Box>

      <Alert
        severity={result.isWithinRadius ? "success" : "error"}
        icon={result.isWithinRadius ? <CheckCircle /> : <Cancel />}
        className="mt-3"
      >
        <Typography variant="body1">
          {result.isWithinRadius
            ? "This postcode is within the allowable radius. Students are eligible to take courses."
            : "This postcode is outside the allowable radius. Students are not eligible to take courses."}
        </Typography>
      </Alert>

      <Box className="mt-4 flex justify-end">
        <Chip
          label={result.isWithinRadius ? "ELIGIBLE" : "NOT ELIGIBLE"}
          color={result.isWithinRadius ? "success" : "error"}
          variant="outlined"
        />
      </Box>
    </Box>
  );
}
