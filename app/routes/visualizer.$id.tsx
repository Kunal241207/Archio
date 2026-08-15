import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Blocks, Download, RefreshCcw, Share2, X } from "lucide-react";
import { Button } from "../../components/ui/Button";

const visualizerId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialImage, initialRender, name } = location.state || {};

  const hasInitialGenerated = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    initialRender || null,
  );
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleBack = () => navigate("/");

  const runGeneration = async () => {
    if (!initialImage) return;

    setGenerationError(null);
    setIsProcessing(true);
    try {
      const result = await generate3DView({ sourceImage: initialImage });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);
        return;
      }

      setGenerationError(
        "The 3D visualization could not be generated. Try again.",
      );
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError(
        "The 3D visualization could not be generated. Try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!initialImage || hasInitialGenerated.current) return;

    if (initialRender) {
      setCurrentImage(initialRender);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    runGeneration();
  }, [initialImage, initialRender]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Blocks className="logo" />
          <span className="name">Archio</span>
        </div>
        <Button size="sm" variant="ghost" onClick={handleBack} className="exit">
          <X className="icon" /> Exit
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{name || "Untitled"}</h2>
              <p className="note">Created by You</p>
            </div>

            <div className="panel-actions">
              <Button size="sm" className="export" onClick={()=>{}} disabled={!currentImage}>
                <Download className="w-4 h-4 mr-2"/> Export
              </Button>

              <Button size="sm" className="share" onClick={()=>{}} disabled={!currentImage}>
                <Share2 className="w-4 h-4 mr-2"/> Share
              </Button>
            </div> 
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="Rendered 3D View" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {initialImage && (
                  <img src={initialImage} alt="Original Image" className="render-fallback" />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">Generating your 3D visualization</span>
                </div>
              </div>
            )}

            {generationError && !isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <span className="title">Generation failed</span>
                  <span className="subtitle">{generationError}</span>
                  <Button size="sm" onClick={runGeneration} disabled={isProcessing}>
                    <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default visualizerId;
