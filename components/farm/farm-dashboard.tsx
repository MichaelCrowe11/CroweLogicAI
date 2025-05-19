"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Thermometer, Droplets, Wind, Sun } from "lucide-react"
import type { Farm } from "@/lib/redis"

export function FarmDashboard() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFarms() {
      try {
        const response = await fetch("/api/farms")
        const data = await response.json()
        if (data.farms && data.farms.length > 0) {
          setFarms(data.farms)
          setSelectedFarm(data.farms[0])
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching farms:", error)
        setIsLoading(false)
      }
    }

    fetchFarms()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Loading farm data...</p>
      </div>
    )
  }

  if (farms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <p className="text-muted-foreground">No farms found. Create your first farm to get started.</p>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Farm
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Farm Dashboard</h2>
          <p className="text-muted-foreground">Manage your mushroom farms and monitor conditions</p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Farm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {farms.map((farm) => (
          <Card
            key={farm.id}
            className={`cursor-pointer transition-all ${selectedFarm?.id === farm.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedFarm(farm)}
          >
            <CardHeader className="pb-2">
              <CardTitle>{farm.name}</CardTitle>
              <CardDescription>{farm.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{farm.description}</p>
              <p className="text-sm mt-2">
                <span className="font-medium">Size:</span> {farm.size}
              </p>
              <p className="text-sm">
                <span className="font-medium">Strains:</span> {farm.strains.length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedFarm && (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strains">Strains</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Farm Overview</CardTitle>
                <CardDescription>Key information about {selectedFarm.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Details</h3>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Location:</span> {selectedFarm.location}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Size:</span> {selectedFarm.size}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(selectedFarm.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm">{selectedFarm.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-earth-mushroom" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedFarm.environmentalData?.temperature || "--"}°C</div>
                  <p className="text-xs text-muted-foreground">Last updated: 5 minutes ago</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedFarm.environmentalData?.humidity || "--"}%</div>
                  <p className="text-xs text-muted-foreground">Last updated: 5 minutes ago</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Wind className="h-4 w-4 mr-2 text-gray-500" />
                    CO₂ Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedFarm.environmentalData?.co2 || "--"} ppm</div>
                  <p className="text-xs text-muted-foreground">Last updated: 5 minutes ago</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                    Light
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedFarm.environmentalData?.light || "--"} lux</div>
                  <p className="text-xs text-muted-foreground">Last updated: 5 minutes ago</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strains">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Strains</CardTitle>
                    <CardDescription>Manage your mushroom strains</CardDescription>
                  </div>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Strain
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedFarm.strains.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFarm.strains.map((strain) => (
                      <Card key={strain.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{strain.name}</CardTitle>
                          <CardDescription>{strain.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p>{strain.description}</p>
                          <p>
                            <span className="font-medium">Growth Rate:</span> {strain.growthRate}
                          </p>
                          <p>
                            <span className="font-medium">Substrate:</span> {strain.preferredSubstrate}
                          </p>
                          <div>
                            <p className="font-medium">Optimal Conditions:</p>
                            <ul className="list-disc list-inside pl-2">
                              <li>Temp: {strain.optimalConditions.temperature}</li>
                              <li>Humidity: {strain.optimalConditions.humidity}</li>
                              <li>Light: {strain.optimalConditions.light}</li>
                              <li>CO₂: {strain.optimalConditions.co2}</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No strains added yet</p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Strain
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Monitoring</CardTitle>
                <CardDescription>Track and optimize growing conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Environmental data charts will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Farm Tasks</CardTitle>
                    <CardDescription>Manage your daily farm operations</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Generate Daily Tasks
                    </Button>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No tasks scheduled for this farm</p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
