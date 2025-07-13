'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-6">
          🎨 Test Tailwind CSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Card Test
            </h2>
            <p className="text-muted-foreground mb-4">
              Questo è un test per verificare che Tailwind CSS funzioni correttamente.
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Button Test
            </button>
          </div>
          
          <div className="bg-gradient-ocean rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold">🌊 Gradient Ocean</h3>
            <p>Custom gradient from design system</p>
          </div>
          
          <div className="bg-gradient-sunset rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold">🌅 Gradient Sunset</h3>
            <p>Custom sunset gradient</p>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              ✅ Se vedi questo testo formattato correttamente con colori e gradienti, 
              allora Tailwind CSS sta funzionando!
            </p>
          </div>
          
          <div className="flex space-x-4">
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
              Secondary
            </span>
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
              Accent
            </span>
            <span className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full text-sm">
              Destructive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}