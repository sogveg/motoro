"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const carBrands = [
  "Alle merker",
  "Audi",
  "BMW",
  "Ford",
  "Mercedes-Benz",
  "Nissan",
  "Peugeot",
  "Skoda",
  "Toyota",
  "Volkswagen",
  "Volvo",
]

const carTypes = ["Alle typer", "Sedan", "Stasjonsvogn", "SUV", "Kompakt", "Flerbruksbil", "Cabriolet"]

const fuelTypes = ["Alle drivstoff", "Bensin", "Diesel", "Hybrid", "Elektrisk"]

const gearTypes = ["Alle gir", "Manuell", "Automat"]

export function CarFilters() {
  const [priceRange, setPriceRange] = useState([0, 800000])
  const [yearRange, setYearRange] = useState([2015, 2024])
  const [kmRange, setKmRange] = useState([0, 200000])

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filtrer biler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand */}
        <div className="space-y-2">
          <Label>Merke</Label>
          <Select defaultValue="Alle merker">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {carBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Car Type */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select defaultValue="Alle typer">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {carTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div className="space-y-2">
          <Label>Drivstoff</Label>
          <Select defaultValue="Alle drivstoff">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gear Type */}
        <div className="space-y-2">
          <Label>Girkasse</Label>
          <Select defaultValue="Alle gir">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gearTypes.map((gear) => (
                <SelectItem key={gear} value={gear}>
                  {gear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Pris</Label>
          <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={800000} step={10000} className="mt-2" />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Fra"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Til"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="text-sm"
            />
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-4">
          <Label>Årsmodell</Label>
          <Slider value={yearRange} onValueChange={setYearRange} min={2010} max={2024} step={1} className="mt-2" />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Fra"
              value={yearRange[0]}
              onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Til"
              value={yearRange[1]}
              onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
              className="text-sm"
            />
          </div>
        </div>

        {/* Kilometer Range */}
        <div className="space-y-4">
          <Label>Kilometerstand</Label>
          <Slider value={kmRange} onValueChange={setKmRange} min={0} max={200000} step={5000} className="mt-2" />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Fra"
              value={kmRange[0]}
              onChange={(e) => setKmRange([Number(e.target.value), kmRange[1]])}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Til"
              value={kmRange[1]}
              onChange={(e) => setKmRange([kmRange[0], Number(e.target.value)])}
              className="text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Søk</Button>
          <Button variant="outline" className="w-full bg-transparent">
            Nullstill filter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
