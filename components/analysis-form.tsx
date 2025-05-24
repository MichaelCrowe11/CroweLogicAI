"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

type AnalysisType = "species" | "environmental" | "business"

export function AnalysisForm() {
  const [query, setQuery] = useState("")
  const [analysisType, setAnalysisType] = useState<AnalysisType>("species")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, type: analysisType }),
      })

      const data = await response.json()
      setResult(data.analysis)
    } catch (error) {
      console.error("Error analyzing:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analysis</CardTitle>
          <CardDescription>
            Get detailed analysis for mycology, environmental applications, or business strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={analysisType} onValueChange={(value) => setAnalysisType(value as AnalysisType)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="species">Species Analysis</TabsTrigger>
              <TabsTrigger value="environmental">Environmental</TabsTrigger>
              <TabsTrigger value="business">Business Strategy</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  analysisType === "species"
                    ? "Enter a fungal species name (e.g., 'Pleurotus ostreatus')"
                    : analysisType === "environmental"
                      ? "Describe an environmental challenge (e.g., 'Soil contamination in urban areas')"
                      : "Describe a mycology business concept (e.g., 'Mushroom-based packaging company')"
                }
                className="mb-4"
                rows={4}
              />

              <Button type="submit" disabled={isLoading || !query.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Generate Analysis"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>

        {result && (
          <CardFooter className="flex flex-col items-start">
            <div className="w-full mt-4 p-4 bg-gray-50 rounded-md">
              {analysisType === "species" && result.species && (
                <div>
                  <h3 className="text-xl font-bold mb-2">{result.species.scientificName}</h3>
                  <p className="text-gray-500 mb-4">Common names: {result.species.commonNames.join(", ")}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">Taxonomy</h4>
                      <ul className="list-disc list-inside text-sm">
                        {Object.entries(result.species.taxonomy).map(([key, value]) => (
                          <li key={key}>
                            {key}: {value as string}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Characteristics</h4>
                      <ul className="list-disc list-inside text-sm">
                        {Object.entries(result.species.characteristics).map(([key, value]) => (
                          <li key={key}>
                            {key}: {value as string}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Ecological Role</h4>
                    <p>{result.species.ecologicalRole}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Applications</h4>
                    <ul className="list-disc list-inside">
                      {result.species.applications.map((app: string, i: number) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>

                  {result.species.cultivationNotes && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-1">Cultivation Notes</h4>
                      <p>{result.species.cultivationNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {analysisType === "environmental" && result.analysis && (
                <div>
                  <h3 className="text-xl font-bold mb-2">{result.analysis.title}</h3>
                  <p className="mb-4">{result.analysis.summary}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Environmental Factors</h4>
                    {result.analysis.environmentalFactors.map((factor: any, i: number) => (
                      <div key={i} className="mb-3 p-3 bg-white rounded-md">
                        <h5 className="font-medium">{factor.factor}</h5>
                        <p className="text-sm mb-2">{factor.impact}</p>
                        <div>
                          <span className="text-sm font-medium">Mitigation Strategies:</span>
                          <ul className="list-disc list-inside text-sm">
                            {factor.mitigationStrategies.map((strategy: string, j: number) => (
                              <li key={j}>{strategy}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Mycelium Applications</h4>
                    {result.analysis.myceliumApplications.map((app: any, i: number) => (
                      <div key={i} className="mb-3 p-3 bg-white rounded-md">
                        <h5 className="font-medium">{app.application}</h5>
                        <div className="mb-2">
                          <span className="text-sm font-medium">Benefits:</span>
                          <ul className="list-disc list-inside text-sm">
                            {app.benefits.map((benefit: string, j: number) => (
                              <li key={j}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-medium">Implementation:</span>
                          <ol className="list-decimal list-inside text-sm">
                            {app.implementationSteps.map((step: string, j: number) => (
                              <li key={j}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Challenges:</span>
                          <ul className="list-disc list-inside text-sm">
                            {app.challenges.map((challenge: string, j: number) => (
                              <li key={j}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Conclusion</h4>
                    <p>{result.analysis.conclusion}</p>
                  </div>
                </div>
              )}

              {analysisType === "business" && result.strategy && (
                <div>
                  <h3 className="text-xl font-bold mb-2">{result.strategy.title}</h3>
                  <p className="mb-4">{result.strategy.overview}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Market Analysis</h4>
                    <p>{result.strategy.marketAnalysis}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">SWOT Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-md">
                        <h5 className="font-medium text-green-700">Strengths</h5>
                        <ul className="list-disc list-inside text-sm">
                          {result.strategy.swot.strengths.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-red-50 rounded-md">
                        <h5 className="font-medium text-red-700">Weaknesses</h5>
                        <ul className="list-disc list-inside text-sm">
                          {result.strategy.swot.weaknesses.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <h5 className="font-medium text-blue-700">Opportunities</h5>
                        <ul className="list-disc list-inside text-sm">
                          {result.strategy.swot.opportunities.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-md">
                        <h5 className="font-medium text-amber-700">Threats</h5>
                        <ul className="list-disc list-inside text-sm">
                          {result.strategy.swot.threats.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    {result.strategy.recommendations.map((rec: any, i: number) => (
                      <div key={i} className="mb-3 p-3 bg-white rounded-md">
                        <h5 className="font-medium">{rec.title}</h5>
                        <p className="text-sm mb-2">{rec.description}</p>
                        <p className="text-sm mb-2">
                          <span className="font-medium">Implementation:</span> {rec.implementation}
                        </p>
                        <div>
                          <span className="text-sm font-medium">Success Metrics:</span>
                          <ul className="list-disc list-inside text-sm">
                            {rec.metrics.map((metric: string, j: number) => (
                              <li key={j}>{metric}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Sustainability Considerations</h4>
                    <p>{result.strategy.sustainabilityConsiderations}</p>
                  </div>
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
