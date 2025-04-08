"use client";

import type React from "react";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Slider,
  InputAdornment,
  Grid,
  Autocomplete,
} from "@mui/material";
import { LocationOn, RadioButtonChecked, Search } from "@mui/icons-material";
import axios from "axios";

// Common campus locations in Australia
const commonCampuses = [
  {
    name: "University of Melbourne",
    location: { lat: -37.7963, lng: 144.9614 },
  },
  { name: "University of Sydney", location: { lat: -33.8882, lng: 151.1873 } },
  { name: "Monash University", location: { lat: -37.9105, lng: 145.1363 } },
  { name: "UNSW Sydney", location: { lat: -33.9173, lng: 151.2313 } },
  {
    name: "Australian National University",
    location: { lat: -35.2777, lng: 149.1185 },
  },
];

interface PostcodeFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setResult: (result: any) => void;
  setError: (error: string | null) => void;
  campusLocation: { lat: number; lng: number };
  setCampusLocation: (location: { lat: number; lng: number }) => void;
  radius: number;
  setRadius: (radius: number) => void;
}

export default function PostcodeForm({
  loading,
  setLoading,
  setResult,
  setError,
  campusLocation,
  setCampusLocation,
  radius,
  setRadius,
}: PostcodeFormProps) {
  const [postcode, setPostcode] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postcode || postcode.length < 4) {
      setError("Please enter a valid Australian postcode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch postcode data
      const response = await axios.get(
        `https://www.candlefox.com/wp-json/api/v1/postcodes-au?q=${postcode}`
      );

      const {
        data: {
          records: { zipcodes },
        },
      } = response;

      const postcodeData = zipcodes[0];

      if (!zipcodes || zipcodes.length === 0 || !postcodeData) {
        throw new Error("Postcode not found");
      }

      if (!postcodeData.lat || !postcodeData.lng) {
        throw new Error("Location data not available for this postcode");
      }

      const postcodeLocation = {
        lat: Number.parseFloat(postcodeData.lat),
        lng: Number.parseFloat(postcodeData.lng),
      };

      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        campusLocation.lat,
        campusLocation.lng,
        postcodeLocation.lat,
        postcodeLocation.lng
      );

      // Check if within radius
      const isWithinRadius = distance <= radius;

      setResult({
        isWithinRadius,
        distance,
        postcode,
        postcodeLocation,
      });
    } catch (error) {
      console.error("Error fetching postcode data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while checking the postcode"
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCampusChange = (_: any, value: string | null) => {
    setSelectedCampus(value);
    const campus = commonCampuses.find((c) => c.name === value);
    if (campus) {
      setCampusLocation(campus.location);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" className="mb-4" sx={{ marginBlockEnd: 2 }}>
        Check Student Eligibility by Postcode
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Autocomplete
            options={commonCampuses.map((c) => c.name)}
            value={selectedCampus}
            onChange={handleCampusChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Campus"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <LocationOn color="primary" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Typography gutterBottom>Campus Radius (km)</Typography>
          <Slider
            value={radius}
            onChange={(_, newValue) => setRadius(newValue as number)}
            aria-labelledby="radius-slider"
            valueLabelDisplay="auto"
            step={25}
            marks
            min={50}
            max={250}
            className="mb-4"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            label="Enter Australian Postcode"
            variant="outlined"
            fullWidth
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. 3000"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RadioButtonChecked color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Search />
              )
            }
          >
            {loading ? "Checking..." : "Check Eligibility"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Number.parseFloat(distance.toFixed(2));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
