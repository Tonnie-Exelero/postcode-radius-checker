"use client"

import { useState } from "react"
import { Container, Typography, Paper, Box } from "@mui/material"
import PostcodeForm from "@/components/postcode-form"
import ResultsDisplay from "@/components/results-display"
import MapDisplay from "@/components/map-display"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    isWithinRadius: boolean
    distance: number
    postcode: string
    postcodeLocation: { lat: number; lng: number } | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [campusLocation, setCampusLocation] = useState<{ lat: number; lng: number }>({
    lat: -37.8136, // Default to Melbourne CBD
    lng: 144.9631,
  })
  const [radius, setRadius] = useState<number>(10)

  return (
    <ThemeProvider>
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h3" component="h1" className="text-center mb-8 font-bold">
          Campus Eligibility Checker
        </Typography>

        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Paper elevation={3} className="p-6">
            <PostcodeForm
              loading={loading}
              setLoading={setLoading}
              setResult={setResult}
              setError={setError}
              campusLocation={campusLocation}
              setCampusLocation={setCampusLocation}
              radius={radius}
              setRadius={setRadius}
            />
            {error && (
              <Typography color="error" className="mt-4">
                {error}
              </Typography>
            )}
            {result && <ResultsDisplay result={result} />}
          </Paper>

          <Paper elevation={3} className="p-6 min-h-[400px]">
            <MapDisplay
              campusLocation={campusLocation}
              radius={radius}
              postcodeLocation={result?.postcodeLocation || null}
              isWithinRadius={result?.isWithinRadius || false}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
