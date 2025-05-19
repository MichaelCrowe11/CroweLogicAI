import { ImageUpload } from "@/components/scanner/image-upload"

export default function ScannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mycelium Scanner</h1>
        <p className="text-muted-foreground">
          Upload images of your mycelium, substrate, or fruiting bodies for AI analysis
        </p>
      </div>

      <ImageUpload />
    </div>
  )
}
