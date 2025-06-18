import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Microscope, Leaf, ListTodo, MessageSquare } from "lucide-react"
import { OpenAIStatus } from "@/components/openai-status"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Farm
        </Button>
      </div>

      {/* OpenAI Status Card */}
      <OpenAIStatus />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Microscope className="h-4 w-4 mr-2 text-earth-mushroom" />
              Mycelium Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No scans performed yet</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/scanner">Scan Mycelium</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Leaf className="h-4 w-4 mr-2 text-earth-forest" />
              Active Farms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No farms created yet</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/farm">Manage Farms</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <ListTodo className="h-4 w-4 mr-2 text-earth-soil" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No tasks scheduled</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/tasks">View Tasks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              Chat Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No chat history</p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/chat">Start Chatting</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quickstart">
        <TabsList>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="quickstart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Crowe Logic AI</CardTitle>
              <CardDescription>Your expert assistant for mushroom cultivation and farm management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Get Started</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Create your first farm</p>
                        <p className="text-sm text-muted-foreground">
                          Set up your farm details and growing environment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Add your mushroom strains</p>
                        <p className="text-sm text-muted-foreground">
                          Track different varieties and their growing conditions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Generate your daily tasks</p>
                        <p className="text-sm text-muted-foreground">
                          Get AI-recommended tasks based on your farm setup
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Use the mycelium scanner</p>
                        <p className="text-sm text-muted-foreground">
                          Upload images to analyze mycelium health and identify issues
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" asChild>
                      <Link href="/farm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Farm
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" asChild>
                      <Link href="/scanner">
                        <Microscope className="h-4 w-4 mr-2" />
                        Scan Mycelium
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" asChild>
                      <Link href="/tasks">
                        <ListTodo className="h-4 w-4 mr-2" />
                        Manage Tasks
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" asChild>
                      <Link href="/chat">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask Crowe Logic AI
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No recent activity to display</p>
                <p className="text-sm text-muted-foreground">
                  Your recent scans, tasks, and chat history will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Farm Insights</CardTitle>
              <CardDescription>AI-generated insights about your mushroom farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No insights available yet</p>
                <p className="text-sm text-muted-foreground">
                  Create a farm and add data to receive AI-powered insights
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}