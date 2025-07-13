'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Test Tailwind CSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Card Test
            </h2>
            <p className="text-muted-foreground">
              Questo è un test per verificare che Tailwind CSS funzioni correttamente.
            </p>
            <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Button Test
            </button>
          </div>
          
          <div className="bg-gradient-ocean rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold">Gradient Ocean</h3>
            <p>Custom gradient from design system</p>
          </div>
          
          <div className="bg-gradient-sunset rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold">Gradient Sunset</h3>
            <p>Custom sunset gradient</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Se vedi questo testo formattato correttamente con colori e gradienti, 
            allora Tailwind CSS sta funzionando!
          </p>
        </div>
      </div>
    </div>
  );
}