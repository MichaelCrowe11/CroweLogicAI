"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera, Loader2 } from "lucide-react"
import Image from "next/image"

type AnalysisType = "mycelium" | "substrate" | "fruiting" | "contamination"

export function ImageUpload() {
  const [selectedTab, setSelectedTab] = useState<AnalysisType>("mycelium")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a storage service
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setResults(null)
    }
  }

  const handleCameraCapture = () => {
    // In a real app, you would implement camera capture
    // For now, we'll just use a placeholder
    setImageUrl("/placeholder.svg?height=400&width=400")
    setResults(null)
  }

  const handleAnalyze = async () => {
    if (!imageUrl) return

    setIsAnalyzing(true)
    setResults(null)

    try {
      // In a real app, you would call your API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          type: selectedTab,
        }),
      })

      const data = await response.json()
      setResults(data.analysis.results)
    } catch (error) {
      console.error("Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analysisTypes = [
    { value: "mycelium", label: "Mycelium" },
    { value: "substrate", label: "Substrate" },
    { value: "fruiting", label: "Fruiting" },
    { value: "contamination", label: "Contamination" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as AnalysisType)}>
        <TabsList className="grid grid-cols-4 mb-6">
          {analysisTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {analysisTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Upload or Capture Image</h3>
                    <p className="text-sm text-muted-foreground">
                      {type.value === "mycelium"
                        ? "Upload a clear image of your mycelium growth for analysis."
                        : type.value === "substrate"
                          ? "Upload an image of your substrate for quality assessment."
                          : type.value === "fruiting"
                            ? "Upload an image of your mushroom fruiting bodies for analysis."
                            : "Upload an image of suspected contamination for identification."}
                    </p>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                      {imageUrl ? (
                        <div className="relative w-full aspect-square max-w-[300px]">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt="Uploaded image"
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <Upload className="mx-auto h-12 w-12 mb-4" />
                          <p>Drag and drop or click to upload</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button variant="outline" className="flex-1" onClick={handleCameraCapture}>
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                    </div>

                    <Button className="w-full" disabled={!imageUrl || isAnalyzing} onClick={handleAnalyze}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Image"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Analysis Results</h3>
                    {results ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">{results}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                        <p>
                          {isAnalyzing
                            ? "Analyzing your image..."
                            : imageUrl
                              ? "Click 'Analyze Image' to get results"
                              : "Upload an image to analyze"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
